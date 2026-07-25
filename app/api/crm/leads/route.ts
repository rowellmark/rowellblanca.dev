import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { LeadStatus } from '@/lib/generated/client';

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    let whereClause = {};
    if (statusParam && statusParam !== 'ALL' && Object.values(LeadStatus).includes(statusParam as LeadStatus)) {
      whereClause = { status: statusParam as LeadStatus };
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ success: true, leads: [] });
  }
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Lead ID and status are required' }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: Number(id) },
      data: {
        status: status as LeadStatus,
      },
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to update lead status' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId, content } = body;

    if (!leadId || !content) {
      return NextResponse.json({ success: false, message: 'Lead ID and note content are required' }, { status: 400 });
    }

    const newNote = await prisma.leadNote.create({
      data: {
        leadId: Number(leadId),
        content,
      },
    });

    return NextResponse.json({ success: true, note: newNote });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to add lead note' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'Lead ID is required' }, { status: 400 });
    }

    await prisma.lead.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to delete lead' }, { status: 500 });
  }
}
