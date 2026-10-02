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
      timeZone: 'Asia/Kolkata',
    });
  };

  const formatIndianDateOnly = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  };

  const formatIndianTime = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  const hasEvents = !!events && events.length > 0;

  return (
    <div className="flex flex-col gap-5 sm:gap-8">
      {/* Page header */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 sm:h-9 sm:w-9">
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </span>
            Manage events
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
            Your ongoing and scheduled events
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 sm:gap-2 sm:px-4 sm:py-2">
          <Users className="h-3.5 w-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Total events</span>
          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 font-semibold text-indigo-300">
            {events?.length || 0}
          </span>
        </span>
      </header>

      {!hasEvents ? (
        /* Empty state */
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center sm:p-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 sm:h-20 sm:w-20">
            <Calendar className="h-8 w-8 text-slate-500 sm:h-9 sm:w-9" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-200 sm:mt-6 sm:text-xl">No events published yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Get started by creating your first event to manage bookings and capacity.
          </p>
          <button className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 sm:w-auto sm:py-2.5">
            + Create Event
          </button>
        </div>
      ) : (
        /* Events grid: 1 column on mobile with compact cards */
        <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event: EVENTS) => (
            <article
              key={event.id}
              className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-indigo-500/40 hover:bg-slate-900 sm:p-5"
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <h3
                  title={event.name}
                  className="line-clamp-2 text-base font-semibold leading-snug text-white transition-colors group-hover:text-indigo-300 sm:line-clamp-1 sm:text-lg"
                >
                  {event.name}
                </h3>
                <span className="shrink-0 rounded-md border border-slate-700/60 bg-slate-800/70 px-2 py-0.5 font-mono text-[11px] text-slate-400">
                  #{event.id}
                </span>
              </div>

              {/* Location */}
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-400 sm:mt-3">
                <MapPin className="h-4 w-4 shrink-0 text-indigo-400/80" />
                <span className="truncate" title={event.place}>
                  {event.place}
                </span>
              </div>

              {/* Details: two tiles on mobile, divided rows from sm */}
              <dl className="mt-4 grid grid-cols-2 gap-2.5 text-xs sm:mt-5 sm:gap-0 sm:divide-y sm:divide-slate-800/80 sm:rounded-xl sm:border sm:border-slate-800 sm:bg-slate-950/50">
                <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:rounded-none sm:border-0 sm:bg-transparent sm:px-4 sm:py-2.5">
                  <dt className="flex items-center gap-1.5 text-slate-500 sm:gap-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Event date
                  </dt>
                  <dd className="font-medium text-slate-200">{formatIndianDateOnly(event.date)}</dd>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:rounded-none sm:border-0 sm:bg-transparent sm:px-4 sm:py-2.5">
                  <dt className="flex items-center gap-1.5 text-slate-500 sm:gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Event time
                  </dt>
                  <dd className="font-medium text-slate-200">{formatIndianTime(event.date)}</dd>
                </div>

                <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-4 sm:py-2.5">
                  <dt className="flex items-center gap-1.5 text-slate-500 sm:gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Booking window
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-slate-300 sm:pl-5.5">
                    {formatIndianDate(event.bookingStart)}
                    <span className="mx-1.5 text-slate-600">to</span>
                    {formatIndianDate(event.bookingEnd)}
                  </dd>
                </div>
              </dl>

              {/* Footer pinned to the bottom of the card */}
              <div className="mt-auto flex items-center justify-between gap-3 pt-4 sm:pt-5">
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {event.capacity} Seats
                </span>
                <span className="text-[11px] text-slate-500">
                  Created {formatIndianDateOnly(event.createdAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}