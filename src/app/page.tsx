'use client';

import Link from 'next/link';
import { ArrowRight, Brain, Zap, BookOpen, MessageSquare, ClipboardList, Shield, ChevronRight, Clock, CheckCircle, Sprout } from 'lucide-react';

const screenings = [
  {
    icon: Brain,
    label: 'Autism (ASD)',
    age: 'Ages 16–48 months',
    questions: '20 questions',
    tool: 'M-CHAT-R/F',
    color: 'bg-indigo-50 border-indigo-100',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    tag: 'bg-indigo-100 text-indigo-700',
  },
  {
    icon: Zap,
    label: 'ADHD',
    age: 'Ages 4–12 years',
    questions: '18 questions',
    tool: 'Vanderbilt Scale',
    color: 'bg-pink-50 border-pink-100',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    tag: 'bg-pink-100 text-pink-700',
  },
  {
    icon: BookOpen,
    label: 'Dyslexia',
    age: 'Ages 5–12 years',
    questions: '15 questions',
    tool: 'BDA Checklist',
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    tag: 'bg-amber-100 text-amber-700',
  },
];

const faqs = [
  { q: 'Is Sprout a medical diagnosis?', a: 'No. Sprout is a screening tool only. It helps identify children who may benefit from a professional evaluation. Always consult a qualified healthcare professional for a diagnosis.' },
  { q: 'What age ranges are supported?', a: 'Autism screening (M-CHAT-R/F) is for ages 16–48 months. ADHD and Dyslexia screenings are for ages 4–12 years.' },
  { q: 'Is my data private?', a: 'Yes. All data is encrypted and stored securely via Firebase. We never sell or share your personal information.' },
  { q: 'Can I screen for multiple conditions?', a: 'Yes — you can run separate screenings for autism, ADHD, and dyslexia. Each generates its own AI-powered report.' },
  { q: 'What happens after a high-risk result?', a: 'A high score means we recommend speaking with your pediatrician or a developmental specialist. Our AI assistant can help you prepare for that conversation.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">sprout</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm font-semibold bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-sm">
              Get started →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-5 pt-16 pb-20">
          <div className="animate-fade-up max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700 animate-pulse" />
              Free · Clinically validated · AI-powered
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight text-gray-900 mb-5">
              Early screening for<br />
              <span className="text-blue-700">ASD, ADHD</span><br />
              <span className="text-blue-700">&amp; Dyslexia.</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg leading-relaxed mb-8">
              Sprout helps parents identify early signs of autism, ADHD, and dyslexia in children
              using clinically validated questionnaires and AI-generated insights — in under 10 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-blue-900 transition-colors shadow-lg shadow-blue-200 text-sm">
                Start free screening <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#screenings" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border-2 border-gray-200 px-7 py-3.5 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-colors">
                See what we screen
              </Link>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-8">
            {[
              { val: '3', label: 'Screening types', color: 'text-blue-700' },
              { val: '< 10 min', label: 'Per screening', color: 'text-blue-600' },
              { val: '100%', label: 'Free to use', color: 'text-blue-500' },
            ].map(({ val, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <p className={`text-2xl font-extrabold font-mono ${color}`}>{val}</p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenings */}
      <section id="screenings" className="max-w-5xl mx-auto px-5 py-16">
        <p className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest mb-3">What we screen</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Three screenings, one platform</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mb-10">
          Each screening uses a clinically validated tool, takes under 10 minutes, and generates an AI-powered report with personalised next steps.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {screenings.map(({ icon: Icon, label, age, questions, tool, color, iconBg, iconColor, tag }) => (
            <div key={label} className={`p-6 rounded-2xl border ${color}`}>
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
              <p className="text-xs text-gray-500 mb-3">{age} · {questions}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tag}`}>{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest mb-3">The process</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">How Sprout works</h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { num: '01', title: 'Create a free account', desc: 'Sign up in seconds. No credit card needed.' },
              { num: '02', title: 'Choose a screening type', desc: 'Autism, ADHD, or Dyslexia — or run all three.' },
              { num: '03', title: 'Answer the questions', desc: 'Simple questions about your child. Takes ~10 minutes.' },
              { num: '04', title: 'Get your AI report', desc: 'Instant risk result + AI-generated personalised summary + downloadable PDF.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4 items-start p-5 rounded-2xl border border-gray-200 bg-white hover:border-blue-100 hover:shadow-sm transition-all">
                <span className="font-mono text-3xl font-black text-gray-100 flex-shrink-0 leading-none">{num}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: ClipboardList, label: 'Validated tools', desc: 'M-CHAT-R/F, Vanderbilt Scale, BDA Checklist', bg: 'bg-blue-700' },
              { icon: MessageSquare, label: 'AI assistant', desc: 'Ask follow-up questions about any result', bg: 'bg-indigo-600' },
              { icon: Shield, label: 'Private & secure', desc: 'Firebase-backed, encrypted, never shared', bg: 'bg-pink-500' },
            ].map(({ icon: Icon, label, desc, bg }) => (
              <div key={label} className="p-5 rounded-2xl bg-gray-900 text-white">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="font-bold mb-1">{label}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat feature */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex-1">
            <p className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest mb-3">AI Assistant</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Ask anything, anytime</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Our AI assistant is trained on child development, autism, ADHD, and dyslexia. Ask about early signs, what a score means, how to talk to your pediatrician, or what to do next.
            </p>
            <div className="space-y-2">
              {[
                'What are early signs of ADHD in a 5-year-old?',
                'My child scored medium risk — what should I do?',
                'How do I explain dyslexia to my child\'s teacher?',
              ].map(q => (
                <div key={q} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-700 font-bold mt-0.5">→</span>
                  <span className="italic">"{q}"</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sm:flex-shrink-0">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm">
              Try AI chat <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">Common questions</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div key={q} className="p-5 rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900 mb-1.5">{q}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="rounded-3xl bg-blue-700 text-white p-10 sm:p-14 text-center shadow-2xl shadow-blue-200">
          <p className="text-xs font-mono font-bold text-blue-200 uppercase tracking-widest mb-3">get started today</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Your child's development matters.</h2>
          <p className="text-blue-100 mb-8 max-w-sm mx-auto leading-relaxed text-sm">
            Early screening takes 10 minutes and could make a meaningful difference in your child's life.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm">
            Start free screening <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center">
                <Sprout className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm">sprout</span>
            </Link>
            <div className="flex flex-wrap gap-5 text-xs text-gray-500 font-medium">
              <Link href="#screenings" className="hover:text-gray-900 transition-colors">Screenings</Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">How it works</Link>
              <Link href="/login" className="hover:text-gray-900 transition-colors">Sign in</Link>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-5">
            For screening purposes only. Not a medical diagnosis. Always consult a qualified healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
