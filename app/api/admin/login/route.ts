import { NextResponse } from 'next/server';
import { authenticateAdminUser, setAdminSessionCookie } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/anti-spam';

export async function POST(request: Request) {
  try {
    // Slow down password guessing: 10 attempts per 15 minutes per IP.
    const limit = checkRateLimit(`admin-login:${getClientIp(request)}`, 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, message: 'Too many login attempts. Try again in a few minutes.' }, { status: 429 });
    }
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const authResult = await authenticateAdminUser(email, password);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ success: false, message: authResult.message || 'Invalid email or password' }, { status: 401 });
    }

    await setAdminSessionCookie(authResult.user);

    return NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      // Never echo the DB row back (it carries the password hash).
      user: { email: authResult.user.email, name: authResult.user.name, role: authResult.user.role || 'ADMIN' },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
