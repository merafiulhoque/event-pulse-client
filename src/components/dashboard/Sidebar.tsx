'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarOptions } from '@/constants/SidebarOptions';

export default function Sidebar() {
  const pathname = usePathname();

  // Hide the bottom bar while a text field is focused so it doesn't ride above the mobile keyboard
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const textField =
      'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]),textarea,select';
    const onIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement)?.matches?.(textField)) setTyping(true);
    };
    const onOut = () => setTyping(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  return (
    <>
      {/* Desktop / tablet: fixed left sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 md:flex">
        {/* Brand: fixed h-16 so it lines up exactly with the Navbar */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30">
              E
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-white">EventPulse</span>
              <span className="text-[11px] text-slate-500">Organizer portal</span>
            </span>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
          {SidebarOptions.map((option) => {
            const Icon = option.icon;
            const isActive = pathname === option.href;

            return (
              <Link
                key={option.href}
                href={option.href}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                {option.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-800 p-4 text-center text-xs text-slate-600">
          EventPulse v1.0
        </div>
      </aside>

      {/* Mobile: bottom tab bar (same SidebarOptions list) */}
      <nav
        aria-label="Main navigation"
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/95 backdrop-blur transition-transform duration-200 md:hidden ${
          typing ? 'translate-y-full' : 'translate-y-0'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="mx-auto flex h-16 max-w-md items-stretch px-2">
          {SidebarOptions.map((option) => {
            const Icon = option.icon;
            const isActive = pathname === option.href;

            return (
              <li key={option.href} className="min-w-0 flex-1">
                <Link
                  href={option.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex h-full flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                    isActive ? 'text-indigo-300' : 'text-slate-500 active:text-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0 h-0.5 w-8 rounded-b-full bg-indigo-500 transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-400' : ''}`} />
                  <span className="w-full truncate text-center">{option.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}