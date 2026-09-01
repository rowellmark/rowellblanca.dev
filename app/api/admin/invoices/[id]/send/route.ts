import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { sendInvoiceEmail } from '@/lib/mailer';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const invoiceId = Number(params.id);
    if (!invoiceId) {
      return NextResponse.json({ success: false, message: 'Invalid invoice ID' }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 });
    }

    const mailResult = await sendInvoiceEmail({
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
      where: { id: invoiceId },
      data: {
        status: invoice.status === 'PAID' ? 'PAID' : 'SENT',
        sentAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Invoice #${invoice.invoiceNumber} sent successfully to ${invoice.clientEmail}`,
      invoice: updated,
      mailResult,
    });
  } catch (error: any) {
    console.error('[API/admin/invoices/[id]/send POST] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to send invoice' }, { status: 500 });
  }
}
