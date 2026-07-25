import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { blobs } = await list({ prefix: 'uploads/' });
    const sorted = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({ success: true, blobs: sorted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to list media' },
      { status: 500 }
    );
  }
}
