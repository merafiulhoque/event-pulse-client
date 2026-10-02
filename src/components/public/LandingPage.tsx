'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock, MapPin, Ticket, CalendarClock, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: Ticket,
    title: 'Instant booking',
    text: 'Secure your seats seamlessly during active booking windows.',
  },
  {
    icon: CalendarClock,
    title: 'Live calendars',
    text: 'Check opening windows and prepare for upcoming high-demand summits.',
  },
  {
    icon: LayoutDashboard,
    title: 'Organizer portal',
    text: 'Robust publishing controls designed for modern event creators.',
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Single soft glow behind the hero */}
      <div className="pointer-events-none absolute left-1/2 top-[-12%] z-0 h-[360px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

      {/* Header */}
      <header className="relative z-20 border-b border-slate-900">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/30">
              E
            </span>
            <span className="text-lg font-bold tracking-tight text-white">EventPulse</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
            >
              Login
            </Link>
            <Link
              href="/create-account"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-md shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Live experiences and bookings, reimagined
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Where moments become unforgettable
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
            Explore breathtaking ongoing events, sync with upcoming community schedules, and never miss out on
            what&apos;s happening right now.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
            >
              View ongoing events
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/upcoming-events"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-7 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
            >
              <CalendarDays className="h-4 w-4 text-indigo-400" />
              Explore upcoming events
            </Link>
          </div>
        </div>

        {/* Sample event card: shows what an event looks like on EventPulse */}
        
      </main>

      {/* Features */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                <Icon className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} EventPulse. All rights reserved.
      </footer>
    </div>
  );
}