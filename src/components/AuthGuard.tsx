'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sprout } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.replace('/login'); }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200 animate-pulse">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs text-navy-400 font-mono">loading...</span>
      </div>
    </div>
  );

  if (!user) return null;
  return <>{children}</>;
}
