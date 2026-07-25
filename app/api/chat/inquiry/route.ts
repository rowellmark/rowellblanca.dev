import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactEmail, sendAcknowledgmentReceipt } from '@/lib/mailer';

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
    const body = await req.json();
    const { sessionId, name, email, message, subject } = body;

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

    if (!existingThread) {
      if (!name || !email) {
        return NextResponse.json(
          { success: false, error: 'Name and email are required for initial inquiry.' },
          { status: 400 }
        );
      }

      // Create new ContactMessage and Lead
      const createdMessage = await prisma.contactMessage.create({
        data: {
          sessionId,
          name,
          email,
          subject: subject || 'Live Chat Inquiry',
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
            serviceInterest: subject || 'Live Chat Inquiry',
            enquiryDetails: message,
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
          subject: `[Live Chat Inquiry] ${subject || 'New message'}`,
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
          subject: subject || 'Live Chat Inquiry',
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
