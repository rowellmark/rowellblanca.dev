import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { sendInvoiceEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  // Allow authenticated admin, or bearer secret token for cron triggers
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isCronAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isAdminAuthenticated() && !isCronAuthorized) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    // Find all scheduled invoices that are due to be sent
    const dueInvoices = await prisma.invoice.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledSendDate: {
          lte: now,
        },
      },
      include: {
        items: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (dueInvoices.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No scheduled invoices due for sending at this time.',
        processedCount: 0,
        processed: [],
      });
    }

    const processedResults = [];

    for (const invoice of dueInvoices) {
      try {
        const mailRes = await sendInvoiceEmail({
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          clientCompany: invoice.clientCompany,
          clientPhone: invoice.clientPhone,
          clientAddress: invoice.clientAddress,
          tagline: invoice.tagline,
          currency: invoice.currency,
          subtotal: invoice.subtotal,
          discount: invoice.discount,
          taxRate: invoice.taxRate,
          totalAmount: invoice.totalAmount,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          paymentTerms: invoice.paymentTerms,
          paymentDetails: invoice.paymentDetails,
          items: invoice.items,
        });

        const updated = await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        // If recurring invoice (e.g. Monthly Retainer), spawn next cycle's scheduled invoice
        let nextCycleInvoiceNumber = null;
        if (invoice.isRecurring && invoice.recurringInterval && invoice.recurringInterval !== 'NONE') {
          try {
            const baseSendDate = invoice.scheduledSendDate || invoice.issueDate || new Date();
            const nextSendDate = new Date(baseSendDate);
            const nextDueDate = new Date(invoice.dueDate || baseSendDate);

            if (invoice.recurringInterval === 'MONTHLY') {
              nextSendDate.setMonth(nextSendDate.getMonth() + 1);
              nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            } else if (invoice.recurringInterval === 'BIWEEKLY') {
              nextSendDate.setDate(nextSendDate.getDate() + 14);
              nextDueDate.setDate(nextDueDate.getDate() + 14);
            } else if (invoice.recurringInterval === 'WEEKLY') {
              nextSendDate.setDate(nextSendDate.getDate() + 7);
              nextDueDate.setDate(nextDueDate.getDate() + 7);
            }

            const totalCount = await prisma.invoice.count();
            const year = nextSendDate.getFullYear();
            const nextInvNum = `INV-${year}-${String(totalCount + 1).padStart(3, '0')}`;

            const nextInvoice = await prisma.invoice.create({
              data: {
                invoiceNumber: nextInvNum,
                clientName: invoice.clientName,
                clientEmail: invoice.clientEmail,
                clientCompany: invoice.clientCompany,
                clientPhone: invoice.clientPhone,
                clientAddress: invoice.clientAddress,
                tagline: invoice.tagline,
                currency: invoice.currency,
                subtotal: invoice.subtotal,
                discount: invoice.discount,
                taxRate: invoice.taxRate,
                totalAmount: invoice.totalAmount,
                isRecurring: true,
                recurringInterval: invoice.recurringInterval,
                issueDate: nextSendDate,
                dueDate: nextDueDate,
                scheduledSendDate: nextSendDate,
                status: 'SCHEDULED',
                paymentTerms: invoice.paymentTerms,
                paymentDetails: invoice.paymentDetails,
                notes: invoice.notes,
                items: {
                  create: invoice.items.map((it) => ({
                    description: it.description,
                    details: it.details,
                    quantity: it.quantity,
                    unitPrice: it.unitPrice,
                    amount: it.amount,
                  })),
                },
              },
            });
            nextCycleInvoiceNumber = nextInvoice.invoiceNumber;
          } catch (recurErr) {
            console.error(`[Process-Scheduled] Failed to spawn next recurring cycle for #${invoice.invoiceNumber}:`, recurErr);
          }
        }

        processedResults.push({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          clientEmail: invoice.clientEmail,
          success: true,
          nextCycleInvoiceNumber,
          mailResult: mailRes,
        });
      } catch (err: any) {
        console.error(`[Process-Scheduled] Error sending invoice #${invoice.invoiceNumber}:`, err);
        processedResults.push({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          clientEmail: invoice.clientEmail,
          success: false,
          error: err?.message || 'Failed to send',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${dueInvoices.length} scheduled invoice(s).`,
      processedCount: dueInvoices.length,
      processed: processedResults,
    });
  } catch (error: any) {
    console.error('[API/admin/invoices/process-scheduled POST] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to process scheduled invoices' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Return current due count and pending queue
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const scheduled = await prisma.invoice.findMany({
      where: {
        status: 'SCHEDULED',
      },
      include: {
        items: true,
      },
      orderBy: { scheduledSendDate: 'asc' },
    });

    const dueNow = scheduled.filter((inv) => inv.scheduledSendDate && inv.scheduledSendDate <= now);

    return NextResponse.json({
      success: true,
      totalScheduled: scheduled.length,
      dueNowCount: dueNow.length,
      scheduledInvoices: scheduled,
      dueInvoices: dueNow,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Error checking queue' }, { status: 500 });
  }
}
