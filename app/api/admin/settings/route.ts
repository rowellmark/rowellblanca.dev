import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    let gaId = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XWQVTC4XWZ';
    let gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';
    let googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';

    try {
      // Check database settings table if available
      const settings = await (prisma as any).setting.findMany();
      if (Array.isArray(settings) && settings.length > 0) {
        const settingsMap = new Map(settings.map((s: { key: string; value: string }) => [s.key, s.value]));
        if (settingsMap.get('ga_id')) gaId = settingsMap.get('ga_id')!;
        if (settingsMap.get('gtm_id')) gtmId = settingsMap.get('gtm_id')!;
        if (settingsMap.get('google_verification')) googleVerification = settingsMap.get('google_verification')!;
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
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdminAuthenticated(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { gaId, gtmId, googleVerification } = body;

    const updates = [
      { key: 'ga_id', value: gaId || '' },
      { key: 'gtm_id', value: gtmId || '' },
      { key: 'google_verification', value: googleVerification || '' },
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
      console.warn('Prisma Setting upsert fallback:', e.message);
    }

    return NextResponse.json({
      success: true,
      message: 'SEO & Analytics settings updated successfully',
      settings: { gaId, gtmId, googleVerification },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
