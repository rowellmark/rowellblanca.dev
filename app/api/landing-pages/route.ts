import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

const FALLBACK_LANDING_PAGES = [
  {
    id: 1,
    slug: 'hire-uk-react-developer',
    badgeText: '🇬🇧 UK Business & Agency Engineering Partner',
    heroTitle: 'Hire Senior React & Next.js Developer for UK Businesses',
    heroSubtitle:
      'Partner with a senior full-stack software engineer building enterprise platforms like the Macmanus Asset Finance Portal. Top-quality code at cost-effective rates with GMT/BST overlap.',
    heroCtaText: 'Book UK Discovery Call',
    targetKeyword: 'React Developer UK',
    metaTitle: 'Hire Senior React & Next.js Developer UK | Rowell Mark Blanca',
    metaDescription:
      'Senior React & Next.js developer for UK businesses and web agencies. Full GMT/BST timezone overlap, competitive rates, and enterprise-grade software engineering.',
    projectIds: [2, 1], // Macmanus Portal & BuildForUser
    testimonialIds: [1, 2],
    services: [
      'React & Next.js Web App Engineering',
      'Enterprise Web Portals & Dashboards',
      'Core Web Vitals & UK SEO Refactoring',
    ],
    active: true,
  },
  {
    id: 2,
    slug: 'hire-uk-wordpress-developer',
    badgeText: '🇬🇧 Custom WordPress & Headless CMS Engineering for UK',
    heroTitle: 'Hire Senior WordPress Developer & Architect for UK Businesses',
    heroSubtitle:
      'Bespoke WordPress theme and plugin development, Headless WordPress + Next.js, and speed optimization. Top-quality code at cost-effective rates with GMT/BST overlap.',
    heroCtaText: 'Book UK WordPress Call',
    targetKeyword: 'WordPress Developer UK',
    metaTitle: 'Hire Senior WordPress Developer & Architect UK | Rowell Mark Blanca',
    metaDescription:
      'Senior WordPress developer & architect for UK companies and agencies. Bespoke PHP themes, Gutenberg blocks, Headless CMS, WooCommerce, and Lighthouse 95+ speed tuning.',
    projectIds: [4, 5], // Towerfire & Macmanus Brokerage
    testimonialIds: [2, 1],
    services: [
      'Bespoke WordPress Theme & Plugin Dev',
      'Headless WordPress + Next.js',
      'WooCommerce & E-Commerce Engineering',
      'Page Speed, Core Web Vitals & UK SEO',
    ],
    active: true,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const includeInactive = searchParams.get('includeInactive') === 'true' && isAdminAuthenticated();

    let dbPages: any[] = [];
    try {
      if (slug) {
        const single = await prisma.landingPage.findUnique({
          where: { slug },
        });
        if (single) {
          if (!includeInactive && single.active === false) {
            return NextResponse.json({ success: false, message: 'Landing page not found' }, { status: 404 });
          }
          return NextResponse.json({ success: true, page: single, landingPages: [single] });
        }
      } else {
        dbPages = await prisma.landingPage.findMany({
          where: includeInactive ? undefined : { active: true },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (e) {
      console.warn('NeonDB landing page fetch fallback dataset serving');
    }

    let items = dbPages.length > 0 ? dbPages : FALLBACK_LANDING_PAGES;

    if (!includeInactive) {
      items = items.filter((p: any) => p.active !== false);
    }

    if (slug) {
      const match = items.find((p) => p.slug === slug) || FALLBACK_LANDING_PAGES.find((p) => p.slug === slug) || items[0];
      return NextResponse.json({ success: true, page: match, landingPages: [match] });
    }

    return NextResponse.json({ success: true, landingPages: items });
  } catch (error) {
    return NextResponse.json({ success: false, landingPages: FALLBACK_LANDING_PAGES });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      slug,
      heroTitle,
      heroSubtitle,
      badgeText,
      heroCtaText,
      targetKeyword,
      metaTitle,
      metaDescription,
      projectIds,
      testimonialIds,
      active,
    } = body;

    if (!slug?.trim() || !heroTitle?.trim() || !heroSubtitle?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Slug, Hero Title, and Hero Subtitle are required' },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPage = await prisma.landingPage.upsert({
      where: { slug: cleanSlug },
      create: {
        slug: cleanSlug,
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        badgeText: badgeText?.trim() || '',
        heroCtaText: heroCtaText?.trim() || 'Book Discovery Call',
        targetKeyword: targetKeyword?.trim() || '',
        metaTitle: metaTitle?.trim() || heroTitle.trim(),
        metaDescription: metaDescription?.trim() || heroSubtitle.trim(),
        projectIds: Array.isArray(projectIds) ? projectIds.map(Number) : [],
        testimonialIds: Array.isArray(testimonialIds) ? testimonialIds.map(Number) : [],
        active: active !== undefined ? Boolean(active) : true,
      },
      update: {
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        badgeText: badgeText?.trim() || '',
        heroCtaText: heroCtaText?.trim() || 'Book Discovery Call',
        targetKeyword: targetKeyword?.trim() || '',
        metaTitle: metaTitle?.trim() || heroTitle.trim(),
        metaDescription: metaDescription?.trim() || heroSubtitle.trim(),
        projectIds: Array.isArray(projectIds) ? projectIds.map(Number) : [],
        testimonialIds: Array.isArray(testimonialIds) ? testimonialIds.map(Number) : [],
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({ success: true, landingPage: newPage });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create landing page' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      slug,
      heroTitle,
      heroSubtitle,
      badgeText,
      heroCtaText,
      targetKeyword,
      metaTitle,
      metaDescription,
      projectIds,
      testimonialIds,
      active,
    } = body;

    const cleanSlug = (slug || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const updateData: any = {};
    if (slug !== undefined) updateData.slug = cleanSlug;
    if (heroTitle !== undefined) updateData.heroTitle = heroTitle.trim();
    if (heroSubtitle !== undefined) updateData.heroSubtitle = heroSubtitle.trim();
    if (badgeText !== undefined) updateData.badgeText = badgeText.trim();
    if (heroCtaText !== undefined) updateData.heroCtaText = heroCtaText.trim();
    if (targetKeyword !== undefined) updateData.targetKeyword = targetKeyword.trim();
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle.trim();
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription.trim();
    if (projectIds !== undefined) updateData.projectIds = Array.isArray(projectIds) ? projectIds.map(Number) : [];
    if (testimonialIds !== undefined) updateData.testimonialIds = Array.isArray(testimonialIds) ? testimonialIds.map(Number) : [];
    if (active !== undefined) updateData.active = Boolean(active);

    let updatedPage;
    if (id && Number(id) > 0) {
      try {
        updatedPage = await prisma.landingPage.update({
          where: { id: Number(id) },
          data: updateData,
        });
      } catch (err) {
        // Fallback to upsert by slug if ID not found in database yet
        if (cleanSlug) {
          updatedPage = await prisma.landingPage.upsert({
            where: { slug: cleanSlug },
            create: {
              slug: cleanSlug,
              heroTitle: heroTitle?.trim() || 'Hire Senior Developer',
              heroSubtitle: heroSubtitle?.trim() || 'Enterprise software engineering.',
              badgeText: badgeText?.trim() || '',
              heroCtaText: heroCtaText?.trim() || 'Book Discovery Call',
              targetKeyword: targetKeyword?.trim() || '',
              metaTitle: metaTitle?.trim() || '',
              metaDescription: metaDescription?.trim() || '',
              projectIds: Array.isArray(projectIds) ? projectIds.map(Number) : [],
              testimonialIds: Array.isArray(testimonialIds) ? testimonialIds.map(Number) : [],
              active: active !== undefined ? Boolean(active) : true,
            },
            update: updateData,
          });
        }
      }
    } else if (cleanSlug) {
      updatedPage = await prisma.landingPage.upsert({
        where: { slug: cleanSlug },
        create: {
          slug: cleanSlug,
          heroTitle: heroTitle?.trim() || 'Hire Senior Developer',
          heroSubtitle: heroSubtitle?.trim() || 'Enterprise software engineering.',
          badgeText: badgeText?.trim() || '',
          heroCtaText: heroCtaText?.trim() || 'Book Discovery Call',
          targetKeyword: targetKeyword?.trim() || '',
          metaTitle: metaTitle?.trim() || '',
          metaDescription: metaDescription?.trim() || '',
          projectIds: Array.isArray(projectIds) ? projectIds.map(Number) : [],
          testimonialIds: Array.isArray(testimonialIds) ? testimonialIds.map(Number) : [],
          active: active !== undefined ? Boolean(active) : true,
        },
        update: updateData,
      });
    }

    return NextResponse.json({ success: true, landingPage: updatedPage });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update landing page' },
      { status: 500 }
    );
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
      return NextResponse.json({ success: false, message: 'Landing Page ID required' }, { status: 400 });
    }

    await prisma.landingPage.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'Landing page deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete landing page' },
      { status: 500 }
    );
  }
}
