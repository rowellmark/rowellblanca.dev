// Serves Google Search Console HTML-file verification (/googleXXXX.html), reached via the
// rewrite in next.config.js. Kept off the root so unknown URLs fall through to app/not-found.tsx.
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, props: { params: Promise<{ file: string }> }) {
  const params = await props.params;
  const filename = params.file || '';

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
