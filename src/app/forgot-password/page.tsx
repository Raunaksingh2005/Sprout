'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Mail, KeyRound, Sprout, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-[16px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white transition-all";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to reset password. Please check the email and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-brand-50" />
            </div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">sprout</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-brand-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-200">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">Reset password</h1>
            <p className="text-sm font-medium text-gray-500">We'll send you a link to get back into your account.</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-semibold animate-fade-in">
              {error}
            </div>
          )}

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-[15px] text-gray-500 font-medium leading-relaxed mb-6">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
              <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-brand-900 text-white font-bold py-3.5 rounded-xl hover:bg-brand-800 transition-colors shadow-lg shadow-brand-200 text-[15px]">
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Account Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-brand-900 text-white font-bold py-3.5 rounded-xl hover:bg-brand-800 transition-colors shadow-lg shadow-brand-200 text-[15px] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending link...' : <><span>Send reset link</span><ArrowRight className="w-4 h-4" /></>}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/login" className="text-[15px] text-gray-500 hover:text-brand-900 font-bold transition-colors">
                  Nevermind, I remember it
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
