'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Enhanced Atmospheric Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-10 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header / Top Nav */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            EventPulse
          </span>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-slate-300 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            Login
          </Link>
          <Link
            href="/create-account"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10 max-w-4xl mx-auto -mt-10">
        <div className="space-y-8">
          
          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Live Experiences & Bookings Reimagined
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Where Moments Become <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Unforgettable</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explore breathtaking ongoing events, sync with upcoming community schedules, and never miss out on what&apos;s happening right now.
          </p>

          {/* Dual Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA */}
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5"
            >
              View Ongoing Events
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Secondary CTA: Navigate to Upcoming Events */}
            <Link
              href="/upcoming-events"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800/80 hover:text-white hover:border-slate-700 transition-all shadow-sm"
            >
              Explore Upcoming Events
              <svg className="ml-2 w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>

        </div>
      </main>

      {/* Feature Micro-Grid Preview */}
      <div className="relative max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-4 z-10 w-full">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
          <div className="text-indigo-400 font-semibold text-sm mb-1">Instant Booking</div>
          <p className="text-xs text-slate-400">Secure your seats seamlessly during active booking windows.</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
          <div className="text-purple-400 font-semibold text-sm mb-1">Live Calendars</div>
          <p className="text-xs text-slate-400">Check opening windows and prepare for upcoming high-demand summits.</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
          <div className="text-pink-400 font-semibold text-sm mb-1">Organizer Portals</div>
          <p className="text-xs text-slate-400">Robust publishing controls designed for modern event creators.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative w-full py-6 text-center text-xs text-slate-600 border-t border-slate-900 z-10">
        &copy; {new Date().getFullYear()} EventPulse. All rights reserved.
      </footer>

    </div>
  );
}