'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Loader from '../utility/Loader';
import { useEventStore } from '@/store/eventStore';
import { signout } from '@/actions/auth/signout';
import { showToast } from '../utility/ToastStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { clearUser, user } = useAuthStore();
  const { clearEvents } = useEventStore();
  const router = useRouter();

  // Helper to extract initials from name (e.g., "John Doe" -> "JD")
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Handle Sign Out
  const handleSignOut = async () => {
    const response = await signout();
    showToast({
      text: response.message,
      bgColor: response.success ? 'green' : 'red',
      duration: 2000,
    });
    clearUser();
    clearEvents(); // Wipes Zustand store and clears localStorage key
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000); // Hard reload to clear server-client state boundaries safely
  };

  if (!user) {
    return <Loader />;
  }

  const firstName = user.name?.split(' ')[0] ?? '';

  return (
    // h-16 + border-b matches the Sidebar brand row so the two borders form one line
    <header className="relative z-40 flex h-16 w-full shrink-0 items-center border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex w-full items-center justify-between">
        {/* Left: brand on mobile (sidebar is hidden), greeting from md up */}
        <Link href="/dashboard" className="flex items-center gap-2.5 md:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30">
            E
          </span>
          <span className="text-base font-bold tracking-tight text-white">EventPulse</span>
        </Link>
        <p className="hidden text-sm text-slate-400 md:block">
          Welcome back, <span className="font-semibold text-slate-100">{firstName}</span>
        </p>

        {/* Right: profile + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 py-1 pl-1 pr-1 sm:py-1.5 sm:pl-4 sm:pr-1.5 transition-colors hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
          >
            <div className="hidden flex-col text-right leading-tight sm:flex">
              <span className="text-xs font-semibold text-slate-200">{user.name}</span>
              <span className="text-[11px] text-slate-500">{user.email}</span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-600/30 text-sm font-semibold text-indigo-200">
              {getInitials(user.name)}
            </div>
          </button>

          {isOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-black/40 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="px-3 pb-3 pt-2">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-white">{user.name}</p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <button
                  role="menuitem"
                  onClick={handleSignOut}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}