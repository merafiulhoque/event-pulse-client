'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // <-- 1. Import useRouter
import { useEventStore } from '@/store/eventStore';
import { getUpcomingEventDetails } from '@/actions/events/getUpcomingEventDetails';
import { ApiResponse, EVENTS } from '@/types';
import { showToast } from '@/components/utility/ToastStore';
import Loader from '@/components/utility/Loader';
import { Calendar, MapPin, Users, Clock, CalendarDays, Sparkles, Ticket, AlertCircle, CheckCircle, XCircle, RefreshCw, Search, X } from 'lucide-react';

export default function UpcomingEvents() {
  const router = useRouter(); // <-- 2. Initialize router
  const { events, setEvents } = useEventStore();
  const [hasFetched, setHasFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Measure header height so the scroll container can be padded to sit
  // exactly below it — the header itself never moves or resizes with scroll.
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  // TanStack Query Mutation for fetching upcoming event details
  const fetchMutation = useMutation({
    mutationFn: getUpcomingEventDetails,
    onSuccess: (response: ApiResponse<EVENTS[] | null>) => {
      if (response.success && response.data) {
        setEvents(response.data);
        setHasFetched(true);
        showToast({ text: response.message, bgColor: "green" });
      } else {
        showToast({ text: response.message || "Failed to fetch events", bgColor: "red" });
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : "Network error occurred",
        bgColor: "red",
      });
    },
  });

  // Helper to determine booking window status based on current time
  const getBookingStatus = (bookingStart: Date | string, bookingEnd: Date | string) => {
    const now = new Date().getTime();
    const startTime = new Date(bookingStart).getTime();
    const endTime = new Date(bookingEnd).getTime();

    if (now < startTime) {
      return {
        status: 'upcoming',
        text: `Opens ${formatIndianDate(bookingStart)}`,
        badgeClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        badgeIcon: Clock,
        buttonClass: 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-700/50',
        buttonText: 'Booking Not Open',
        disabled: true,
      };
    } else if (now >= startTime && now <= endTime) {
      return {
        status: 'active',
        text: `Closes ${formatIndianDate(bookingEnd)}`,
        badgeClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        badgeIcon: CheckCircle,
        buttonClass: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 cursor-pointer border border-indigo-400/20',
        buttonText: '🎫 Book Ticket',
        disabled: false,
      };
    } else {
      return {
        status: 'closed',
        text: 'Booking window closed',
        badgeClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        badgeIcon: XCircle,
        buttonClass: 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-700/50',
        buttonText: 'Booking Closed',
        disabled: true,
      };
    }
  };

  // Filter events by name or place against the search query
  const filteredEvents = useMemo(() => {
    if (!events) return events;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return events;
    return events.filter((event: EVENTS) =>
      event.name?.toLowerCase().includes(q) || event.place?.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-950/50">

      {/* Fixed Header */}
      <div
        ref={headerRef}
        className="absolute top-0 left-0 right-0 z-30 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-slate-900/95 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl shadow-xl shadow-black/40">

          <div className="shrink-0">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Upcoming Events
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2 whitespace-nowrap">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-pulse" />
              Live schedules & booking windows
            </p>
          </div>

          <div className="flex-1 flex justify-center px-0 lg:px-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name or place"
                className="w-full bg-slate-800/40 border border-slate-700/60 focus:border-indigo-500/50 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => fetchMutation.mutate()}
            disabled={fetchMutation.isPending}
            className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {fetchMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Fetching Details...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Fetch Upcoming Events
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        className="h-full overflow-y-auto pr-2 pb-12"
        style={{ paddingTop: headerHeight ? headerHeight + 24 : 140 }}
      >
        <div className="max-w-7xl mx-auto w-full">

          {!hasFetched && (!events || events.length === 0) && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800/60 rounded-3xl p-16 text-center bg-slate-900/30 backdrop-blur-sm min-h-[50vh]">
              <Calendar className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-medium text-slate-300">Ready to Sync</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Click the <span className="text-indigo-400 font-medium">"Fetch Upcoming Events"</span> button above to load active schedules.
              </p>
            </div>
          )}

          {hasFetched && (!events || events.length === 0) && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800/60 rounded-3xl p-16 text-center bg-slate-900/30 backdrop-blur-sm min-h-[50vh]">
              <AlertCircle className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-medium text-slate-300">No Upcoming Events Found</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">There are currently no events configured in the system.</p>
            </div>
          )}

          {filteredEvents && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event: EVENTS) => {
                const bookingState = getBookingStatus(event.bookingStart, event.bookingEnd);
                const BadgeIcon = bookingState.badgeIcon;

                return (
                  <div
                    key={event.id}
                    className="group relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/60 hover:border-indigo-500/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium border px-2.5 py-1 rounded-full ${bookingState.badgeClass}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {bookingState.text}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors pr-32 line-clamp-1 mb-4">
                        {event.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 bg-slate-800/30 rounded-xl px-3 py-2 border border-slate-800/50">
                        <MapPin className="w-4 h-4 text-indigo-400/70 shrink-0" />
                        <span className="truncate">{event.place}</span>
                      </div>

                      <div className="space-y-2.5 bg-slate-950/40 border border-slate-800/40 rounded-xl p-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5" />
                            Event Date
                          </span>
                          <span className="text-slate-200 font-medium">{formatIndianDateOnly(event.date)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            Event Time
                          </span>
                          <span className="text-slate-200 font-medium">{formatIndianTime(event.date)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/40">
                          <span className="text-slate-500 flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" />
                            Capacity
                          </span>
                          <span className="text-emerald-400 font-medium">{event.capacity} Seats</span>
                        </div>
                      </div>

                      <div className="mt-3 text-[10px] text-slate-500 flex items-center justify-between bg-slate-800/20 rounded-lg px-3 py-1.5 border border-slate-800/30">
                        <span className="flex items-center gap-1.5">
                          <Ticket className="w-3 h-3" />
                          Booking Window
                        </span>
                        <span className="text-slate-400">
                          {formatIndianDate(event.bookingStart)} - {formatIndianDate(event.bookingEnd)}
                        </span>
                      </div>

                      {/* 3. Action Button with Router Push Handler */}
                      <div className="mt-4">
                        <button
                          disabled={bookingState.disabled}
                          onClick={() => {
                            if (!bookingState.disabled) {
                              router.push(`/booking/availability?id=${event.id}`);
                            }
                          }}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-300 ${bookingState.buttonClass}`}
                        >
                          {bookingState.buttonText}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}