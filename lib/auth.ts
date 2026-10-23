import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { hashPassword, verifyPassword } from './crypto';

const ADMIN_COOKIE_NAME = 'admin_session_token';
export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rowellblanca.dev';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'RowellAdmin2026!';

export async function authenticateAdminUser(emailInput: string, passwordInput: string): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const cleanEmail = emailInput.trim().toLowerCase();

    // 1. Try to find user in NeonDB
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (e) {
      console.warn('[Auth] Database lookup fallback:', e);
    }

    if (user) {
      const isValid = verifyPassword(passwordInput, user.passwordHash);
      if (isValid) {
        return { success: true, user };
      } else {
        return { success: false, message: 'Invalid password' };
      }
    }

    // 2. Fallback check for default seed admin credentials if DB is unseeded
    if (cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() || cleanEmail === 'rowellblanca94@gmail.com') {
      if (passwordInput === DEFAULT_ADMIN_PASSWORD || passwordInput === 'RowellDev2026!') {
        return {
          success: true,
          user: {
            id: 1,
            email: DEFAULT_ADMIN_EMAIL,
            name: 'Rowell Mark Blanca',
            role: 'ADMIN',
          },
        };
      }
    }

    return { success: false, message: 'Invalid email or password' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Authentication error' };
  }
}

export async function setAdminSessionCookie(userPayload: any): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, JSON.stringify({
    id: userPayload.id,
    email: userPayload.email,
    name: userPayload.name,
    role: userPayload.role || 'ADMIN',
    authenticatedAt: new Date().toISOString(),
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminSessionUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!token?.value) return null;

  try {
    return JSON.parse(token.value);
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const user = await getAdminSessionUser();
  return Boolean(user && user.email);
}
