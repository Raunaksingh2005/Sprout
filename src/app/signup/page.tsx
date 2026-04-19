'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Mail, Lock, User, Sprout, CheckCircle } from 'lucide-react';

const inputClass = "w-full bg-navy-50 border border-navy-200 rounded-xl pl-10 pr-4 py-3 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 focus:bg-white transition-all";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, signUp, signInWithGoogle, sendVerificationEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => { if (!loading && user) router.replace('/dashboard'); }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setSubmitting(true);
    try { await signUp(email, password, name); setVerified(true); }
    catch (err: any) {
      setError(err?.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' : 'Failed to create account. Please try again.');
    } finally { setSubmitting(false); }
  };

  const handleGoogle = async () => {
    setError('');
    try { await signInWithGoogle(); router.push('/dashboard'); }
    catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') return;
      setError('Google sign-in failed. Please try again.');
    }
  };

  if (loading) return null;

  if (verified) return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-navy-50 flex flex-col">
      <header className="border-b border-navy-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm"><Sprout className="w-4 h-4 text-white" /></div>
            <span className="font-extrabold text-navy-900 text-lg tracking-tight">sprout</span>
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm text-center animate-fade-up">
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900 mb-2">Check your email</h1>
          <p className="text-sm text-navy-500 mb-2 leading-relaxed">We sent a verification link to <strong>{email}</strong>.</p>
          <p className="text-sm text-navy-500 mb-4 leading-relaxed">Click the link to verify your account, then sign in.</p>
          <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 text-left">
            📬 <strong>Can't find it?</strong> Check your <strong>spam or junk folder</strong> — verification emails sometimes land there.
          </div>
          <Link href="/login" className="inline-flex items-center gap-2 bg-teal-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm shadow-lg shadow-teal-200">
            <CheckCircle className="w-4 h-4" /> Go to sign in
          </Link>
          <p className="text-xs text-navy-400 mt-5">
            Didn't receive it?{' '}
            <button onClick={() => sendVerificationEmail()} className="text-teal-600 hover:underline font-medium">Resend</button>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-navy-50 flex flex-col">
      <header className="border-b border-navy-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm"><Sprout className="w-4 h-4 text-white" /></div>
            <span className="font-extrabold text-navy-900 text-lg tracking-tight">sprout</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy-900 mb-1">Create an account</h1>
            <p className="text-sm text-navy-500">Free · Takes 30 seconds.</p>
          </div>

          {error && <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">{error}</div>}

          <div className="bg-white rounded-3xl border border-navy-100 shadow-card p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full name', type: 'text', val: name, set: setName, icon: User, ph: 'Jane Doe' },
                { label: 'Email', type: 'email', val: email, set: setEmail, icon: Mail, ph: 'you@example.com' },
                { label: 'Password', type: 'password', val: password, set: setPassword, icon: Lock, ph: 'Min. 6 characters' },
                { label: 'Confirm password', type: 'password', val: confirm, set: setConfirm, icon: Lock, ph: '••••••••' },
              ].map(({ label, type, val, set, icon: Icon, ph }) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-navy-600 mb-1.5 uppercase tracking-wide">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <input type={type} required value={val} onChange={e => set(e.target.value)} placeholder={ph} className={inputClass} />
                  </div>
                </div>
              ))}
              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 text-sm disabled:opacity-50 mt-2">
                {submitting ? 'Creating account...' : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy-100" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-navy-400 font-medium">or continue with</span></div>
            </div>

            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2.5 bg-white border-2 border-navy-200 text-navy-700 py-3 rounded-xl hover:bg-navy-50 hover:border-navy-300 transition-colors text-sm font-semibold">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          <p className="text-center text-sm text-navy-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-600 hover:text-teal-800 font-bold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
