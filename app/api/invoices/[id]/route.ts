import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated, isValidInvoiceToken } from '@/lib/auth';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const rawId = params.id;
    if (!rawId) {
      return NextResponse.json({ success: false, message: 'Invoice ID is required' }, { status: 400 });
    }

    // Clients reach their invoice through a signed link (/invoice/INV-…?t=…); only the admin
    // may look invoices up by number without a token, or by numeric id.
    const isAdmin = await isAdminAuthenticated();
    const token = new URL(request.url).searchParams.get('t');
    if (!isAdmin && !isValidInvoiceToken(rawId, token)) {
      return NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 });
    }

    const numericId = Number(rawId);

    const invoice = await prisma.invoice.findFirst({
      where: !isAdmin || isNaN(numericId)
        ? { invoiceNumber: rawId }
        : {
            OR: [
              { id: numericId },
              { invoiceNumber: rawId },
            ],
          },
      include: {
        items: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error: any) {
    console.error('[API/invoices/[id] GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch invoice' }, { status: 500 });
  }
}
