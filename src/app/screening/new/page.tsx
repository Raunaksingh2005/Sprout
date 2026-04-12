'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { MCHAT_QUESTIONS } from '@/data/mchat-questions';
import { ADHD_QUESTIONS } from '@/data/adhd-questions';
import { DYSLEXIA_QUESTIONS } from '@/data/dyslexia-questions';
import { saveScreening, updateScreeningSummary } from '@/lib/firebase/screenings';
import { generatePDF } from '@/lib/generateReport';
import { authFetch } from '@/lib/authFetch';
import { dobToMonths } from '@/lib/firebase/screenings';
import { invalidateCache } from '@/lib/screeningCache';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Download, Sparkles, Brain, Zap, BookOpen } from 'lucide-react';

type Step = 'select' | 'info' | 'questions' | 'result';
type Risk = 'Low' | 'Medium' | 'High';
type ScreeningType = 'autism' | 'adhd' | 'dyslexia';

const SCREENING_TYPES = [
  {
    id: 'autism' as ScreeningType,
    icon: Brain,
    label: 'Autism (ASD)',
    desc: 'M-CHAT-R/F · Ages 16–48 months · 20 questions',
    color: 'border-indigo-200 bg-blue-50 text-indigo-700',
    activeColor: 'border-indigo-600 bg-indigo-600 text-white',
    iconColor: 'text-blue-700',
  },
  {
    id: 'adhd' as ScreeningType,
    icon: Zap,
    label: 'ADHD',
    desc: 'Vanderbilt Scale · Ages 4–12 years · 18 questions',
    color: 'border-pink-200 bg-pink-50 text-pink-700',
    activeColor: 'border-pink-600 bg-pink-600 text-white',
    iconColor: 'text-pink-600',
  },
  {
    id: 'dyslexia' as ScreeningType,
    icon: BookOpen,
    label: 'Dyslexia',
    desc: 'BDA Checklist · Ages 5–12 years · 15 questions',
    color: 'border-amber-200 bg-amber-50 text-amber-700',
    activeColor: 'border-amber-500 bg-amber-500 text-white',
    iconColor: 'text-amber-600',
  },
];

const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all";

