'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { ArrowRight, Mail, Sprout, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err?.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : 'Failed to send reset email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-navy-50 flex flex-col">
      <header className="border-b border-navy-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-navy-900 text-lg tracking-tight">sprout</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm animate-fade-up">

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-100">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-navy-900 mb-2">Check your email</h1>
              <p className="text-sm text-navy-500 mb-2 leading-relaxed">
                We sent a password reset link to <strong className="text-navy-700">{email}</strong>.
              </p>
              <p className="text-xs text-navy-400 mb-8">
                Check your spam folder if you don't see it within a few minutes.
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-2 bg-teal-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm shadow-lg shadow-teal-200">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-navy-400 hover:text-navy-700 transition-colors mb-6">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </Link>
                <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-teal-200">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-navy-900 mb-1">Reset your password</h1>
                <p className="text-sm text-navy-500">Enter your email and we'll send you a reset link.</p>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-3xl border border-navy-100 shadow-card p-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-600 mb-1.5 uppercase tracking-wide">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-navy-50 border border-navy-200 rounded-xl pl-10 pr-4 py-3 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? 'Sending...' : <><span>Send reset link</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
