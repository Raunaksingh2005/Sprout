import { NextRequest } from 'next/server';
import { callAI } from '@/lib/ai';
import { requireAuth } from '@/lib/apiAuth';

const SYSTEM_PROMPT = `You are Sprout's AI assistant — a knowledgeable, compassionate guide for parents concerned about their child's development.

Your role:
- Answer questions about autism spectrum disorder (ASD), ADHD, dyslexia, early signs, and developmental milestones
- Help parents understand their screening results (M-CHAT-R/F, Vanderbilt ADHD Scale, Dyslexia Checklist) in plain language
- Suggest practical at-home activities to support child development
- Guide parents on next steps (when to see a pediatrician, what to ask, etc.)
- Provide emotional support and reassurance where appropriate

Rules:
- NEVER provide a medical diagnosis or say a child "has autism", "has ADHD", or "has dyslexia"
- Always remind parents that only qualified healthcare professionals can diagnose these conditions
- Keep responses concise, warm, and parent-friendly — avoid heavy medical jargon
- If asked about something outside child development / neurodevelopment, politely redirect
- Responses should be 2-4 short paragraphs max unless a list is genuinely helpful`;

export async function POST(req: NextRequest) {
  // Auth + rate limit check
  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
    }

    // Limit conversation history to last 10 messages to prevent prompt injection via long history
    const safeMessages = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: String(m.content).slice(0, 2000), // cap each message at 2000 chars
    }));

    const reply = await callAI([
      { role: 'system', content: SYSTEM_PROMPT },
      ...safeMessages,
    ]);

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Chat API error:', err?.message);
    const isRateLimit = err?.message === 'rate_limit';
    return new Response(
      JSON.stringify({ error: isRateLimit ? 'rate_limit' : 'AI service unavailable. Please try again.' }),
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
