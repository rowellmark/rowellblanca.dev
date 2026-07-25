import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error('[API/crm/messages GET] Error:', error);
    return NextResponse.json({ success: false, messages: [] });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ success: true, message: 'Status updated', messageItem: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to update status' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await prisma.contactMessage.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to delete' }, { status: 500 });
  }
}
