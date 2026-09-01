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
  const {clearEvents} = useEventStore()
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

  // Handle Sign Out
  const handleSignOut = async () => {
    const response = await signout()
    showToast({
      text: response.message,
      bgColor: response.success ? "green" : "red",
      duration: 2000
    })
    clearUser();  
    clearEvents();                 // Wipes Zustand store and clears localStorage key
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000); // Hard reload to clear server-client state boundaries safely
  };

  // If user data isn't loaded yet, return a minimal navbar shell to prevent crashes
  if (!user) {
    return <Loader />
  }

  return (
    <nav className="relative w-full bg-slate-950 border-b border-slate-800 text-slate-100 px-6 py-4 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side: Brand Name */}
        <Link 
          href="/dashboard" 
          className="text-xl font-bold tracking-tight bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        >
          EventPulse
        </Link>

        {/* Right Side: User Profile & Dropdown Toggle */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-3 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full shadow-sm transition-all focus:outline-none"
          >
            {/* Email and Name Details (Desktop) */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400">
                {user.email}
              </span>
            </div>

            {/* Rounded Avatar / Initials Circle */}
            <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-semibold text-sm shadow-inner">
              {getInitials(user.name)}
            </div>
          </button>

          {/* Profile Dropdown Modal */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* User Details Header inside Modal */}
              <div className="border-b border-slate-800 pb-3 mb-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Signed in as</p>
                <p className="text-sm font-semibold text-white truncate mt-0.5">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}