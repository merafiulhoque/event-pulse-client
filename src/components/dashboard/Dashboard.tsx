'use client';

import { useEventStore } from '@/store/eventStore';
import { EVENTS } from '@/types';
import { Calendar, MapPin, Users, Clock, CalendarDays, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const events = useEventStore((state) => state.events);

  // Format date to Indian standard (DD/MM/YYYY, HH:MM AM/PM)
  const formatIndianDate = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  const formatIndianDateOnly = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  const formatIndianTime = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-2 pb-10 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Manage Events
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-pulse" />
            Here is a list of your ongoing and scheduled events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full backdrop-blur-sm flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            Total: {events?.length || 0}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {(!events || events.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/60 rounded-3xl p-16 text-center bg-slate-900/30 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-500 group">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full" />
            <Calendar className="w-16 h-16 text-slate-600 group-hover:text-indigo-400 transition-all duration-300 relative z-10" />
          </div>
          <h3 className="text-xl font-medium text-slate-300 mt-6">No events published yet</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Get started by creating your first event to manage bookings and capacity.
          </p>
          <button className="mt-6 px-6 py-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-500/20 transition-all">
            + Create Event
          </button>
        </div>
      ) : (
        /* Events Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event: EVENTS) => (
            <div 
              key={event.id}
              className="group relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/60 hover:border-indigo-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-indigo-500/5 hover:scale-[1.02] hover:translate-y-[-2px]"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Status indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 bg-slate-800/80 text-slate-400 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                  #{event.id}
                </span>
              </div>

              <div className="relative z-10">
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors pr-16 line-clamp-1">
                    {event.name}
                  </h3>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 bg-slate-800/30 rounded-xl px-3 py-2 border border-slate-800/50">
                  <MapPin className="w-4 h-4 text-indigo-400/70 shrink-0" />
                  <span className="truncate">{event.place}</span>
                </div>

                {/* Event Details Grid */}
                <div className="space-y-2.5 bg-slate-950/40 border border-slate-800/40 rounded-xl p-4">
                  {/* Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Event Date
                    </span>
                    <span className="text-slate-200 font-medium">
                      {formatIndianDateOnly(event.date)}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Event Time
                    </span>
                    <span className="text-slate-200 font-medium">
                      {formatIndianTime(event.date)}
                    </span>
                  </div>

                  {/* Booking Window */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/40">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      Booking Window
                    </span>
                    <span className="text-slate-300 text-[10px] font-medium">
                      {formatIndianDate(event.bookingStart)} - {formatIndianDate(event.bookingEnd)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {event.capacity} Seats
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600">
                    Created {formatIndianDateOnly(event.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}