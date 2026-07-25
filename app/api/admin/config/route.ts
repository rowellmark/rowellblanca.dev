import { NextResponse } from 'next/server';

export async function GET() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rowellblanca.dev';
  return NextResponse.json({ success: true, adminEmail });
}
