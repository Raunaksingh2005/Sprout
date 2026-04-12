'use client';

import { useState, useRef, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { authFetch } from '@/lib/authFetch';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  ts: Date;
}

const SUGGESTED = [
  'What are early signs of autism?',
  'Signs of ADHD in a 6-year-old',
  'What is dyslexia and how is it detected?',
  'My child scored medium risk — what now?',
  'How to talk to my pediatrician?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm Sprout's AI assistant. I can help you understand autism, ADHD, dyslexia, developmental milestones, and guide you through your screening results. What would you like to know?",
      ts: new Date(),
    },
  ]);
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
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await authFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.error === 'rate_limit') {
          setError('Too many requests — please wait a few seconds and try again.');
          return;
        }
        throw new Error('API error');
      }

      const data = await res.json();
      const reply: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
        ts: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-5 gap-4">
          {/* Chat header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">AI Assistant</p>
              <p className="text-xs text-gray-400">Powered by Gemini · ASD, ADHD & Dyslexia guidance</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-700 animate-pulse" />
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 animate-fade-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-gray-900' : 'bg-indigo-100'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-3.5 h-3.5 text-white" />
                    : <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  }
                </div>
                <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-gray-900 text-white rounded-tr-sm'
                      : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-gray-400 px-1 font-mono">
                    {msg.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5 animate-fade-up">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts — only on first message */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors bg-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white transition-all">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything about autism, ADHD, dyslexia or development..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              disabled={loading}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-400 font-mono">
            For educational purposes only · Not medical advice
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
