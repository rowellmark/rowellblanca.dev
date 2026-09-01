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

        processedResults.push({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          clientEmail: invoice.clientEmail,
          success: true,
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
