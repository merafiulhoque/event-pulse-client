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

      <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 ml-64 h-full overflow-hidden">
          {user && <Navbar  />}
          <main className="flex-1 overflow-hidden p-6 bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}