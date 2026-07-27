import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendChatTranscriptEmail, sendAcknowledgmentReceipt } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, name, email, transcript } = body;

    if (!name || !email || !transcript) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and transcript are required.' },
        { status: 400 }
      );
    }

    const formattedSubject = `[Ended Chat Session] ${name}`;

    // 1. Create or update ContactMessage in NeonDB for Admin Dashboard (/admin/messages)
    const createdMessage = await prisma.contactMessage.create({
      data: {
        sessionId: sessionId || `ended_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        subject: formattedSubject,
        message: `--- FULL CHAT TRANSCRIPT ---\n\n${transcript.trim()}`,
        status: 'UNREAD',
      },
    });

    // 2. Create Lead in NeonDB for Admin Dashboard (/admin/leads)
    try {
      await prisma.lead.create({
        data: {
          contactName: name.trim(),
          email: email.trim(),
          serviceInterest: 'Completed Friday AI Chat Session',
          enquiryDetails: transcript.trim().slice(0, 1000),
          sourceUrl: 'Friday AI & Live Chat Widget',
          status: 'NEW',
        },
      });
    } catch (leadErr) {
      console.warn('[API/chat/end] Lead creation warning:', leadErr);
    }

    // 3. Send full transcript email to site owner (rowellblanca94@gmail.com)
    try {
      await sendChatTranscriptEmail({
        name: name.trim(),
        email: email.trim(),
        sessionId: sessionId || 'N/A',
        transcript: transcript.trim(),
      });
    } catch (mailErr) {
      console.error('[API/chat/end] Mail alert error:', mailErr);
    }

    // 4. Send acknowledgment receipt to client
    try {
      await sendAcknowledgmentReceipt({
        name: name.trim(),
        email: email.trim(),
        subject: 'Friday AI & Live Chat Session Completed',
        message: `Thank you for chatting with Friday AI on rowellblanca.dev! Below is your chat session summary:\n\n${transcript.trim()}`,
      });
    } catch (receiptErr) {
      console.warn('[API/chat/end] Receipt error:', receiptErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Chat session history saved & recorded on admin dashboard.',
      messageId: createdMessage.id,
    });
  } catch (error: any) {
    console.error('[API/chat/end POST] Handler error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to record chat history.' },
      { status: 500 }
    );
  }
}
