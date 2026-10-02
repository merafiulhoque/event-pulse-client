'use client';

import React, { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';
import { useAuthStore } from '@/store/authStore';
import { AuthInitializer } from '@/components/utility/AuthInitializer';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      {/* AuthInitializer runs here only for dashboard routes */}
      {/* <AuthInitializer /> */}

      <div className="flex h-dvh w-full overflow-hidden bg-slate-950 text-slate-100">
        {/* Left sidebar on md+, bottom tab bar below md */}
        <Sidebar />

        {/* md:ml-64 matches the fixed sidebar width; no margin on mobile */}
        <div className="flex h-full min-w-0 flex-1 flex-col md:ml-64">
          {user && <Navbar />}

          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-950">
            {/* Extra bottom padding on mobile so content clears the bottom tab bar (h-16 + safe area) */}
            <div className="mx-auto w-full max-w-7xl p-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:p-6 sm:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}