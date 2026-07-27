import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAcknowledgmentReceipt, sendContactEmail } from '@/lib/mailer';

import { checkRateLimit, checkSpamPayload, getClientIp } from '@/lib/anti-spam';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${rateLimit.retryAfter || 60} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, message, subject, phone, company, service, budget, website, hp_field } = body;
    let savedToCrm = false;

    // Anti-spam check
    const spamCheck = checkSpamPayload({
      honeypot: website || hp_field,
      email,
      message,
      name,
    });

    if (spamCheck.isSpam) {
      console.warn(`[API/contact] Blocked spam request from IP ${ip}: ${spamCheck.reason}`);
      return NextResponse.json({
        success: true,
        message: 'Thank you! Your message has been received.',
        savedToCrm: false,
        mailSent: true,
      });
    }

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
            subject: subject || service || null,
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
            sourceUrl: 'Web Contact Form (GDPR Verified)',
            status: 'NEW',
          },
        });

        savedToCrm = true;
      }
    } catch (dbError) {
      console.error('[API/contact] Database CRM lead save warning:', dbError);
    }

    // 2. Send Admin Notification
    let mailResult: { success: boolean; reason?: string; messageId?: string } = { success: false, reason: 'Skipped' };
    try {
      mailResult = await sendContactEmail({
        name,
        email,
        message,
        subject: subject || service,
        phone,
        company,
        service,
        budget,
      });
    } catch (mailError: any) {
      console.error('[API/contact] Admin notification email error:', mailError);
    }

    if (!mailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: savedToCrm
            ? 'Your message was saved, but email delivery is not configured correctly yet.'
            : 'Email delivery is not configured correctly yet.',
          reason: mailResult.reason,
          savedToCrm,
          mailSent: false,
        },
        { status: 502 }
      );
    }

    try {
      await sendAcknowledgmentReceipt({
        name,
        email,
        subject,
        service,
        budget,
        company,
        phone,
        message,
      });
    } catch (receiptError: any) {
      console.error('[API/contact] Acknowledgment receipt email error:', receiptError);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received.',
      savedToCrm,
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
