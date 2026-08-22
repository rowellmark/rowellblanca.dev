import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { LeadStatus } from '@/lib/generated/client/index';
import { checkRateLimit, checkSpamPayload, createSilentSpamResponse, getClientIp } from '@/lib/anti-spam';

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
  try {
    const body = await request.json();
    const { leadId, content, contactName, name, email, phone, serviceInterest, notes, source, sourceUrl, website, hp_field, formLoadedAt } = body;

    // Case 1: Admin adding an internal note to an existing lead
    if (leadId && content) {
      if (!isAdminAuthenticated()) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }

      const newNote = await prisma.leadNote.create({
        data: {
          leadId: Number(leadId),
          content,
        },
      });

      return NextResponse.json({ success: true, note: newNote });
    }

    // Case 2: New Lead Submission (from chat widget, estimate calculator, or intake form)
    const effectiveName = (contactName || name || '').trim();
    const effectiveEmail = (email || '').trim();

    if (!effectiveName && !effectiveEmail) {
      return NextResponse.json({ success: false, message: 'Contact name or email is required' }, { status: 400 });
    }

    // Anti-spam check
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 6, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, message: 'Rate limit exceeded. Please wait.' }, { status: 429 });
    }

    const spamCheck = checkSpamPayload({
      honeypot: [website, hp_field].filter(Boolean),
      email: effectiveEmail,
      name: effectiveName,
      message: typeof notes === 'string' ? notes : serviceInterest,
      formLoadedAt,
      minSubmissionTimeMs: 1500,
    });

    if (spamCheck.isSpam) {
      console.warn(`[API/crm/leads POST] Blocked spam lead from IP ${ip}: ${spamCheck.reason}`);
      return createSilentSpamResponse('Lead recorded successfully');
    }

    const refererHeader = request.headers.get('referer');
    let derivedSource = sourceUrl || source;
    if (!derivedSource && refererHeader) {
      try {
        const parsedUrl = new URL(refererHeader);
        derivedSource = `${parsedUrl.pathname}${parsedUrl.search || ''}`;
      } catch {
        derivedSource = refererHeader;
      }
    }
    const finalSourceUrl = derivedSource || 'Website Lead Intake';

    const newLead = await prisma.lead.create({
      data: {
        contactName: effectiveName || 'Website Visitor',
        email: effectiveEmail || 'no-email-provided@chat.lead',
        phone: phone ? String(phone).trim() : null,
        serviceInterest: serviceInterest || 'General Inquiry',
        enquiryDetails: typeof notes === 'string' ? notes : 'Inquiry captured via chat co-pilot.',
        sourceUrl: finalSourceUrl,
        status: 'NEW',
        ...(notes && typeof notes === 'string'
          ? {
              notes: {
                create: {
                  content: notes,
                },
              },
            }
          : {}),
      },
    });

    return NextResponse.json({ success: true, lead: newLead, message: 'Lead captured successfully' });
  } catch (error: any) {
    console.error('[API/crm/leads POST] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to process request' }, { status: 500 });
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
