import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    if (!rawId) {
      return NextResponse.json({ success: false, message: 'Invoice ID is required' }, { status: 400 });
    }

    const numericId = Number(rawId);

    const invoice = await prisma.invoice.findFirst({
      where: isNaN(numericId)
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
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch invoice' }, { status: 500 });
  }
}
