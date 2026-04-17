'use client';

import Link from 'next/link';
import { ArrowRight, Brain, Zap, BookOpen, MessageSquare, ClipboardList, Shield, ChevronRight, Clock, CheckCircle, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-brand-50" />
            </div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">sprout</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-brand-900 transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm font-bold bg-brand-900 text-white px-5 py-2.5 rounded-xl hover:bg-brand-800 transition-colors shadow-sm">
              Get started →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white overflow-hidden relative border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        <div className="max-w-5xl mx-auto px-5 pt-20 pb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-900 text-xs font-bold uppercase tracking-wide mb-6 border border-brand-100">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
              Free · Clinically validated · AI-powered
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight text-gray-900 mb-6">
              Early screening for<br />
              <span className="text-brand-600">ASD, ADHD</span><br />
              <span className="text-brand-600">&amp; Dyslexia.</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg leading-relaxed mb-8 font-medium">
              Sprout helps parents identify early signs of autism, ADHD, and dyslexia in children
              using clinically validated questionnaires and AI-generated insights — in under 10 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-brand-900 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-brand-800 transition-colors shadow-premium text-sm">
                Start free screening <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#screenings" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-7 py-3.5 rounded-xl hover:border-gray-300 hover:bg-white transition-colors">
                See what we screen
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="mt-16 flex flex-wrap gap-8"
          >
            {[
              { val: '3', label: 'Screening types', color: 'text-brand-900' },
              { val: '< 10 min', label: 'Per screening', color: 'text-brand-800' },
              { val: '100%', label: 'Free to use', color: 'text-brand-700' },
            ].map(({ val, label, color }) => (
              <motion.div key={label} variants={fadeUpItem} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className={`text-2xl font-extrabold font-mono ${color}`}>{val}</p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="screenings" className="max-w-5xl mx-auto px-5 py-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest mb-3">What we screen</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Three screenings, one platform</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mb-10">
            Each screening uses a clinically validated tool, takes under 10 minutes, and generates an AI-powered report with personalised next steps.
          </p>

        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-3 gap-4"
        >
          {screenings.map(({ icon: Icon, label, age, questions, tool, color, iconBg, iconColor, tag }) => (
            <motion.div variants={fadeUpItem} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} key={label} className={`p-6 rounded-2xl border ${color} shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
              <p className="text-xs text-gray-500 mb-3">{age} · {questions}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tag}`}>{tool}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-gray-50/50 py-20 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-5">
          <p className="text-xs font-mono font-bold text-brand-600 uppercase tracking-widest mb-3">The process</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">How Sprout works</h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-5 mb-12"
          >
            {[
              { num: '01', title: 'Create a free account', desc: 'Sign up in seconds. No credit card needed.' },
              { num: '02', title: 'Choose a screening type', desc: 'Autism, ADHD, or Dyslexia — or run all three.' },
              { num: '03', title: 'Answer the questions', desc: 'Simple questions about your child. Takes ~10 minutes.' },
              { num: '04', title: 'Get your AI report', desc: 'Instant risk result + AI-generated personalised summary + downloadable PDF.' },
            ].map(({ num, title, desc }) => (
              <motion.div variants={fadeUpItem} key={num} className="flex gap-4 items-start p-6 rounded-2xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-premium transition-all group cursor-default">
                <span className="font-mono text-3xl font-extrabold text-gray-100 group-hover:text-brand-100 transition-colors flex-shrink-0 leading-none mt-1">{num}</span>
                <div>
                  <h3 className="font-extrabold text-gray-900 mb-1 group-hover:text-brand-900 transition-colors">{title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: ClipboardList, label: 'Validated tools', desc: 'M-CHAT-R/F, Vanderbilt Scale, BDA Checklist', bg: 'bg-brand-800' },
              { icon: MessageSquare, label: 'AI assistant', desc: 'Ask follow-up questions about any result', bg: 'bg-indigo-600' },
              { icon: Shield, label: 'Private & secure', desc: 'Encrypted, never shared', bg: 'bg-pink-600' },
            ].map(({ icon: Icon, label, desc, bg }) => (
              <div key={label} className="p-6 rounded-2xl bg-gray-900 text-white shadow-premium">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold mb-1 text-lg">{label}</p>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{desc}</p>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="sm:flex-shrink-0"
          >
            <Link href="/signup" className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-700 hover:scale-105 transition-all text-sm shadow-xl shadow-gray-200">
              Try AI chat <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
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
      <section className="max-w-4xl mx-auto px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="rounded-3xl bg-brand-900 text-white p-12 sm:p-16 text-center shadow-premium"
        >
          <p className="text-sm font-bold text-brand-200 uppercase tracking-widest mb-4">get started today</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">Your child's development matters.</h2>
          <p className="text-brand-100 mb-10 max-w-md mx-auto leading-relaxed text-base font-medium">
            Early screening takes 10 minutes and could make a meaningful difference in your child's life.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-brand-900 font-extrabold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg text-sm">
              Start free screening <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
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
