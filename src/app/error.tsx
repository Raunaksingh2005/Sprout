'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-xl font-extrabold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          An unexpected error occurred. Your data is safe — please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset}
            className="inline-flex items-center gap-2 bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-900 transition-colors text-sm">
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link href="/dashboard"
            className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:border-gray-300 transition-colors text-sm">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
