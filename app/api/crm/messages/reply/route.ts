import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { sendReplyEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { contactMessageId, replyMessage, sendEmail = true } = body;

    if (!contactMessageId || !replyMessage) {
      return NextResponse.json({ success: false, message: 'Message ID and reply content are required' }, { status: 400 });
    }

    const contactMsg = await prisma.contactMessage.findUnique({
      where: { id: Number(contactMessageId) },
    });

    if (!contactMsg) {
      return NextResponse.json({ success: false, message: 'Contact message not found' }, { status: 404 });
    }

    // 1. Create MessageReply
    const createdReply = await prisma.messageReply.create({
      data: {
        contactMessageId: Number(contactMessageId),
        sender: 'admin',
        senderName: 'Rowell Mark Blanca',
        message: replyMessage,
      },
    });

    // 2. Update parent message status to REPLIED
    await prisma.contactMessage.update({
      where: { id: Number(contactMessageId) },
      data: {
        status: 'REPLIED',
        updatedAt: new Date(),
      },
    });

    // 3. Optional: Send Email to visitor
    let mailSent = false;
    if (sendEmail && contactMsg.email) {
      try {
        const mailRes = await sendReplyEmail({
          toName: contactMsg.name,
          toEmail: contactMsg.email,
          replyMessage,
          originalSubject: contactMsg.subject || undefined,
          originalMessage: contactMsg.message,
        });
        mailSent = mailRes.success;
      } catch (mailErr) {
        console.error('[API/crm/messages/reply] Email send error:', mailErr);
      }
    }

    const updatedThread = await prisma.contactMessage.findUnique({
      where: { id: Number(contactMessageId) },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      reply: createdReply,
      thread: updatedThread,
      mailSent,
    });
  } catch (error: any) {
    console.error('[API/crm/messages/reply POST] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to send reply' }, { status: 500 });
  }
}
