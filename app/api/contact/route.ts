import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAcknowledgmentReceipt, sendContactEmail } from '@/lib/mailer';
import { checkRateLimit, checkSpamPayload, createSilentSpamResponse, getClientIp } from '@/lib/anti-spam';

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
    const {
      name,
      email,
      message,
      subject,
      phone,
      company,
      service,
      budget,
      website,
      hp_field,
      bot_trap,
      formLoadedAt,
      sourceUrl: explicitSourceUrl,
    } = body;

    let savedToCrm = false;

    // Detect referrer / source URL if not explicitly sent from client
    const refererHeader = req.headers.get('referer');
    let derivedSourceUrl = explicitSourceUrl;
    if (!derivedSourceUrl && refererHeader) {
      try {
        const parsedUrl = new URL(refererHeader);
        derivedSourceUrl = `${parsedUrl.pathname}${parsedUrl.search || ''}`;
      } catch {
        derivedSourceUrl = refererHeader;
      }
    }
    const finalSourceUrl = derivedSourceUrl || 'Web Contact Form';

    // Anti-spam check (honeypots + time-trap + keyword filter + disposable emails)
    const spamCheck = checkSpamPayload({
      honeypot: [website, hp_field, bot_trap].filter(Boolean),
      email,
      message,
      name,
      formLoadedAt,
      minSubmissionTimeMs: 1800,
    });

    if (spamCheck.isSpam) {
      console.warn(`[API/contact] Blocked spam request from IP ${ip}: ${spamCheck.reason}`);
      return createSilentSpamResponse('Thank you! Your message has been received.');
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

        const createdLead = await prisma.lead.create({
          data: {
            contactName: name,
            email,
            phone: phone || null,
            companyName: company || null,
            serviceInterest: service || subject || 'General Inquiry',
            budget: budget || null,
            enquiryDetails: message,
            sourceUrl: finalSourceUrl,
            status: 'NEW',
          },
        });

        savedToCrm = true;

        // Asynchronously classify lead with AI & tag spam / intent score
        (async () => {
          try {
            const { classifyLeadWithAI } = await import('@/lib/ai-lead-classifier');
            const analysis = await classifyLeadWithAI({
              id: createdLead.id,
              contactName: name,
              companyName: company,
              email,
              phone,
              serviceInterest: service || subject,
              budget,
              enquiryDetails: message,
              sourceUrl: finalSourceUrl,
            });

            if (analysis.isSpam) {
              await prisma.lead.update({
                where: { id: createdLead.id },
                data: { status: 'SPAM' },
              });
            }

            const noteContent = `[AI SPAM & INTENT ANALYSIS]
• Classification: ${analysis.classification} (Score: ${analysis.leadQualityScore}/100 | Confidence: ${Math.round(analysis.confidence * 100)}%)
• Is Spam: ${analysis.isSpam ? `YES (${analysis.spamReason || 'Bot/Spam pattern'})` : 'NO (Legitimate Inquiry)'}
• Intent: ${analysis.keyIntent}
• Summary: ${analysis.summary}
• Suggested Next Action: ${analysis.suggestedNextAction}`;

            await prisma.leadNote.create({
              data: {
                leadId: createdLead.id,
                content: noteContent,
              },
            });
          } catch (aiErr) {
            console.warn('[API/contact] Background AI lead classification warning:', aiErr);
          }
        })();
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
        sourceUrl: finalSourceUrl,
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
      sourceUrl: finalSourceUrl,
    });
  } catch (error: any) {
    console.error('[API/contact] Handler error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact submission.' },
      { status: 500 }
    );
  }
}
