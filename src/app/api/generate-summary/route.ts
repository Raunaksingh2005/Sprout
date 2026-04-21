import { NextRequest } from 'next/server';
import { callAI } from '@/lib/ai';
import { requireAuth, corsHeaders } from '@/lib/apiAuth';

export const maxDuration = 30;

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: NextRequest) {
  // Auth + rate limit check
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { childName, childAge, score, risk, strengths, concerns, screeningType } = await req.json();

    // Sanitise inputs
    const safeName = String(childName ?? '').slice(0, 50);
    const safeAge = Number(childAge) || 0;
    const safeScore = Number(score) || 0;
    const safeRisk = ['Low', 'Medium', 'High'].includes(risk) ? risk : 'Low';
    const safeType = ['autism', 'adhd', 'dyslexia'].includes(screeningType) ? screeningType : 'autism';
    const ageUnit = safeType === 'autism' ? 'months' : 'years';

    const prompt = `You are writing a section of a child developmental screening report for a parent.

Child: ${safeName}, ${safeAge} ${ageUnit} old
Screening: ${safeType}
Score: ${safeScore}
Risk Level: ${safeRisk}

Areas of strength:
${(strengths ?? []).slice(0, 5).map((s: string) => `- ${String(s).slice(0, 100)}`).join('\n')}

Areas of concern:
${(concerns ?? []).slice(0, 6).map((c: string) => `- ${String(c).slice(0, 100)}`).join('\n')}

Write a 3-paragraph parent-friendly summary:
- Paragraph 1: What the score means in plain language
- Paragraph 2: What was specifically observed for ${safeName} — mention strengths and concerns naturally
- Paragraph 3: Reassuring closing with encouragement and reminder to consult a professional

Rules: NEVER diagnose. Warm compassionate tone. No bullet points. Under 150 words total. Use the child's name.`;

    const summary = await callAI([{ role: 'user', content: prompt }], 300);

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Summary generation error:', err?.message);
    return new Response(JSON.stringify({ error: 'Failed to generate summary' }), { status: 500 });
  }
}
