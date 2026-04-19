'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { ArrowRight, Mail, Sprout, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">sprout</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm animate-fade-up">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-blue-700" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Check your email</h1>
              <p className="text-sm text-gray-500 mb-2">We sent a reset link to <strong>{email}</strong>.</p>
              <p className="text-xs text-gray-400 mb-8">Check your spam folder if you don't see it.</p>
              <Link href="/login" className="inline-flex items-center gap-2 bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-900 transition-colors text-sm shadow-lg shadow-blue-200">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reset password</h1>
                <p className="text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-lg shadow-blue-200 text-sm disabled:opacity-50">
                    {submitting ? 'Sending...' : <><span>Send reset link</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                <Link href="/login" className="text-blue-700 hover:text-blue-900 font-bold">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
