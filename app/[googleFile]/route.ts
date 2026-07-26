import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { googleFile: string } }
) {
  const filename = params.googleFile || '';

  if (filename.startsWith('google') && filename.endsWith('.html')) {
    return new NextResponse(`google-site-verification: ${filename}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  }

  return new NextResponse('Not Found', { status: 404 });
}
