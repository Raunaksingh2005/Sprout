// Simple in-memory rate limiter
// Resets on server restart — good enough for dev/small scale
// For production, swap the store with Redis/Upstash

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  windowMs: number;  // time window in ms
  max: number;       // max requests per window
}

export function checkRateLimit(key: string, opts: RateLimitOptions): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, remaining: opts.max - 1, resetIn: opts.windowMs };
  }

  if (entry.count >= opts.max) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, remaining: opts.max - entry.count, resetIn: entry.resetAt - now };
}
