import { cookies } from 'next/headers';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { prisma } from './prisma';
import { verifyPassword } from './crypto';

const ADMIN_COOKIE_NAME = 'admin_session_token';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Passwords that were committed to the public repository. They are refused even if a
// database row or an environment variable still holds them, so they can never log in.
const LEAKED_PASSWORDS = new Set(['RowellDev2026!', 'RowellAdmin2026!']);

/**
 * HMAC key for session cookies and invoice links. Prefer SESSION_SECRET; otherwise derive
 * one from DATABASE_URL (server-only). With neither (local dev without a DB) a random
 * per-process key is used, so sessions simply reset on restart.
 */
let processSecret: string | null = null;
function signingKey(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.DATABASE_URL) {
    return createHash('sha256').update(`rowellblanca.dev:session:${process.env.DATABASE_URL}`).digest('hex');
  }
  processSecret ??= randomBytes(32).toString('hex');
  return processSecret;
}

function sign(value: string): string {
  return createHmac('sha256', signingKey()).update(value).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Admin login:
 * - Production (live and Vercel previews): a `User` row in NeonDB only.
 * - Local development: ADMIN_EMAIL + ADMIN_PASSWORD from `.env.local` also work, so you can
 *   sign in without a database. They are ignored in production builds.
 * There are no hardcoded credentials, and leaked passwords are always refused. To create or
 * reset the live login, run `npm run admin:password -- you@example.com` against the live DB.
 */
export async function authenticateAdminUser(emailInput: string, passwordInput: string): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const cleanEmail = String(emailInput || '').trim().toLowerCase();
    const password = String(passwordInput || '');
    if (!cleanEmail || !password) return { success: false, message: 'Invalid email or password' };

    if (LEAKED_PASSWORDS.has(password)) {
      return {
        success: false,
        message: 'This password is no longer accepted. Reset your login with: npm run admin:password -- you@example.com',
      };
    }

    const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD;
    const allowEnvLogin = process.env.NODE_ENV !== 'production';
    if (allowEnvLogin && envEmail && envPassword && cleanEmail === envEmail && safeEqual(password, envPassword)) {
      return { success: true, user: { id: 0, email: envEmail, name: 'Rowell Mark Blanca', role: 'ADMIN' } };
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    } catch (e) {
      console.warn('[Auth] Database lookup failed:', e);
    }
    if (user && verifyPassword(password, user.passwordHash)) {
      return { success: true, user };
    }

    return { success: false, message: 'Invalid email or password' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Authentication error' };
  }
}

/** Cookie value: base64url(JSON payload) + "." + HMAC signature. Tampering invalidates it. */
export async function setAdminSessionCookie(userPayload: any): Promise<void> {
  const cookieStore = await cookies();
  const payload = Buffer.from(
    JSON.stringify({
      id: userPayload.id,
      email: userPayload.email,
      name: userPayload.name,
      role: userPayload.role || 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    })
  ).toString('base64url');

  cookieStore.set(ADMIN_COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminSessionUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    const user = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!user?.email || typeof user.exp !== 'number' || user.exp * 1000 < Date.now()) return null;
    return user;
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await getAdminSessionUser());
}

/** Unguessable token for a client's invoice link (/invoice/INV-2026-001?t=...). */
export function invoiceAccessToken(invoiceNumber: string): string {
  return sign(`invoice:${invoiceNumber}`).slice(0, 32);
}

export function isValidInvoiceToken(invoiceNumber: string, token: string | null | undefined): boolean {
  return Boolean(token) && safeEqual(String(token), invoiceAccessToken(invoiceNumber));
}
