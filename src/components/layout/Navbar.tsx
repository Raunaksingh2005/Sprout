'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, MessageSquare, FileText, LogOut, ChevronDown, Menu, X, Sprout } from 'lucide-react';
import VerifyEmailBanner from '@/components/VerifyEmailBanner';

const navLinks = [
  { href: '/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/screening/new', label: 'New Screening', icon: FileText },
  { href: '/chat',          label: 'AI Chat',       icon: MessageSquare },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? 'U';

  return (
    <>
      <nav className="border-b border-navy-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-navy-900 text-lg tracking-tight">sprout</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname === href
                    ? 'text-teal-700 bg-teal-50 border border-teal-100'
                    : 'text-navy-500 hover:text-navy-900 hover:bg-navy-50'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-navy-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-white">{initials}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-navy-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-navy-100 rounded-2xl shadow-soft py-1 animate-fade-in">
                  <div className="px-4 py-3 border-b border-navy-100">
                    <p className="text-sm font-semibold text-navy-900 truncate">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-navy-400 truncate">{user?.email}</p>
                  </div>
                  <button onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1.5 rounded-xl hover:bg-navy-50 text-navy-500">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-navy-100 px-5 py-3 space-y-1 animate-fade-in">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === href ? 'text-teal-700 bg-teal-50' : 'text-navy-500 hover:text-navy-900 hover:bg-navy-50'
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
      <VerifyEmailBanner />
    </>
  );
}
