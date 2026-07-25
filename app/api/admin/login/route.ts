import { NextResponse } from 'next/server';
import { authenticateAdminUser, setAdminSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const authResult = await authenticateAdminUser(email, password);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ success: false, message: authResult.message || 'Invalid email or password' }, { status: 401 });
    }

    setAdminSessionCookie(authResult.user);

    return NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      user: authResult.user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Internal server error' }, { status: 500 });
  }
}
