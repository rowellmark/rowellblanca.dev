import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, company, quote, rating, avatarUrl } = body;

    if (!name?.trim() || !quote?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name and testimonial text are required.' },
        { status: 400 }
      );
    }

    const parsedRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role?.trim() || 'Client',
        company: company?.trim() || '',
        quote: quote.trim(),
        rating: parsedRating,
        active: false, // Default to false until admin clicks Approve in Dashboard
        avatarUrl: avatarUrl?.trim() || '',
      },
    });

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
