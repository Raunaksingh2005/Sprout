'use client';

import { useState, useRef, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { authFetch } from '@/lib/authFetch';

interface Message { id: number; role: 'user' | 'assistant'; content: string; ts: Date; }

const SUGGESTED = [
  'What are early signs of autism?',
  'Signs of ADHD in a 6-year-old',
  'What is dyslexia?',
  'Medium risk — what now?',
  'How to talk to my pediatrician?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1, role: 'assistant', ts: new Date(),
    content: "Hi! I'm Sprout's AI assistant. I can help you understand autism, ADHD, dyslexia, developmental milestones, and guide you through your screening results. What would you like to know?",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError('');
    const userMsg: Message = { id: Date.now(), role: 'user', content: text, ts: new Date() };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(''); setLoading(true);
    try {
      const res = await authFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: updated.map(m => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        if (d.error === 'rate_limit') { setError('Too many requests — please wait a moment.'); return; }
        throw new Error('API error');
      }
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.reply, ts: new Date() }]);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <AuthGuard>
      {/* Use dvh so mobile browser chrome doesn't cause resize issues */}
      <div className="flex flex-col bg-navy-50" style={{ height: '100dvh' }}>
        <Navbar />

        {/* Chat area — fills remaining space */}
        <div className="flex-1 flex flex-col min-h-0 max-w-3xl w-full mx-auto px-4 pt-4 pb-2">

          {/* Chat header */}
          <div className="flex items-center gap-3 pb-3 border-b border-navy-100 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-navy-900">Sprout AI</p>
              <p className="text-xs text-navy-400 truncate">ASD, ADHD & Dyslexia guidance</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs text-navy-400">Online</span>
            </div>
          </div>

          {/* Messages — scrollable */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 animate-fade-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${msg.role === 'user' ? 'bg-navy-800' : 'bg-teal-600'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-card ${
                    msg.role === 'user'
                      ? 'bg-navy-800 text-white rounded-tr-sm'
                      : 'bg-white border border-navy-100 text-navy-700 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-navy-400 px-1 font-mono">
                    {msg.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 animate-fade-up">
                <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-navy-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-card">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 pb-3 flex-shrink-0">
              {SUGGESTED.map((s, i) => (
                <button key={i} onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-navy-200 text-navy-500 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-colors bg-white">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input — fixed at bottom, font-size 16px prevents iOS zoom */}
          <div className="flex-shrink-0 pb-2">
            <div className="flex items-center gap-2 bg-white border-2 border-navy-200 rounded-2xl px-4 py-3 focus-within:border-teal-400 focus-within:shadow-glow transition-all shadow-card">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask about autism, ADHD, dyslexia..."
                style={{ fontSize: '16px' }} /* prevents iOS keyboard zoom */
                className="flex-1 bg-transparent text-navy-900 placeholder-navy-400 focus:outline-none min-w-0"
                disabled={loading}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center hover:bg-teal-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-center text-[10px] text-navy-400 font-mono mt-2">
              For educational purposes only · Not medical advice
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
