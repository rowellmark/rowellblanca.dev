import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    let gaId = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XWQVTC4XWZ';
    let gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';
    let googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';
    let metaTitle = '';
    let metaDescription = '';
    let ogImage = '';
    let authorAvatar = '';
    let authorBio = 'Senior Full-Stack Engineer & WordPress Architect with 8+ years of production experience building high-performance web platforms.';

    try {
      // Check database settings table if available
      const settings = await (prisma as any).setting.findMany();
      if (Array.isArray(settings) && settings.length > 0) {
        const settingsMap = new Map(settings.map((s: { key: string; value: string }) => [s.key, s.value]));
        if (settingsMap.get('ga_id')) gaId = settingsMap.get('ga_id')!;
        if (settingsMap.get('gtm_id')) gtmId = settingsMap.get('gtm_id')!;
        if (settingsMap.get('google_verification')) googleVerification = settingsMap.get('google_verification')!;
        if (settingsMap.get('meta_title')) metaTitle = settingsMap.get('meta_title')!;
        if (settingsMap.get('meta_description')) metaDescription = settingsMap.get('meta_description')!;
        if (settingsMap.get('og_image')) ogImage = settingsMap.get('og_image')!;
        if (settingsMap.get('author_avatar')) authorAvatar = settingsMap.get('author_avatar')!;
        if (settingsMap.get('author_bio')) authorBio = settingsMap.get('author_bio')!;
      }
    } catch {
      // Fallback to env variables if Setting table is not yet pushed
    }

    return NextResponse.json({
      success: true,
      settings: {
        gaId,
        gtmId,
        googleVerification,
        metaTitle,
        metaDescription,
        ogImage,
        authorAvatar,
        authorBio,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { gaId, gtmId, googleVerification, metaTitle, metaDescription, ogImage, authorAvatar, authorBio } = body;

    let cleanVerification = (googleVerification || '').trim();
    if (cleanVerification.includes('content=')) {
      const match = cleanVerification.match(/content=["']([^"']+)["']/);
      if (match && match[1]) cleanVerification = match[1];
    }

    const updates = [
      { key: 'ga_id', value: (gaId || '').trim() },
      { key: 'gtm_id', value: (gtmId || '').trim() },
      { key: 'google_verification', value: cleanVerification },
      { key: 'meta_title', value: (metaTitle || '').trim() },
      { key: 'meta_description', value: (metaDescription || '').trim() },
      { key: 'og_image', value: (ogImage || '').trim() },
      { key: 'author_avatar', value: (authorAvatar || '').trim() },
      { key: 'author_bio', value: (authorBio || '').trim() },
    ];

    try {
      for (const item of updates) {
        await (prisma as any).setting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        });
      }
    } catch (e: any) {
      console.error('Prisma Setting upsert failed:', e.message);
      return NextResponse.json({ success: false, error: `Failed to save settings: ${e.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: { gaId, gtmId, googleVerification, metaTitle, metaDescription, ogImage, authorAvatar, authorBio },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
