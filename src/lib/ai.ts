import https from 'https';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// ── Generic HTTPS POST ────────────────────────────────────────────────────────
function httpsPost(hostname: string, path: string, headers: Record<string, string | number>, body: string): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: 'POST', headers, timeout: 25000 },
      (res) => {
        let data = '';
        res.on('data', c => { data += c; });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, data }));
      }
    );
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Provider 1: Groq (fastest) ────────────────────────────────────────────────
async function callGroq(messages: AIMessage[], maxTokens = 600): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('no_key');

  const body = JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
  });

  const { status, data } = await httpsPost(
    'api.groq.com',
    '/openai/v1/chat/completions',
    { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`, 'Content-Length': Buffer.byteLength(body) },
    body
  );

  if (status === 429) throw new Error('rate_limit');
  if (status !== 200) throw new Error(`groq_${status}`);

  const json = JSON.parse(data);
  return json.choices[0].message.content;
}

// ── Provider 2: Gemini Flash ──────────────────────────────────────────────────
async function callGemini(messages: AIMessage[], maxTokens = 600): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('no_key');

  // Separate system message
  const systemMsg = messages.find(m => m.role === 'system');
  const convo = messages.filter(m => m.role !== 'system');

  const contents = [
    ...(systemMsg ? [
      { role: 'user', parts: [{ text: systemMsg.content }] },
      { role: 'model', parts: [{ text: 'Understood.' }] },
    ] : []),
    ...convo.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ];

  const body = JSON.stringify({
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
  });

  const { status, data } = await httpsPost(
    'generativelanguage.googleapis.com',
    `/v1beta/models/gemini-flash-latest:generateContent?key=${key}`,
    { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    body
  );

  if (status === 429) throw new Error('rate_limit');
  if (status !== 200) throw new Error(`gemini_${status}`);

  const json = JSON.parse(data);
  return json.candidates[0].content.parts[0].text;
}

// ── Provider 3: OpenRouter (free models) ─────────────────────────────────────
async function callOpenRouter(messages: AIMessage[], maxTokens = 600): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('no_key');

  const body = JSON.stringify({
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    messages,
    max_tokens: maxTokens,
  });

  const { status, data } = await httpsPost(
    'openrouter.ai',
    '/api/v1/chat/completions',
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://autiscan.app',
      'X-Title': 'AutiScan',
      'Content-Length': Buffer.byteLength(body),
    },
    body
  );

  if (status === 429) throw new Error('rate_limit');
  if (status !== 200) throw new Error(`openrouter_${status}`);

  const json = JSON.parse(data);
  return json.choices[0].message.content;
}

// ── Fallback chain: Groq → Gemini → OpenRouter ───────────────────────────────
export async function callAI(messages: AIMessage[], maxTokens = 600): Promise<string> {
  const providers = [
    { name: 'Groq', fn: callGroq },
    { name: 'Gemini', fn: callGemini },
    { name: 'OpenRouter', fn: callOpenRouter },
  ];

  let lastError: Error | null = null;

  for (const { name, fn } of providers) {
    try {
      const result = await fn(messages, maxTokens);
      if (result) {
        console.log(`[AI] Responded via ${name}`);
        return result;
      }
    } catch (err: any) {
      console.warn(`[AI] ${name} failed: ${err.message}`);
      lastError = err;
      // Only continue to next provider on rate limit or key errors
      if (!['rate_limit', 'no_key', 'timeout'].some(e => err.message?.includes(e)) && !err.message?.startsWith('groq_') && !err.message?.startsWith('gemini_') && !err.message?.startsWith('openrouter_')) {
        break;
      }
    }
  }

  throw lastError ?? new Error('All AI providers failed');
}
