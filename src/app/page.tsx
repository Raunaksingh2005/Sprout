'use client';

import Link from 'next/link';
import { ArrowRight, Brain, Zap, BookOpen, MessageSquare, ClipboardList, Shield, CheckCircle, Clock, Sprout, ChevronRight } from 'lucide-react';

const screenings = [
  {
    icon: Brain,
    label: 'Autism (ASD)',
    age: '16 months+',
    tool: 'M-CHAT-R/F · CAST · AQ-10',
    desc: 'Auto-selects the right tool based on your child\'s age',
    ring: 'ring-indigo-200', bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', tag: 'bg-indigo-100 text-indigo-700',
  },
  {
    icon: Zap,
    label: 'ADHD',
    age: '4 years+',
    tool: 'Vanderbilt · ASRS',
    desc: 'Vanderbilt for children, ASRS for teens and adults',
    ring: 'ring-pink-200', bg: 'bg-pink-50', iconBg: 'bg-pink-100', iconColor: 'text-pink-600', tag: 'bg-pink-100 text-pink-700',
  },
  {
    icon: BookOpen,
    label: 'Dyslexia',
    age: '5–12 years',
    tool: 'BDA Checklist',
    desc: 'British Dyslexia Association validated checklist',
    ring: 'ring-amber-200', bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', tag: 'bg-amber-100 text-amber-700',
  },
];

const steps = [
  { n: '01', title: 'Create a free account',    desc: 'Sign up in 30 seconds. No credit card.' },
  { n: '02', title: 'Choose a screening type',  desc: 'Autism, ADHD, or Dyslexia — or all three.' },
  { n: '03', title: 'Answer the questions',     desc: 'Simple questions about your child. ~10 min.' },
  { n: '04', title: 'Get your AI report',       desc: 'Instant risk result + personalised PDF report.' },
];

