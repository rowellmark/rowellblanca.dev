import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactEmail, sendAcknowledgmentReceipt } from '@/lib/mailer';
import { checkRateLimit, checkSpamPayload, getClientIp } from '@/lib/anti-spam';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Session ID is required' }, { status: 400 });
    }

    // Find the latest message thread associated with this session ID
    const contactMessage = await prisma.contactMessage.findFirst({
      where: { sessionId },
      orderBy: { sentAt: 'desc' },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!contactMessage) {
      return NextResponse.json({ success: true, thread: null });
    }

    return NextResponse.json({
      success: true,
      thread: contactMessage,
    });
  } catch (error: any) {
    console.error('[API/chat/inquiry GET] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch chat thread' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Please wait ${rateLimit.retryAfter || 60} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { sessionId, name, email, message, subject, website, hp_field } = body;

    // Anti-spam honeypot, disposable email, and keyword filter
    const spamCheck = checkSpamPayload({
      honeypot: website || hp_field,
      email,
      message,
      name,
    });

    if (spamCheck.isSpam) {
      console.warn(`[API/chat/inquiry] Blocked spam request from IP ${ip}: ${spamCheck.reason}`);
      // Silent success response to fool spam bots
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully!',
      });
    }

    if (!sessionId || !message) {
      return NextResponse.json(
        { success: false, error: 'Session ID and message are required.' },
        { status: 400 }
      );
    }

    // Check if an existing thread exists for this session
    let existingThread = await prisma.contactMessage.findFirst({
      where: { sessionId },
      orderBy: { sentAt: 'desc' },
    });

    let threadId: number;
    const formattedSubject = subject ? `[Live Chat] ${subject}` : '[Live Chat] General Inquiry';

    if (!existingThread) {
      if (!name || !email) {
        return NextResponse.json(
          { success: false, error: 'Name and email are required for initial inquiry.' },
          { status: 400 }
        );
      }

      // Create new ContactMessage and Lead with explicit Live Chat tagging
      const createdMessage = await prisma.contactMessage.create({
        data: {
          sessionId,
          name,
          email,
          subject: formattedSubject,
          message,
          status: 'UNREAD',
        },
      });

      threadId = createdMessage.id;

      try {
        await prisma.lead.create({
          data: {
            contactName: name,
            email,
            serviceInterest: formattedSubject,
            enquiryDetails: message,
            sourceUrl: 'Live Chat Widget',
            status: 'NEW',
          },
        });
      } catch (leadError) {
        console.error('[API/chat/inquiry] Lead creation warning:', leadError);
      }

      // Send mail alert to admin
      try {
        await sendContactEmail({
          name,
          email,
          subject: formattedSubject,
          message,
        });
      } catch (mailErr) {
        console.error('[API/chat/inquiry] Mailtrap error:', mailErr);
      }

      // Send acknowledgment receipt to client
      try {
        await sendAcknowledgmentReceipt({
          name,
          email,
          subject: formattedSubject,
          message,
        });
      } catch (receiptErr) {
        console.error('[API/chat/inquiry] Acknowledgment receipt error:', receiptErr);
      }
    } else {
      threadId = existingThread.id;
      const senderName = name || existingThread.name;

      // Add a follow-up reply to the thread
      await prisma.messageReply.create({
        data: {
          contactMessageId: threadId,
          sender: 'user',
          senderName,
          message,
        },
      });

      // Update parent message status back to UNREAD / active
      await prisma.contactMessage.update({
        where: { id: threadId },
        data: {
          status: 'UNREAD',
          updatedAt: new Date(),
        },
      });
    }

    // Return the updated thread
    const updatedThread = await prisma.contactMessage.findUnique({
      where: { id: threadId },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      thread: updatedThread,
    });
  } catch (error: any) {
    console.error('[API/chat/inquiry POST] Handler error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}
