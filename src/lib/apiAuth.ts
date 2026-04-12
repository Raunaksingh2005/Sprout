import { NextRequest } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';
import { checkRateLimit } from '@/lib/rateLimit';

export interface AuthResult {
  uid: string;
  ip: string;
}

export async function requireAuth(req: NextRequest): Promise<AuthResult | Response> {
  // 1. Extract IP for rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';

  // 2. IP-level rate limit — 60 requests per minute per IP
  const ipLimit = checkRateLimit(`ip:${ip}`, { windowMs: 60_000, max: 60 });
  if (!ipLimit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please slow down.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(ipLimit.resetIn / 1000)),
        },
      }
    );
  }

  // 3. Verify Firebase ID token
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const token = authHeader.slice(7);
  const uid = await verifyIdToken(token);

  if (!uid) {
    return new Response(
      JSON.stringify({ error: 'Invalid or expired session. Please sign in again.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. Per-user rate limit — 20 AI requests per minute per user
  const userLimit = checkRateLimit(`uid:${uid}`, { windowMs: 60_000, max: 20 });
  if (!userLimit.allowed) {
    return new Response(
      JSON.stringify({ error: 'rate_limit' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(userLimit.resetIn / 1000)),
        },
      }
    );
  }

  return { uid, ip };
}
