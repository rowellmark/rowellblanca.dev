import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTestimonialNotification } from '@/lib/mailer';
import { checkRateLimit, checkSpamPayload, createSilentSpamResponse, getClientIp } from '@/lib/anti-spam';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: `Too many requests. Please wait ${rateLimit.retryAfter || 60} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, role, company, companyUrl, photoUrl, quote, rating, avatarUrl, website, hp_field, formLoadedAt } = body;

    // Check spam
    const spamCheck = checkSpamPayload({
      honeypot: [website, hp_field].filter(Boolean),
      name,
      message: quote,
      formLoadedAt,
      minSubmissionTimeMs: 1800,
    });

    if (spamCheck.isSpam) {
      console.warn(`[API/testimonials/submit] Blocked spam testimonial from IP ${ip}: ${spamCheck.reason}`);
      return createSilentSpamResponse('Review submitted successfully!');
    }

    if (!name?.trim() || !quote?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name and testimonial text are required.' },
        { status: 400 }
      );
    }

    const parsedRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const finalAvatarUrl = photoUrl?.trim()
      ? `photo:${photoUrl.trim()}`
      : avatarUrl?.trim() || '';

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role?.trim() || 'Client',
        company: company?.trim() || '',
        companyUrl: companyUrl?.trim() || '',
        quote: quote.trim(),
        rating: parsedRating,
        active: false, // Default to false until admin clicks Approve in Dashboard
        avatarUrl: finalAvatarUrl,
      },
    });

    // Send instant email notification to site owner
    try {
      await sendTestimonialNotification({
        name: newTestimonial.name,
        role: newTestimonial.role,
        company: newTestimonial.company,
        quote: newTestimonial.quote,
        rating: newTestimonial.rating,
      });
    } catch (e) {
      console.warn('[Testimonial Submit] Failed to send email alert to admin:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully!',
      testimonial: newTestimonial,
    });
  } catch (error: any) {
    console.error('Error submitting client review:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to submit review.' },
      { status: 500 }
    );
  }
}
