import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Giles McManus',
    role: 'Managing Director',
    company: 'MacManus Asset Finance',
    quote: 'Rowell engineered our entire broker, partner, supplier, and accountant portals with exceptional speed and precision. His expertise in full-stack web architecture transformed our operational workflow.',
    rating: 5,
    active: true,
  },
  {
    id: 2,
    name: 'Tower Fire Solutions',
    role: 'Operations Team',
    company: 'Tower Fire UK',
    quote: 'The bespoke WordPress Gutenberg block engine Rowell built for our site allows us to publish clean, custom pages effortlessly without relying on slow page builders.',
    rating: 5,
    active: true,
  },
  {
    id: 3,
    name: 'Juliette Hohnen',
    role: 'Principal Partner',
    company: 'Juliette Hohnen Real Estate',
    quote: 'Rowell created a sleek, high-performing luxury real estate portal that showcases Beverly Hills properties with high visual excellence.',
    rating: 5,
    active: true,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target'); // e.g. 'uk-react' | 'uk-wordpress'
    const includeInactive = searchParams.get('includeInactive') === 'true' && isAdminAuthenticated();

    let dbTestimonials: any[] = [];
    try {
      dbTestimonials = await prisma.testimonial.findMany({
        where: includeInactive ? undefined : { active: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      console.warn('NeonDB query warning, serving fallback testimonials.');
    }

    let items = dbTestimonials.length > 0 ? dbTestimonials : FALLBACK_TESTIMONIALS;

    if (!includeInactive) {
      items = items.filter((t: any) => t.active === true);
    }

    if (target === 'uk-react') {
      items = items.filter((t: any) =>
        t.avatarUrl?.includes('target:uk-react') ||
        t.company?.toLowerCase().includes('macmanus') ||
        t.quote?.toLowerCase().includes('react') ||
        t.role?.toLowerCase().includes('react')
      );
    } else if (target === 'uk-wordpress') {
      items = items.filter((t: any) =>
        t.avatarUrl?.includes('target:uk-wordpress') ||
        t.company?.toLowerCase().includes('tower') ||
        t.company?.toLowerCase().includes('macmanus') ||
        t.quote?.toLowerCase().includes('wordpress') ||
        t.role?.toLowerCase().includes('wordpress')
      );
    }

    return NextResponse.json({ success: true, testimonials: items });
  } catch (error) {
    return NextResponse.json({ success: false, testimonials: FALLBACK_TESTIMONIALS });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, company, quote, rating, active, avatarUrl } = body;

    if (!name || !quote) {
      return NextResponse.json({ success: false, message: 'Name and quote are required' }, { status: 400 });
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || '',
        company: company || '',
        quote,
        rating: Number(rating) || 5,
        active: active !== undefined ? Boolean(active) : true,
        avatarUrl: avatarUrl || '',
      },
    });

    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, role, company, quote, rating, active, avatarUrl } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (company !== undefined) updateData.company = company;
    if (quote !== undefined) updateData.quote = quote;
    if (rating !== undefined) updateData.rating = Number(rating) || 5;
    if (active !== undefined) updateData.active = Boolean(active);
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    const updated = await prisma.testimonial.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to update testimonial' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID parameter required' }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'Testimonial deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to delete' }, { status: 500 });
  }
}
