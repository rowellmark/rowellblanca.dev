import { NextRequest } from "next/server";

// Simple in-memory rate limiter store
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const ipRateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old IP rate limit entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipRateLimitMap.entries()) {
      if (now > entry.resetTime) {
        ipRateLimitMap.delete(ip);
      }
    }
  }, 10 * 60 * 1000);
}

// Known disposable / spam email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "tempmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "trashmail.com",
  "yopmail.com",
  "dispostable.com",
  "10minutemail.com",
  "sharklasers.com",
  "getnada.com",
  "temp-mail.org",
  "throwawaymail.com",
]);

// Spam trigger terms
const SPAM_KEYWORDS = [
  "casino",
  "poker",
  "slot machine",
  "viagra",
  "cialis",
  "buy backlinks",
  "seo ranking boost",
  "crypto giveaway",
  "telegram @",
  "whatsapp +",
  "adult dating",
  "loan offer",
  "investment opportunity",
];

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  statusCode?: number;
}

/**
 * Extract client IP address from Next.js request headers
 */
export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Check rate limit (max N requests per windowMs)
 */
export function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60 * 1000): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count += 1;
  return { allowed: true };
}

/**
 * Validate honeypot, spam content, disposable email, and links
 */
export function checkSpamPayload({
  honeypot,
  email,
  message,
  name,
}: {
  honeypot?: string;
  email?: string;
  message?: string;
  name?: string;
}): SpamCheckResult {
  // 1. Honeypot check: If hidden field is filled, it's a bot!
  if (honeypot && honeypot.trim().length > 0) {
    return { isSpam: true, reason: "Honeypot field triggered" };
  }

  // 2. Disposable Email check
  if (email && email.includes("@")) {
    const domain = email.split("@")[1].toLowerCase().trim();
    if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      return { isSpam: true, reason: "Disposable email address blocked" };
    }
  }

  const fullContent = `${name || ""} ${email || ""} ${message || ""}`.toLowerCase();

  // 3. Spam keyword check
  for (const keyword of SPAM_KEYWORDS) {
    if (fullContent.includes(keyword)) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  // 4. Excessive URL link check (> 2 URLs in a single short message)
  if (message) {
    const urlMatches = message.match(/https?:\/\/[^\s]+/gi);
    if (urlMatches && urlMatches.length > 2) {
      return { isSpam: true, reason: "Too many URLs in message" };
    }
  }

  return { isSpam: false };
}
