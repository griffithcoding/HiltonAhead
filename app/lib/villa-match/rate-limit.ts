// app/lib/villa-match/rate-limit.ts
/**
 * In-memory rate limiter keyed on a string (typically ip_hash).
 * Per-instance — Vercel will spin up multiple instances; this is acceptable
 * for v1 since the cost of a leak is one extra email per spawn-cycle.
 */

type Bucket = { count: number; firstAt: number };

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const buckets = new Map<string, Bucket>();

export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

export function checkRateLimit(key: string, max: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.firstAt > WINDOW_MS) {
    buckets.set(key, { count: 1, firstAt: now });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (bucket.count < max) {
    bucket.count += 1;
    return { allowed: true, retryAfterSec: 0 };
  }
  const elapsed = now - bucket.firstAt;
  const retryAfterSec = Math.max(1, Math.ceil((WINDOW_MS - elapsed) / 1000));
  return { allowed: false, retryAfterSec };
}

// Lightweight self-cleanup so the Map doesn't grow forever on long-running servers.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) {
      if (now - v.firstAt > WINDOW_MS) buckets.delete(k);
    }
  }, WINDOW_MS).unref?.();
}
