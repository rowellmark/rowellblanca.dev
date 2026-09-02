import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { sendInvoiceEmail } from '@/lib/mailer';

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const searchParam = searchParams.get('search');

    let whereClause: any = {};

    if (statusParam && statusParam !== 'ALL') {
      if (statusParam === 'RECURRING') {
        whereClause.isRecurring = true;
      } else {
        whereClause.status = statusParam;
      }
    }

    if (searchParam && searchParam.trim()) {
      const q = searchParam.trim();
      whereClause.OR = [
        { invoiceNumber: { contains: q, mode: 'insensitive' } },
        { clientName: { contains: q, mode: 'insensitive' } },
        { clientEmail: { contains: q, mode: 'insensitive' } },
        { clientCompany: { contains: q, mode: 'insensitive' } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        items: {
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Summary statistics
    const allInvoices = await prisma.invoice.findMany({
      select: {
        status: true,
        totalAmount: true,
      },
    });

    const stats = {
      totalInvoiced: allInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0),
      totalPaid: allInvoices.filter((i) => i.status === 'PAID').reduce((acc, inv) => acc + (inv.totalAmount || 0), 0),
      totalPending: allInvoices.filter((i) => i.status === 'SENT' || i.status === 'SCHEDULED').reduce((acc, inv) => acc + (inv.totalAmount || 0), 0),
      countTotal: allInvoices.length,
      countScheduled: allInvoices.filter((i) => i.status === 'SCHEDULED').length,
      countSent: allInvoices.filter((i) => i.status === 'SENT').length,
      countPaid: allInvoices.filter((i) => i.status === 'PAID').length,
      countDraft: allInvoices.filter((i) => i.status === 'DRAFT').length,
    };

    return NextResponse.json({
      success: true,
      invoices,
      stats,
    });
  } catch (error: any) {
    console.error('[API/admin/invoices GET] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      invoiceNumber: customInvoiceNumber,
      clientName,
      clientEmail,
      clientCompany,
      clientPhone,
      clientAddress,
      tagline = 'Bring your ideas in to reality.',
      currency = 'USD',
      items = [],
      discount = 0,
      taxRate = 0,
      isRecurring = false,
      recurringInterval = 'NONE',
      issueDate,
      dueDate,
      scheduledSendDate,
      sendNow = false,
      paymentTerms,
      paymentDetails,
      notes,
    } = body;

    if (!clientName || !clientEmail) {
      return NextResponse.json({ success: false, message: 'Client name and email are required' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'At least one job item is required' }, { status: 400 });
    }

    // Auto generate invoice number if not provided
    let invoiceNumber = customInvoiceNumber?.trim();
    if (!invoiceNumber) {
      const year = new Date().getFullYear();
      const count = await prisma.invoice.count();
      invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, '0')}`;
    }

    // Check uniqueness
    const existing = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });
    if (existing) {
      invoiceNumber = `${invoiceNumber}-${Date.now().toString().slice(-4)}`;
    }

    // Calculate subtotal & total
    const computedItems = items.map((item: any) => {
      const qty = Math.max(0.01, Number(item.quantity || 1));
      const price = Math.max(0, Number(item.unitPrice || 0));
      return {
        description: item.description?.trim() || 'Service Deliverable',
        details: item.details?.trim() || null,
        quantity: qty,
        unitPrice: price,
        amount: Number((qty * price).toFixed(2)),
      };
    });

    const subtotal = computedItems.reduce((acc: number, it: any) => acc + it.amount, 0);
    const numDiscount = Math.max(0, Number(discount || 0));
    const numTaxRate = Math.max(0, Number(taxRate || 0));
    const taxable = Math.max(0, subtotal - numDiscount);
    const taxAmount = Number((taxable * (numTaxRate / 100)).toFixed(2));
    const totalAmount = Number((taxable + taxAmount).toFixed(2));

    const finalIssueDate = issueDate ? new Date(issueDate) : new Date();
    const finalDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const finalScheduledDate = scheduledSendDate ? new Date(scheduledSendDate) : null;

    let initialStatus: 'DRAFT' | 'SCHEDULED' | 'SENT' = 'DRAFT';
    if (sendNow) {
      initialStatus = 'SENT';
    } else if (finalScheduledDate && finalScheduledDate > new Date()) {
      initialStatus = 'SCHEDULED';
    }

    // Calculate next recurring date if recurring schedule is enabled
    let nextRecurringDate: Date | null = null;
    if (isRecurring && recurringInterval && recurringInterval !== 'NONE') {
      const base = finalScheduledDate || finalIssueDate;
      const next = new Date(base);
      if (recurringInterval === 'MONTHLY') {
        next.setMonth(next.getMonth() + 1);
      } else if (recurringInterval === 'BIWEEKLY') {
        next.setDate(next.getDate() + 14);
      } else if (recurringInterval === 'WEEKLY') {
        next.setDate(next.getDate() + 7);
      }
      nextRecurringDate = next;
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientCompany: clientCompany?.trim() || null,
        clientPhone: clientPhone?.trim() || null,
        clientAddress: clientAddress?.trim() || null,
        tagline: tagline?.trim() || 'Bring your ideas in to reality.',
        currency: currency.toUpperCase(),
        subtotal,
        discount: numDiscount,
        taxRate: numTaxRate,
        totalAmount,
        isRecurring: Boolean(isRecurring),
        recurringInterval: isRecurring ? (recurringInterval || 'MONTHLY') : 'NONE',
        nextRecurringDate,
        issueDate: finalIssueDate,
        dueDate: finalDueDate,
        scheduledSendDate: finalScheduledDate,
        status: initialStatus,
        sentAt: sendNow ? new Date() : null,
        paymentTerms: paymentTerms?.trim() || null,
        paymentDetails: paymentDetails?.trim() || null,
        notes: notes?.trim() || null,
        items: {
          create: computedItems,
        },
      },
      include: {
        items: true,
      },
    });

    // If sendNow was requested, dispatch the email immediately
    let emailResult = null;
    if (sendNow) {
      try {
        emailResult = await sendInvoiceEmail({
          invoiceNumber: newInvoice.invoiceNumber,
          clientName: newInvoice.clientName,
          clientEmail: newInvoice.clientEmail,
          clientCompany: newInvoice.clientCompany,
          clientPhone: newInvoice.clientPhone,
          clientAddress: newInvoice.clientAddress,
          tagline: newInvoice.tagline,
          currency: newInvoice.currency,
          subtotal: newInvoice.subtotal,
          discount: newInvoice.discount,
          taxRate: newInvoice.taxRate,
          totalAmount: newInvoice.totalAmount,
          issueDate: newInvoice.issueDate,
          dueDate: newInvoice.dueDate,
          paymentTerms: newInvoice.paymentTerms,
          paymentDetails: newInvoice.paymentDetails,
          items: newInvoice.items,
        });
      } catch (mailErr) {
        console.error('[API/admin/invoices POST] Send mail error:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      invoice: newInvoice,
      emailResult,
      message: sendNow ? 'Invoice created and sent successfully' : 'Invoice created successfully',
    });
  } catch (error: any) {
    console.error('[API/admin/invoices POST] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      invoiceNumber,
      clientName,
      clientEmail,
      clientCompany,
      clientPhone,
      clientAddress,
      tagline,
      currency,
      items,
      discount,
      taxRate,
      isRecurring,
      recurringInterval,
      issueDate,
      dueDate,
      scheduledSendDate,
      status,
      paymentTerms,
      paymentDetails,
      notes,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invoice ID is required' }, { status: 400 });
    }

    const invoiceId = Number(id);

    // If items are provided, replace them and recalculate
    let computedItems: any[] | undefined = undefined;
    let subtotal: number | undefined = undefined;
    let totalAmount: number | undefined = undefined;

    if (Array.isArray(items)) {
      computedItems = items.map((item: any) => {
        const qty = Math.max(0.01, Number(item.quantity || 1));
        const price = Math.max(0, Number(item.unitPrice || 0));
        return {
          description: item.description?.trim() || 'Service Deliverable',
          details: item.details?.trim() || null,
          quantity: qty,
          unitPrice: price,
          amount: Number((qty * price).toFixed(2)),
        };
      });

      subtotal = computedItems.reduce((acc: number, it: any) => acc + it.amount, 0);
      const numDiscount = Math.max(0, Number(discount ?? 0));
      const numTaxRate = Math.max(0, Number(taxRate ?? 0));
      const taxable = Math.max(0, (subtotal ?? 0) - numDiscount);
      const taxAmount = Number((taxable * (numTaxRate / 100)).toFixed(2));
      totalAmount = Number((taxable + taxAmount).toFixed(2));

      // Delete existing items
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId },
      });
    }

    // Calculate next recurring date if recurring schedule is updated
    let nextRecurringDate: Date | null | undefined = undefined;
    if (isRecurring !== undefined) {
      if (isRecurring && recurringInterval && recurringInterval !== 'NONE') {
        const base = scheduledSendDate ? new Date(scheduledSendDate) : issueDate ? new Date(issueDate) : new Date();
        const next = new Date(base);
        if (recurringInterval === 'MONTHLY') {
          next.setMonth(next.getMonth() + 1);
        } else if (recurringInterval === 'BIWEEKLY') {
          next.setDate(next.getDate() + 14);
        } else if (recurringInterval === 'WEEKLY') {
          next.setDate(next.getDate() + 7);
        }
        nextRecurringDate = next;
      } else if (!isRecurring) {
        nextRecurringDate = null;
      }
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        ...(invoiceNumber ? { invoiceNumber: invoiceNumber.trim() } : {}),
        ...(clientName ? { clientName: clientName.trim() } : {}),
        ...(clientEmail ? { clientEmail: clientEmail.trim().toLowerCase() } : {}),
        ...(clientCompany !== undefined ? { clientCompany: clientCompany?.trim() || null } : {}),
        ...(clientPhone !== undefined ? { clientPhone: clientPhone?.trim() || null } : {}),
        ...(clientAddress !== undefined ? { clientAddress: clientAddress?.trim() || null } : {}),
        ...(tagline !== undefined ? { tagline: tagline?.trim() || 'Bring your ideas in to reality.' } : {}),
        ...(currency ? { currency: currency.toUpperCase() } : {}),
        ...(subtotal !== undefined ? { subtotal } : {}),
        ...(discount !== undefined ? { discount: Number(discount) } : {}),
        ...(taxRate !== undefined ? { taxRate: Number(taxRate) } : {}),
        ...(totalAmount !== undefined ? { totalAmount } : {}),
        ...(isRecurring !== undefined ? { isRecurring: Boolean(isRecurring) } : {}),
        ...(recurringInterval !== undefined ? { recurringInterval } : {}),
        ...(nextRecurringDate !== undefined ? { nextRecurringDate } : {}),
        ...(issueDate ? { issueDate: new Date(issueDate) } : {}),
        ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
        ...(scheduledSendDate !== undefined
          ? { scheduledSendDate: scheduledSendDate ? new Date(scheduledSendDate) : null }
          : {}),
        ...(status ? { status } : {}),
        ...(status === 'PAID' ? { paidAt: new Date() } : {}),
        ...(status === 'SENT' ? { sentAt: new Date() } : {}),
        ...(paymentTerms !== undefined ? { paymentTerms: paymentTerms?.trim() || null } : {}),
        ...(paymentDetails !== undefined ? { paymentDetails: paymentDetails?.trim() || null } : {}),
        ...(notes !== undefined ? { notes: notes?.trim() || null } : {}),
        ...(computedItems
          ? {
              items: {
                create: computedItems,
              },
            }
          : {}),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, invoice: updatedInvoice });
  } catch (error: any) {
    console.error('[API/admin/invoices PUT] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invoice ID is required' }, { status: 400 });
    }

    await prisma.invoice.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error: any) {
    console.error('[API/admin/invoices DELETE] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to delete invoice' }, { status: 500 });
  }
}
