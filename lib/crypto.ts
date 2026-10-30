import crypto from 'crypto';

// New hashes: "pbkdf2$<iterations>$<salt>$<hash>" (PBKDF2-SHA512). Legacy hashes are
// "<salt>:<hash>" at 1000 iterations and still verify. Keep scripts/set-admin-password.js in sync.
const ITERATIONS = 600_000;

/**
 * Hashes a plain text password using Node.js native PBKDF2 with salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 64, 'sha512').toString('hex');
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

/**
 * Verifies a plain text password against a stored hash (current or legacy format).
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  let salt: string, expected: string, iterations: number;
  if (storedHash.startsWith('pbkdf2$')) {
    const [, iter, s, h] = storedHash.split('$');
    iterations = Number(iter);
    salt = s;
    expected = h;
  } else if (storedHash.includes(':')) {
    [salt, expected] = storedHash.split(':');
    iterations = 1000;
  } else {
    return false;
  }
  if (!salt || !expected || !Number.isFinite(iterations)) return false;

  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
  const target = Buffer.from(expected, 'hex');
  return target.length === hash.length && crypto.timingSafeEqual(hash, target);
}
