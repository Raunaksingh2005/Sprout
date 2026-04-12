'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';

export default function VerifyEmailBanner() {
  const { user, sendVerificationEmail, refreshUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);

  // Don't show for Google users (auto-verified) or already verified
  if (!user || user.emailVerified || user.providerData[0]?.providerId === 'google.com') return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await sendVerificationEmail();
      setSent(true);
    } catch {
      // silently fail — Firebase rate limits resend
    } finally {
      setSending(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    try {
      await refreshUser();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-5 py-3">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-800 font-medium">
            Please verify your email address to save screenings.
            {sent && <span className="text-amber-600 font-bold"> Verification email sent!</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleCheck} disabled={checking}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            I've verified
          </button>
          <span className="text-amber-300">|</span>
          <button onClick={handleResend} disabled={sending || sent}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors disabled:opacity-50">
            {sending ? 'Sending...' : sent ? 'Sent ✓' : 'Resend email'}
          </button>
        </div>
      </div>
    </div>
  );
}
