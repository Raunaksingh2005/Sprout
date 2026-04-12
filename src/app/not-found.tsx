import Link from 'next/link';
import { Sprout } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 text-center">
      <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
        <Sprout className="w-7 h-7 text-white" />
      </div>
      <p className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest mb-2">404</p>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link href="/"
        className="inline-flex items-center gap-2 bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-900 transition-colors text-sm shadow-lg shadow-blue-200">
        Go home
      </Link>
    </div>
  );
}
