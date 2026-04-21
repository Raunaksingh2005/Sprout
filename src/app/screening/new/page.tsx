'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { MCHAT_QUESTIONS } from '@/data/mchat-questions';
import { CAST_QUESTIONS } from '@/data/cast-questions';
import { AQ10_QUESTIONS, scoreAQ10Answer } from '@/data/aq10-questions';
import { ADHD_QUESTIONS } from '@/data/adhd-questions';
import { ASRS_QUESTIONS } from '@/data/asrs-questions';
import { DYSLEXIA_QUESTIONS } from '@/data/dyslexia-questions';
import { saveScreening, updateScreeningSummary } from '@/lib/firebase/screenings';
import { generatePDF } from '@/lib/generateReport';
import { authFetch } from '@/lib/authFetch';
import { dobToMonths } from '@/lib/firebase/screenings';
import { invalidateCache } from '@/lib/screeningCache';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Download, Sparkles, Brain, Zap, BookOpen, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'select' | 'info' | 'questions' | 'result';
type Risk = 'Low' | 'Medium' | 'High';
type ScreeningType = 'autism' | 'adhd' | 'dyslexia';

// Auto-select the right tool based on age in months
function getAutismTool(ageMonths: number): 'mchat' | 'cast' | 'aq10' {
  if (ageMonths < 48) return 'mchat';
  if (ageMonths < 144) return 'cast';
  return 'aq10';
}

function getAutismToolLabel(tool: 'mchat' | 'cast' | 'aq10'): string {
  return { mchat: 'M-CHAT-R/F', cast: 'CAST', aq10: 'AQ-10' }[tool];
}

function getAdhdTool(ageMonths: number): 'vanderbilt' | 'asrs' {
  return ageMonths < 144 ? 'vanderbilt' : 'asrs'; // < 12y → Vanderbilt, 12y+ → ASRS
}

function getAdhdToolLabel(tool: 'vanderbilt' | 'asrs'): string {
  return { vanderbilt: 'Vanderbilt Scale', asrs: 'ASRS-v1.1' }[tool];
}

