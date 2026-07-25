import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, subject, phone, company, service, budget } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // 1. Save ContactMessage & Create CRM Lead in NeonDB
    try {
      if (process.env.DATABASE_URL) {
        await prisma.contactMessage.create({
          data: {
            name,
            email,
            subject: subject || null,
            message,
          },
        });

        await prisma.lead.create({
          data: {
            contactName: name,
            email,
            phone: phone || null,
            companyName: company || null,
            serviceInterest: service || subject || 'General Inquiry',
            budget: budget || null,
            enquiryDetails: message,
            status: 'NEW',
          },
        });
      }
    } catch (dbError) {
      console.error('[API/contact] Database CRM lead save warning:', dbError);
    }

    // 2. Send email via Mailtrap
    let mailResult: { success: boolean; reason?: string; messageId?: string } = { success: false, reason: 'Skipped' };
    try {
      mailResult = await sendContactEmail({ name, email, subject, message });
    } catch (mailError: any) {
      console.error('[API/contact] Mailtrap email error:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received.',
      mailSent: mailResult.success,
    });
  } catch (error: any) {
    console.error('[API/contact] Handler error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact submission.' },
      { status: 500 }
    );
  }
}
