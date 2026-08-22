import { NextRequest, NextResponse } from "next/server";

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

export const DISPOSABLE_EMAIL_DOMAINS = new Set([
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
  "fakeinbox.com",
  "burnermail.io",
  "mytemp.email",
  "nada.ltd",
  "dropmail.me",
  "disposablemail.com",
  "crazymailing.com",
  "fakemailgenerator.com",
  "generator.email",
]);

export function isDisposableEmail(email?: string): boolean {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

// Spam trigger terms & phishing patterns
const SPAM_KEYWORDS = [
  "casino",
  "poker",
  "slot machine",
  "roulette",
  "viagra",
  "cialis",
  "buy backlinks",
  "seo ranking boost",
  "crypto giveaway",
  "telegram @",
  "telegram:",
  "whatsapp +",
  "adult dating",
  "loan offer",
  "investment opportunity",
  "make money fast",
  "binary option",
  "forex trading robot",
  "weight loss pill",
  "hack tool",
  "crack serial",
  "guest posting service",
  "cheap traffic",
  "bulk sms",
];

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  statusCode?: number;
}

/**
 * Extract client IP address from Next.js request headers
 */
export function getClientIp(req: NextRequest | Request): string {
  const headers = req.headers;
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Check rate limit (max N requests per windowMs)
 */
export function checkRateLimit(
  ip: string,
  maxRequests = 5,
  windowMs = 60 * 1000
): { allowed: boolean; retryAfter?: number } {
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
 * Detects randomly generated alphanumeric probe strings / gibberish hashes
 * commonly blasted by automated XRumer / form probing bots
 * (e.g. "JlvsTwBLFZwjyxzl", "ICJsDemEfROPzADYjUsHHREq", "McDURGHRkcQYJyTJlg", "bprhioQgVnsfTmSeqNG")
 */
export function isGibberishString(text: string): boolean {
  if (!text) return false;
  const clean = text.trim();

  // 1. Single token with excessive alternating casing transitions
  const tokens = clean.split(/\s+/);
  for (const token of tokens) {
    if (token.length >= 9) {
      let caseSwitches = 0;
      for (let i = 1; i < token.length; i++) {
        const prevChar = token[i - 1];
        const currChar = token[i];
        const prevIsUpper = prevChar >= "A" && prevChar <= "Z";
        const currIsUpper = currChar >= "A" && currChar <= "Z";
        const prevIsLower = prevChar >= "a" && prevChar <= "z";
        const currIsLower = currChar >= "a" && currChar <= "z";

        if ((prevIsUpper && currIsLower) || (prevIsLower && currIsUpper)) {
          caseSwitches++;
        }
      }

      // Normal human names (e.g. "McDonald", "O'Reilly") have at most 2-3 transitions.
      // Bot probe hashes have 4+ alternating transitions
      if (caseSwitches >= 4) {
        return true;
      }

      // 5+ consecutive consonants in a word (excluding common patterns)
      if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(token)) {
        return true;
      }
    }
  }

  // 2. Message is a single unbroken random token without spaces (length >= 8 with mixed casing)
  if (!clean.includes(" ") && clean.length >= 8) {
    if (/[a-z]/.test(clean) && /[A-Z]/.test(clean) && clean.length >= 10) {
      return true;
    }
  }

  return false;
}

/**
 * Validate honeypot, submission speed (time-trap), spam content, disposable email, gibberish patterns, and excessive URLs
 */
export function checkSpamPayload({
  honeypot,
  email,
  message,
  name,
  formLoadedAt,
  minSubmissionTimeMs = 1800, // Humans take at least ~1.8s to fill a form
}: {
  honeypot?: string | string[] | Record<string, any>;
  email?: string;
  message?: string;
  name?: string;
  formLoadedAt?: number | string;
  minSubmissionTimeMs?: number;
}): SpamCheckResult {
  // 1. Honeypot check: If any hidden honeypot field is filled, it's a bot!
  if (honeypot) {
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return { isSpam: true, reason: "Honeypot field filled" };
    }
    if (Array.isArray(honeypot)) {
      for (const hp of honeypot) {
        if (typeof hp === "string" && hp.trim().length > 0) {
          return { isSpam: true, reason: "Honeypot field filled" };
        }
      }
    } else if (typeof honeypot === "object" && honeypot !== null) {
      const obj = honeypot as Record<string, any>;
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val === "string" && val.trim().length > 0) {
          return { isSpam: true, reason: `Honeypot field (${key}) filled` };
        }
      }
    }
  }

  // 2. Time-trap check: If submitted faster than minimum human threshold, it's an automated script
  if (formLoadedAt) {
    const parsedTime = typeof formLoadedAt === "string" ? parseInt(formLoadedAt, 10) : formLoadedAt;
    if (!isNaN(parsedTime) && parsedTime > 0) {
      const duration = Date.now() - parsedTime;
      // If submitted in under minSubmissionTimeMs (or timestamp is in the future), flag as bot
      if (duration < minSubmissionTimeMs || duration > 24 * 60 * 60 * 1000) {
        return {
          isSpam: true,
          reason: `Submission time trap triggered (${duration}ms vs min ${minSubmissionTimeMs}ms)`,
        };
      }
    }
  }

  // 3. Gibberish / Random String bot probe detection (e.g. "JlvsTwBLFZwjyxzl", "bprhioQgVnsfTmSeqNG")
  if (name && isGibberishString(name)) {
    return { isSpam: true, reason: "Random alphanumeric gibberish name detected" };
  }
  if (message && isGibberishString(message)) {
    return { isSpam: true, reason: "Random alphanumeric gibberish message detected" };
  }

  // 4. Disposable Email check
  if (email && email.includes("@")) {
    const domain = email.split("@")[1]?.toLowerCase().trim();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      return { isSpam: true, reason: `Disposable email address blocked: ${domain}` };
    }
  }

  const fullContent = `${name || ""} ${email || ""} ${message || ""}`.toLowerCase();

  // 5. Spam keyword check
  for (const keyword of SPAM_KEYWORDS) {
    if (fullContent.includes(keyword)) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  // 6. Excessive URL link check (> 2 URLs in a single short message)
  if (message) {
    const urlMatches = message.match(/https?:\/\/[^\s]+/gi);
    if (urlMatches && urlMatches.length > 2) {
      return { isSpam: true, reason: "Too many URLs in message" };
    }
  }

  return { isSpam: false };
}

/**
 * Creates a silent spam mitigation response. Spammers receive a standard 200 OK success
 * response so they believe their payload was delivered without learning they were filtered.
 */
export function createSilentSpamResponse(message = "Thank you! Your message has been received.") {
  return NextResponse.json({
    success: true,
    message,
    savedToCrm: false,
    mailSent: true,
  });
}