export default function NewScreeningPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('select');
  const [screeningType, setScreeningType] = useState<ScreeningType>('autism');
  const [childInfo, setChildInfo] = useState({ name: '', dob: '', gender: '' });
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null); // track saved screening ID
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const questions = screeningType === 'autism' ? MCHAT_QUESTIONS
    : screeningType === 'adhd' ? ADHD_QUESTIONS
    : DYSLEXIA_QUESTIONS;

  const totalQ = questions.length;

  // ── Scoring ──────────────────────────────────────────────────────────────
  const calcScore = (ans: Record<number, string>): number => {
    if (screeningType === 'autism') {
      let s = 0;
      MCHAT_QUESTIONS.forEach(q => {
        const a = ans[q.id];
        if (a && a !== q.expected && a !== 'sometimes') s++;
      });
      return s;
    }
    if (screeningType === 'adhd') {
      let s = 0;
      ADHD_QUESTIONS.forEach(q => {
        const val = parseInt(ans[q.id] ?? '0');
        if (val >= q.threshold) s++;
      });
      return s;
    }
    // dyslexia
    let s = 0;
    DYSLEXIA_QUESTIONS.forEach(q => {
      const val = parseInt(ans[q.id] ?? '0');
      if (val >= q.threshold) s++;
    });
    return s;
  };

  const getRisk = (score: number): Risk => {
    if (screeningType === 'autism') {
      if (score <= 2) return 'Low';
      if (score <= 7) return 'Medium';
      return 'High';
    }
    if (screeningType === 'adhd') {
      // 18 questions, concern if 6+ symptoms
      if (score <= 3) return 'Low';
      if (score <= 8) return 'Medium';
      return 'High';
    }
    // dyslexia — 15 questions
    if (score <= 3) return 'Low';
    if (score <= 7) return 'Medium';
    return 'High';
  };

  const getRiskDisplay = (r: Risk) => ({
    Low: { style: 'text-blue-700 bg-blue-50 border-blue-100', desc: 'Few or no indicators detected. Continue monitoring development.' },
    Medium: { style: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'Some indicators observed. A professional evaluation is recommended.' },
    High: { style: 'text-red-700 bg-red-50 border-red-200', desc: 'Multiple indicators identified. Please consult a specialist.' },
  }[r]);

  const getAnswerLabel = (qId: number, value: string): string => {
    const q = questions.find(q => q.id === qId);
    return q?.options.find(o => o.value === value)?.label ?? value;
  };

  // ── AI Summary ────────────────────────────────────────────────────────────
  const fetchAiSummary = async (name: string, dob: string, score: number, risk: Risk, ans: Record<number, string>) => {
    setSummaryLoading(true);
    try {
      const ageMonths = dobToMonths(dob);
      const concerns = questions
        .filter(q => {
          if (screeningType === 'autism') {
            const a = ans[q.id];
            return a && a !== (q as any).expected && a !== 'sometimes';
          }
          const val = parseInt(ans[q.id] ?? '0');
          return val >= (q as any).threshold;
        })
        .map(q => (q as any).observation?.concern ?? (q as any).shortLabel);

      const strengths = questions
        .filter(q => {
          if (screeningType === 'autism') {
            const a = ans[q.id];
            return a && (a === (q as any).expected || a === 'sometimes');
          }
          const val = parseInt(ans[q.id] ?? '0');
          return val < (q as any).threshold;
        })
        .map(q => (q as any).observation?.ok ?? (q as any).shortLabel);

      const screeningName = screeningType === 'autism' ? 'M-CHAT-R/F autism' : screeningType === 'adhd' ? 'ADHD (Vanderbilt)' : 'Dyslexia';

      const res = await authFetch('/api/generate-summary', {
        method: 'POST',
        body: JSON.stringify({
          childName: name,
          childAge: ageMonths,
          score,
          risk,
          strengths: strengths.slice(0, 5),
          concerns: concerns.slice(0, 6),
          screeningType: screeningName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const summary = data.summary ?? '';
        setAiSummary(summary);
        // Save summary to Firestore for dashboard re-downloads
        if (user && summary && savedId) {
          updateScreeningSummary(user.uid, savedId, summary).catch(() => {});
        }
      }
    } catch (e) {
      console.error('Summary fetch failed:', e);
    } finally {
      setSummaryLoading(false);
    }
  };

  // ── Answer handler ────────────────────────────────────────────────────────
  const handleAnswer = async (value: string) => {
    const qId = questions[currentQ].id;
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);

    if (currentQ < totalQ - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      const score = calcScore(newAnswers);
      const risk = getRisk(score);
      setSaving(true);

      // Start AI summary immediately in parallel — don't wait for Firestore
      fetchAiSummary(childInfo.name, childInfo.dob, score, risk, newAnswers);

      try {
        if (user) {
          const id = await saveScreening(user.uid, {
            childName: childInfo.name,
            childAge: dobToMonths(childInfo.dob),
            childGender: childInfo.gender,
            screeningType,
            answers: newAnswers,
            score,
            risk,
          });
          setSavedId(id);
          invalidateCache(user.uid);
        }
      } catch (e) {
        console.error('Failed to save:', e);
      } finally {
        setSaving(false);
        setStep('result');
      }
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      const score = calcScore(answers);
      const risk = getRisk(score);
      generatePDF({
        childName: childInfo.name,
        childAge: dobToMonths(childInfo.dob),
        childGender: childInfo.gender,
        screeningType,
        score,
        risk,
        answers,
        parentName: user?.displayName ?? undefined,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        aiSummary: aiSummary || undefined,
      });
    } finally {
      setDownloading(false);
    }
  };

  const score = calcScore(answers);
  const risk = getRisk(score);
  const riskDisplay = getRiskDisplay(risk);
  const selectedType = SCREENING_TYPES.find(t => t.id === screeningType)!;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-xl mx-auto px-5 py-8">

          {/* ── Select screening type ── */}
          {step === 'select' && (
            <div className="animate-fade-up">
              <p className="text-xs font-mono text-gray-400 mb-1">screening / new</p>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Choose screening type</h1>
              <p className="text-sm text-gray-500 mb-8">Select the area you'd like to screen for.</p>

              <div className="space-y-3 mb-8">
                {SCREENING_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = screeningType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setScreeningType(type.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${isSelected ? type.activeColor : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : type.iconColor}`} />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>{type.label}</p>
                        <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>{type.desc}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-white ml-auto" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep('info')}
                className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-bold py-3.5 rounded-xl hover:bg-blue-900 transition-colors shadow-lg shadow-blue-200 text-sm"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Info step ── */}
          {step === 'info' && (
            <div className="animate-fade-up">
              <button onClick={() => setStep('select')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <p className="text-xs font-mono text-gray-400 mb-1">{selectedType.label} screening</p>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Child information</h1>
              <p className="text-sm text-gray-500 mb-8">We'll use this to personalise the screening.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Child's name</label>
                  <input type="text" required value={childInfo.name} onChange={e => setChildInfo(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Emma" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Date of birth</label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Day */}
                    <select
                      value={childInfo.dob ? new Date(childInfo.dob + 'T00:00:00').getDate() : ''}
                      onChange={e => {
                        const parts = childInfo.dob ? childInfo.dob.split('-') : ['', '', ''];
                        const y = parts[0] || new Date().getFullYear();
                        const mo = parts[1] || '01';
                        const d = e.target.value.padStart(2, '0');
                        setChildInfo(p => ({ ...p, dob: `${y}-${mo}-${d}` }));
                      }}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {/* Month */}
                    <select
                      value={childInfo.dob ? new Date(childInfo.dob + 'T00:00:00').getMonth() + 1 : ''}
                      onChange={e => {
                        const parts = childInfo.dob ? childInfo.dob.split('-') : ['', '', ''];
                        const y = parts[0] || new Date().getFullYear();
                        const mo = e.target.value.padStart(2, '0');
                        const d = parts[2] || '01';
                        setChildInfo(p => ({ ...p, dob: `${y}-${mo}-${d}` }));
                      }}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="">Month</option>
                      {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                        <option key={m} value={i + 1}>{m}</option>
                      ))}
                    </select>
                    {/* Year */}
                    <select
                      value={childInfo.dob ? childInfo.dob.split('-')[0] : ''}
                      onChange={e => {
                        const parts = childInfo.dob ? childInfo.dob.split('-') : ['', '01', '01'];
                        const mo = parts[1] || '01';
                        const d = parts[2] || '01';
                        setChildInfo(p => ({ ...p, dob: `${e.target.value}-${mo}-${d}` }));
                      }}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="">Year</option>
                      {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  {childInfo.dob && childInfo.dob.split('-').every(p => p) && (() => {
                    const months = dobToMonths(childInfo.dob);
                    const y = Math.floor(months / 12);
                    const m = months % 12;
                    const ageStr = y === 0 ? `${m} months` : m === 0 ? `${y} years` : `${y} years ${m} months`;
                    return <p className="text-xs text-blue-600 font-semibold mt-2">Age: {ageStr}</p>;
                  })()}
                  <p className="text-xs text-gray-400 mt-1.5">
                    {screeningType === 'autism' ? 'M-CHAT validated for 16–48 months.' : screeningType === 'adhd' ? 'Vanderbilt validated for ages 4–12.' : 'BDA checklist validated for ages 5–12.'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Gender</label>
                  <div className="flex gap-2">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button key={g} type="button" onClick={() => setChildInfo(p => ({ ...p, gender: g }))}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${childInfo.gender === g ? 'border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-200' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep('questions')} disabled={!childInfo.name || !childInfo.dob || !childInfo.dob.split('-').every(p => p)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-bold py-3.5 rounded-xl hover:bg-blue-900 transition-colors shadow-lg shadow-blue-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  Start screening <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Questions step ── */}
          {step === 'questions' && (
            <div className="animate-fade-up">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-mono font-bold text-gray-500">{currentQ + 1} / {totalQ}</p>
                  <p className="text-xs font-mono text-gray-400">{Math.round((currentQ / totalQ) * 100)}%</p>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-700 rounded-full transition-all duration-500" style={{ width: `${(currentQ / totalQ) * 100}%` }} />
                </div>
              </div>

              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full mb-3">
                {questions[currentQ].category.replace(/_/g, ' ')}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2 leading-relaxed">
                {questions[currentQ].text}
              </h2>
              <p className="text-xs text-gray-400 mb-8">Select the option that best describes your child's behaviour.</p>

              {saving ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-sm text-gray-500">Saving your results...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions[currentQ].options.map((opt, oi) => {
                    const icons = ['✓', '~', '✗'];
                    const iconColors = ['text-emerald-600', 'text-amber-500', 'text-red-500'];
                    const iconBgs = ['bg-emerald-50', 'bg-amber-50', 'bg-red-50'];
                    const idx = Math.min(oi, 2);
                    return (
                      <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all group">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${iconBgs[idx]} ${iconColors[idx]} group-hover:scale-110 transition-transform`}>
                          {icons[idx]}
                        </span>
                        <span className="flex-1 text-left">{opt.label}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ > 0 && !saving && (
                <button onClick={() => setCurrentQ(p => p - 1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors mt-6">
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
              )}
            </div>
          )}

          {/* ── Result step ── */}
          {step === 'result' && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-700" />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Screening complete</h1>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">{selectedType.label}</span> results for <strong>{childInfo.name}</strong>
                </p>
              </div>

              <div className={`rounded-2xl border-2 p-8 text-center mb-5 ${riskDisplay.style}`}>
                <p className="text-xs font-mono font-bold mb-2 opacity-60 uppercase tracking-widest">{selectedType.label} Score</p>
                <p className="text-6xl font-black font-mono mb-1">{score}</p>
                <p className="text-xs opacity-60 mb-4">out of {totalQ}</p>
                <p className="text-lg font-extrabold">{risk} Risk</p>
                <p className="text-sm mt-3 opacity-80 max-w-xs mx-auto leading-relaxed">{riskDisplay.desc}</p>
              </div>

              {/* AI Summary */}
              <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">AI-Generated Summary</p>
                </div>
                {summaryLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700 font-semibold">Generating personalised summary...</p>
                      <p className="text-xs text-blue-400 mt-0.5">Our AI is analysing your responses</p>
                    </div>
                  </div>
                ) : aiSummary ? (
                  <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
                ) : (
                  <p className="text-sm text-blue-400 italic">Summary unavailable.</p>
                )}
              </div>

              <button onClick={handleDownload} disabled={downloading || summaryLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-700 transition-colors text-sm mb-3 disabled:opacity-50">
                {downloading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</> : <><Download className="w-4 h-4" /> Download Full Report (PDF)</>}
              </button>

              <div className="flex gap-3">
                <button onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-colors text-sm font-semibold">
                  Dashboard
                </button>
                <button onClick={() => router.push('/chat')}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors text-sm shadow-lg shadow-blue-200">
                  Ask AI assistant
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
                Screening tool only · Not a medical diagnosis<br />
                Please consult a qualified healthcare professional.
              </p>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