const faqs = [
  { q: 'Is Sprout a medical diagnosis?',          a: 'No. Sprout is a screening tool only. Always consult a qualified healthcare professional for a diagnosis.' },
  { q: 'What age ranges are supported?', a: 'Autism: 16 months+ (M-CHAT-R/F for under 4, CAST for 4–11, AQ-10 for 12+). ADHD: 4+ years (Vanderbilt for 4–12, ASRS for 12+). Dyslexia: 5–12 years.' },
  { q: 'Is my data private?',                     a: 'Yes. All data is encrypted and stored securely via Firebase. We never sell or share your information.' },
  { q: 'Can I screen for multiple conditions?',   a: 'Yes — run separate screenings for each condition. Each generates its own AI-powered report.' },
  { q: 'What if my child scores high risk?',      a: 'We guide you on next steps and our AI assistant can help you prepare for a conversation with your doctor.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-navy-900">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <Sprout className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-navy-900 text-lg tracking-tight">sprout</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-navy-500 hover:text-navy-900 transition-colors px-4 py-2">Sign in</Link>
            <Link href="/signup" className="text-sm font-bold bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
              Get started →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-navy-50">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f020_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f020_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold mb-7 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Free · Clinically validated · AI-powered
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.05] tracking-tight text-navy-900 mb-6 animate-fade-up delay-100">
              Early screening<br />
              for <span className="text-teal-600">ASD, ADHD</span><br />
              <span className="text-teal-600">&amp; Dyslexia.</span>
            </h1>
            <p className="text-lg text-navy-500 max-w-lg leading-relaxed mb-9 animate-fade-up delay-200">
              Sprout helps parents identify early signs of neurodevelopmental conditions in children using clinically validated questionnaires and AI-generated insights — in under 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-300">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 text-sm hover-lift">
                Start free screening <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#how" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-navy-600 border-2 border-navy-200 px-8 py-4 rounded-2xl hover:border-teal-300 hover:text-teal-700 transition-all">
                See how it works
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap gap-10 animate-fade-up delay-400">
            {[
              { val: '3',       label: 'Screening types',  color: 'text-teal-600' },
              { val: '< 10 min', label: 'Per screening',   color: 'text-indigo-600' },
              { val: '100%',    label: 'Free to use',      color: 'text-pink-600' },
            ].map(({ val, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`text-3xl font-extrabold font-mono ${color}`}>{val}</span>
                <span className="text-sm text-navy-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Screenings ── */}
      <section id="screenings" className="max-w-6xl mx-auto px-5 py-20">
        <div className="mb-12">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">What we screen</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">Three screenings, one platform</h2>
          <p className="text-navy-500 max-w-xl">Each uses a clinically validated tool, takes under 10 minutes, and generates an AI-powered report with personalised next steps.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {screenings.map(({ icon: Icon, label, age, tool, desc, bg, iconBg, iconColor, tag, ring }) => (
            <div key={label} className={`p-6 rounded-3xl border-2 ${bg} ring-1 ${ring} hover:shadow-card transition-all hover-lift`}>
              <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="font-extrabold text-navy-900 text-lg mb-1">{label}</h3>
              <p className="text-xs text-navy-400 mb-1">{age}</p>
              <p className="text-xs text-navy-500 mb-4 leading-relaxed">{desc}</p>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${tag}`}>{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="bg-navy-950 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-12">
            <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">The process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">How Sprout works</h2>
            <p className="text-navy-400 max-w-xl">From signup to report in under 10 minutes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="bg-navy-800/60 border border-navy-700 rounded-3xl p-6 hover:border-teal-700 transition-colors">
                <span className="font-mono text-4xl font-black text-navy-700 block mb-4">{n}</span>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-navy-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: ClipboardList, label: 'Validated tools',  desc: 'M-CHAT-R/F, CAST, AQ-10, Vanderbilt, ASRS, BDA', bg: 'bg-teal-600' },
              { icon: MessageSquare, label: 'AI assistant',     desc: 'Ask follow-up questions about any result', bg: 'bg-indigo-600' },
              { icon: Shield,        label: 'Private & secure', desc: 'Encrypted, never shared', bg: 'bg-pink-600' },
            ].map(({ icon: Icon, label, desc, bg }) => (
              <div key={label} className="bg-navy-800/40 border border-navy-700 rounded-3xl p-6">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-white mb-1">{label}</p>
                <p className="text-sm text-navy-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Chat ── */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 p-8 sm:p-12 flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex-1">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">AI Assistant</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-3">Ask anything, anytime</h2>
            <p className="text-navy-500 text-sm leading-relaxed mb-6 max-w-md">
              Our AI assistant is trained on child development, autism, ADHD, and dyslexia. Ask about early signs, what a score means, or how to talk to your pediatrician.
            </p>
            <div className="space-y-2.5">
              {[
                'What are early signs of ADHD in a 5-year-old?',
                'My child scored medium risk — what should I do?',
                'How do I explain dyslexia to my child\'s teacher?',
              ].map(q => (
                <div key={q} className="flex items-start gap-2 text-sm text-navy-600">
                  <ChevronRight className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="italic">"{q}"</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-navy-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-navy-800 transition-colors text-sm">
              Try AI chat <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-navy-50 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-10">Common questions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-navy-100 p-6 hover:border-teal-200 transition-colors">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-navy-900 mb-1.5 text-sm">{q}</p>
                    <p className="text-xs text-navy-500 leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="rounded-3xl bg-teal-600 text-white p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative">
            <p className="text-xs font-bold text-teal-200 uppercase tracking-widest mb-3">get started today</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Your child's development matters.</h2>
            <p className="text-teal-100 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              Early screening takes 10 minutes and could make a meaningful difference in your child's life.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-2xl hover:bg-teal-50 transition-colors shadow-lg text-sm">
              Start free screening <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-navy-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-navy-900 text-sm">sprout</span>
          </Link>
          <div className="flex flex-wrap gap-5 text-xs text-navy-400 font-medium">
            <Link href="#screenings" className="hover:text-teal-600 transition-colors">Screenings</Link>
            <Link href="#how" className="hover:text-teal-600 transition-colors">How it works</Link>
            <Link href="/login" className="hover:text-teal-600 transition-colors">Sign in</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-5 pb-6">
          <p className="text-xs text-navy-300">For screening purposes only. Not a medical diagnosis. Always consult a qualified healthcare professional.</p>
        </div>
      </footer>
    </div>
  );
}
