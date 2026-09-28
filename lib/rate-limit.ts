/**
 * Minimal in-memory rate limiter for the admin login route.
 *
 * NOTE: this resets on every server restart/redeploy and is per-instance,
 * so it does not protect a multi-instance (e.g. serverless) production
 * deployment. Swap for a real rate limiter (e.g. Upstash Ratelimit) before
 * relying on this in production.
 */
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
