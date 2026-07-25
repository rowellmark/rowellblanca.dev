import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Clean up filename and append timestamp to avoid collision
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${sanitizedOriginalName}`;

    const blob = await put(`uploads/${fileName}`, file, { access: 'public' });

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('[API/upload] File upload error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
