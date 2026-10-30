/**
 * Create or reset the admin login in NeonDB from your own computer.
 *
 *   npm run admin:password -- you@example.com
 *
 * Reads DATABASE_URL from .env.local / .env (point it at the live database to reset the live
 * login), prompts for the new password without echoing it, and upserts an ADMIN user.
 * The hash format matches lib/crypto.ts.
 */
const crypto = require('crypto');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { PrismaClient } = require('../lib/generated/client');

const ITERATIONS = 600000;
const LEAKED = new Set(['RowellDev2026!', 'RowellAdmin2026!']);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 64, 'sha512').toString('hex');
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : '');
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    console.error('Usage: npm run admin:password -- you@example.com');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set (add it to .env.local).');
    process.exit(1);
  }

  const password = await askHidden('New admin password (min 12 characters): ');
  const confirm = await askHidden('Repeat password: ');
  if (password !== confirm) throw new Error('Passwords do not match.');
  if (password.length < 12) throw new Error('Use at least 12 characters.');
  if (LEAKED.has(password)) throw new Error('That password was published in the repository; choose another.');

  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash: hashPassword(password), role: 'ADMIN' },
      create: { email, passwordHash: hashPassword(password), name: 'Rowell Mark Blanca', role: 'ADMIN' },
    });
    console.log(`Admin login saved for ${user.email}. Sign in at /admin/login.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