const SCREENING_TYPES = [
  {
    id: 'autism' as ScreeningType,
    icon: Brain,
    label: 'Autism (ASD)',
    desc: 'Auto-selects tool by age · M-CHAT / CAST / AQ-10',
    color: 'border-indigo-200 bg-teal-50 text-indigo-700',
    activeColor: 'border-teal-600 bg-teal-600 text-white',
    iconColor: 'text-teal-700',
  },
  {
    id: 'adhd' as ScreeningType,
    icon: Zap,
    label: 'ADHD',
    desc: 'Auto-selects tool by age · Vanderbilt (4–12y) · ASRS (12y+)',
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

const inputClass = "w-full bg-navy-50 border border-navy-200 rounded-xl px-4 py-3 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white transition-all";

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
  const [savedId, setSavedId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Derive the autism tool and ADHD tool from the child's age
  const ageMonths = childInfo.dob && childInfo.dob.split('-').every(p => p) ? dobToMonths(childInfo.dob) : 0;
  const autismTool = getAutismTool(ageMonths);
  const adhdTool = getAdhdTool(ageMonths);

  // Pick the right question set
  const questions = useMemo(() => {
    if (screeningType === 'autism') {
      if (autismTool === 'mchat') return MCHAT_QUESTIONS;
      if (autismTool === 'cast')  return CAST_QUESTIONS;
      return AQ10_QUESTIONS;
    }
    if (screeningType === 'adhd') {
      return adhdTool === 'vanderbilt' ? ADHD_QUESTIONS : ASRS_QUESTIONS;
    }
    return DYSLEXIA_QUESTIONS;
  }, [screeningType, autismTool, adhdTool]);

  const totalQ = questions.length;

  // ── Scoring ──────────────────────────────────────────────────────────────
  const calcScore = (ans: Record<number, string>): number => {
    if (screeningType === 'autism') {
      if (autismTool === 'mchat') {
        let s = 0;
        MCHAT_QUESTIONS.forEach(q => { const a = ans[q.id]; if (a && a !== q.expected && a !== 'sometimes') s++; });
        return s;
      }
      if (autismTool === 'cast') {
        let s = 0;
        CAST_QUESTIONS.forEach(q => { const a = ans[q.id]; if (a && a !== q.expected) s++; });
        return s;
      }
      // AQ-10
      let s = 0;
      AQ10_QUESTIONS.forEach(q => { s += scoreAQ10Answer(q.id, ans[q.id] ?? ''); });
      return s;
    }
    if (screeningType === 'adhd') {
      const qs = adhdTool === 'vanderbilt' ? ADHD_QUESTIONS : ASRS_QUESTIONS;
      let s = 0;
      qs.forEach(q => { const val = parseInt(ans[q.id] ?? '0'); if (val >= q.threshold) s++; });
      return s;
    }
    let s = 0;
    DYSLEXIA_QUESTIONS.forEach(q => { const val = parseInt(ans[q.id] ?? '0'); if (val >= q.threshold) s++; });
    return s;
  };

  const getRisk = (score: number): Risk => {
    if (screeningType === 'autism') {
      if (autismTool === 'mchat') { return score <= 2 ? 'Low' : score <= 7 ? 'Medium' : 'High'; }
      if (autismTool === 'cast')  { return score < 10 ? 'Low' : score < 15 ? 'Medium' : 'High'; }
      // AQ-10: ≥6 = refer
      return score < 4 ? 'Low' : score < 6 ? 'Medium' : 'High';
    }
    if (screeningType === 'adhd') {
      if (adhdTool === 'asrs') {
        // ASRS Part A: ≥4 out of 6 = refer
        return score < 3 ? 'Low' : score < 4 ? 'Medium' : 'High';
      }
      return score <= 3 ? 'Low' : score <= 8 ? 'Medium' : 'High';
    }
    return score <= 3 ? 'Low' : score <= 7 ? 'Medium' : 'High';
  };

  const getRiskDisplay = (r: Risk) => ({
    Low: { style: 'text-teal-700 bg-teal-50 border-teal-100', desc: 'Few or no indicators detected. Continue monitoring development.' },
    Medium: { style: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'Some indicators observed. A professional evaluation is recommended.' },
    High: { style: 'text-red-700 bg-red-50 border-red-200', desc: 'Multiple indicators identified. Please consult a specialist.' },
  }[r]);

  const getAnswerLabel = (qId: number, value: string): string => {
    const q = questions.find(q => q.id === qId);
    const opts = (q as any)?.options;
    if (opts) return opts.find((o: any) => o.value === value)?.label ?? value;
    return value.charAt(0).toUpperCase() + value.slice(1);
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

    // Wait 350ms before proceeding so user can see their selection
    setTimeout(async () => {
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
    }, 350);
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <main className="max-w-xl mx-auto px-5 py-8 overflow-hidden">
          <AnimatePresence mode="wait">
          {/* ── Select screening type ── */}
          {step === 'select' && (
            <motion.div 
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs font-mono text-navy-400 mb-1">screening / new</p>
              <h1 className="text-2xl font-extrabold text-navy-900 mb-1">Choose screening type</h1>
              <p className="text-sm text-navy-500 mb-8">Select the area you'd like to screen for.</p>

              <div className="space-y-3 mb-8">
                {SCREENING_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = screeningType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setScreeningType(type.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${isSelected ? type.activeColor : 'border-navy-200 bg-white hover:border-navy-300'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : type.iconColor}`} />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-navy-900'}`}>{type.label}</p>
                        <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/70' : 'text-navy-400'}`}>{type.desc}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-white ml-auto" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep('info')}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 text-sm"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ── Info step ── */}
          {step === 'info' && (
            <motion.div 
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <button onClick={() => setStep('select')} className="flex items-center gap-1.5 text-xs text-navy-400 hover:text-navy-700 mb-4 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <p className="text-xs font-mono text-navy-400 mb-1">{selectedType.label} screening</p>
              <h1 className="text-2xl font-extrabold text-navy-900 mb-1">Child information</h1>
              <p className="text-sm text-navy-500 mb-8">We'll use this to personalise the screening.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5 uppercase tracking-wide">Child's name</label>
                  <input type="text" required value={childInfo.name} onChange={e => setChildInfo(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Emma" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Date of birth</label>
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
                      className="bg-navy-50 border border-navy-200 rounded-xl px-3 py-3 text-sm text-navy-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
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
                      className="bg-navy-50 border border-navy-200 rounded-xl px-3 py-3 text-sm text-navy-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
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
                      className="bg-navy-50 border border-navy-200 rounded-xl px-3 py-3 text-sm text-navy-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
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

                    // For autism or ADHD, show which tool will be used
                    const toolInfo = (() => {
                      if (screeningType === 'autism') {
                        const tool = getAutismTool(months);
                        const toolLabel = getAutismToolLabel(tool);
                        const toolDesc = { mchat: '20 questions · Ages 16m–4y', cast: '37 questions · Ages 4–11y', aq10: '10 questions · Ages 12+' }[tool];
                        return { toolLabel, toolDesc };
                      }
                      if (screeningType === 'adhd') {
                        const tool = getAdhdTool(months);
                        const toolLabel = getAdhdToolLabel(tool);
                        const toolDesc = { vanderbilt: '18 questions · Ages 4–12', asrs: '6 questions · Ages 12+' }[tool];
                        return { toolLabel, toolDesc };
                      }
                      return null;
                    })();

                    // Validate age range per screening type
                    const ranges: Record<string, { min: number; max: number; label: string }> = {
                      autism:   { min: 16,  max: 600, label: '16 months and above' },
                      adhd:     { min: 48,  max: 600, label: '4 years and above' },
                      dyslexia: { min: 60,  max: 144, label: '5–12 years' },
                    };
                    const range = ranges[screeningType];
                    const inRange = months >= range.min && months <= range.max;

                    return (
                      <div className="mt-2 space-y-2">
                        <p className={`text-xs font-semibold ${inRange ? 'text-teal-600' : 'text-red-600'}`}>
                          Age: {ageStr}
                        </p>
                        {toolInfo && inRange && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-teal-50 border border-teal-200">
                            <Info className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-teal-700 font-medium">
                              We'll use the <strong>{toolInfo.toolLabel}</strong> — {toolInfo.toolDesc}
                            </p>
                          </div>
                        )}
                        {!inRange && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                            <span className="text-red-500 text-sm flex-shrink-0">⚠️</span>
                            <p className="text-xs text-red-700 font-medium leading-relaxed">
                              The {screeningType === 'adhd' ? 'Vanderbilt' : 'BDA'} screening is validated for children aged <strong>{range.label}</strong>. Results outside this range may not be accurate.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <p className="text-xs text-navy-400 mt-1.5">
                    {screeningType === 'autism'
                      ? 'Tool auto-selected based on age: M-CHAT (16m–4y) · CAST (4–11y) · AQ-10 (12y+)'
                      : screeningType === 'adhd'
                      ? 'Tool auto-selected based on age: Vanderbilt (4–12y) · ASRS (12y+)'
                      : 'BDA checklist validated for ages 5–12.'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-2 uppercase tracking-wide">Gender</label>
                  <div className="flex gap-2">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button key={g} type="button" onClick={() => setChildInfo(p => ({ ...p, gender: g }))}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${childInfo.gender === g ? 'border-blue-700 bg-teal-600 text-white shadow-lg shadow-teal-200' : 'border-navy-200 bg-white text-gray-600 hover:border-navy-300'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep('questions')} disabled={!childInfo.name || !childInfo.dob || !childInfo.dob.split('-').every(p => p) || (() => {
                    if (!childInfo.dob || !childInfo.dob.split('-').every(p => p)) return true;
                    const months = dobToMonths(childInfo.dob);
                    const ranges: Record<string, { min: number; max: number }> = {
                      autism: { min: 16, max: 600 }, adhd: { min: 48, max: 600 }, dyslexia: { min: 60, max: 144 },
                    };
                    const r = ranges[screeningType];
                    return months < r.min || months > r.max;
                  })()}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  Start screening <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Questions step ── */}
          {step === 'questions' && (
            <motion.div 
              key={`q-${currentQ}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-mono font-bold text-navy-500">{currentQ + 1} / {totalQ}</p>
                  <p className="text-xs font-mono text-navy-400">{Math.round((currentQ / totalQ) * 100)}%</p>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full transition-all duration-500" style={{ width: `${(currentQ / totalQ) * 100}%` }} />
                </div>
              </div>

              <span className="inline-block text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded-full mb-3">
                {questions[currentQ].category.replace(/_/g, ' ')}
              </span>
              <h2 className="text-xl font-bold text-navy-900 mt-2 mb-2 leading-relaxed">
                {questions[currentQ].text}
              </h2>
              <p className="text-xs text-navy-400 mb-8">Select the option that best describes your child's behaviour.</p>

              {saving ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                  <p className="text-sm text-navy-500">Saving your results...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    const q = questions[currentQ];
                    // Questions with explicit options (ADHD, Dyslexia, AQ-10)
                    const opts = (q as any).options as { label: string; value: string }[] | undefined;
                    // Questions with expected yes/no (M-CHAT, CAST)
                    const yesNoOpts = opts ?? [
                      { label: 'Yes', value: 'yes' },
                      { label: 'Sometimes', value: 'sometimes' },
                      { label: 'No', value: 'no' },
                    ];
                    const icons = ['✓', '~', '✗'];
                    const iconColors = ['text-emerald-600', 'text-amber-500', 'text-red-500'];
                    const iconBgs = ['bg-emerald-50', 'bg-amber-50', 'bg-red-50'];
                    return yesNoOpts.map((opt, oi) => {
                      const idx = Math.min(oi, 2);
                      const isSelected = answers[q.id] === opt.value;
                      return (
                        <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-sm font-semibold transition-all group ${
                            isSelected
                              ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-md'
                              : 'border-navy-200 bg-white text-navy-700 hover:border-teal-300 hover:bg-navy-50'
                          }`}>
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${iconBgs[idx]} ${iconColors[idx]}`}>
                            {icons[idx]}
                          </span>
                          <span className="flex-1 text-left">{opt.label}</span>
                          {isSelected
                            ? <CheckCircle className="w-5 h-5 text-teal-600" />
                            : <ArrowRight className="w-4 h-4 text-navy-300 group-hover:text-teal-400 transition-colors" />
                          }
                        </button>
                      );
                    });
                  })()}
                </div>
              )}

              {currentQ > 0 && !saving && (
                <button onClick={() => setCurrentQ(p => p - 1)} className="flex items-center gap-2 text-sm text-navy-400 hover:text-navy-900 transition-colors mt-6">
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
              )}
            </motion.div>
          )}

          {/* ── Result step ── */}
          {step === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-teal-700" />
                </div>
                <h1 className="text-2xl font-extrabold text-navy-900 mb-1">Screening complete</h1>
                <p className="text-sm text-navy-500">
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
              <div className="mb-5 rounded-2xl border border-teal-100 bg-teal-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <p className="text-xs font-bold text-teal-700 uppercase tracking-wide">AI-Generated Summary</p>
                </div>
                {summaryLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-teal-500 animate-spin flex-shrink-0" />
                    <div>
                      <p className="text-sm text-teal-700 font-semibold">Generating personalised summary...</p>
                      <p className="text-xs text-teal-400 mt-0.5">Our AI is analysing your responses</p>
                    </div>
                  </div>
                ) : aiSummary ? (
                  <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
                ) : (
                  <p className="text-sm text-teal-400 italic">Summary unavailable.</p>
                )}
              </div>

              <button onClick={handleDownload} disabled={downloading || summaryLoading}
                className="w-full flex items-center justify-center gap-2 bg-navy-900 text-white font-bold py-3.5 rounded-xl hover:bg-navy-700 transition-colors text-sm mb-3 disabled:opacity-50">
                {downloading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</> : <><Download className="w-4 h-4" /> Download Full Report (PDF)</>}
              </button>

              <div className="flex gap-3">
                <button onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 rounded-xl border-2 border-navy-200 text-navy-700 hover:text-navy-900 hover:border-navy-300 transition-colors text-sm font-semibold">
                  Dashboard
                </button>
                <button onClick={() => router.push('/chat')}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors text-sm shadow-lg shadow-teal-200">
                  Ask AI assistant
                </button>
              </div>

              <p className="text-xs text-navy-400 text-center mt-6 leading-relaxed">
                Screening tool only · Not a medical diagnosis<br />
                Please consult a qualified healthcare professional.
              </p>
            </motion.div>
          )}
          </AnimatePresence>
        </main>
      </div>
    </AuthGuard>
  );
}
