import { NextRequest } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';
import { checkRateLimit } from '@/lib/rateLimit';

export interface AuthResult {
  uid: string;
  ip: string;
}

const ALLOWED_ORIGINS = [
  'https://sprout-sooty.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export async function requireAuth(req: NextRequest): Promise<AuthResult | Response> {
  const headers = { 'Content-Type': 'application/json', ...corsHeaders(req) };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  // 1. Extract IP for rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';

  // 2. IP-level rate limit — 60 requests per minute per IP
  const ipLimit = checkRateLimit(`ip:${ip}`, { windowMs: 60_000, max: 60 });
  if (!ipLimit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please slow down.' }),
      { status: 429, headers: { ...headers, 'Retry-After': String(Math.ceil(ipLimit.resetIn / 1000)) } }
    );
  }

  // 3. Verify Firebase ID token
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Please sign in.' }), { status: 401, headers });
  }

  const token = authHeader.slice(7);
  const uid = await verifyIdToken(token);

  if (!uid) {
    return new Response(JSON.stringify({ error: 'Invalid or expired session. Please sign in again.' }), { status: 401, headers });
  }

  // 4. Per-user rate limit — 20 AI requests per minute per user
  const userLimit = checkRateLimit(`uid:${uid}`, { windowMs: 60_000, max: 20 });
  if (!userLimit.allowed) {
    return new Response(
      JSON.stringify({ error: 'rate_limit' }),
      { status: 429, headers: { ...headers, 'Retry-After': String(Math.ceil(userLimit.resetIn / 1000)) } }
    );
  }

  return { uid, ip };
}
