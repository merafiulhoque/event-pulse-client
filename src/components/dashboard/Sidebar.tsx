'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarOptions } from '@/constants/SidebarOptions';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-950 border-r border-slate-800 text-slate-100 flex flex-col z-30">
      
      {/* Sidebar Header / Brand space */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-sm font-semibold tracking-wider uppercase text-slate-400">
          Organizer Portal
        </span>
      </div>

      {/* Dynamic Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 flex flex-col">
        {SidebarOptions.map((option) => {
          const Icon = option.icon;
          const isActive = pathname === option.href;

          return (
            <Link
              key={option.href}
              href={option.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {option.label}
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-600 text-center">
        EventPulse v1.0
      </div>

    </aside>
  );
}