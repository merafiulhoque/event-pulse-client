'use client';

import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEventStore } from '@/store/eventStore';
import { getUpcomingEventDetails } from '@/actions/events/getUpcomingEventDetails';
import { ApiResponse, EVENTS } from '@/types';
import { showToast } from '@/components/utility/ToastStore';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CalendarDays,
  Sparkles,
  Ticket,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  X,
  Loader2,
} from 'lucide-react';

type BookingStatus = 'active' | 'upcoming' | 'closed';

// Order here is the order the sections appear on the page
const GROUPS: { key: BookingStatus; title: string; description: string; dot: string }[] = [
  { key: 'active', title: 'Booking started', description: 'Tickets can be booked for these events right now.', dot: 'bg-emerald-400' },
  { key: 'upcoming', title: 'Booking not started', description: 'Booking opens soon for these events.', dot: 'bg-amber-400' },
  { key: 'closed', title: 'Booking closed', description: 'The booking window for these events has ended.', dot: 'bg-rose-400' },
];

export default function UpcomingEvents() {
  const router = useRouter();
  const { events, setEvents } = useEventStore();
  const [hasFetched, setHasFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  // TanStack Query Mutation for fetching upcoming event details
  const fetchMutation = useMutation({
    mutationFn: getUpcomingEventDetails,
    onSuccess: (response: ApiResponse<EVENTS[] | null>) => {
      if (response.success && response.data) {
        setEvents(response.data);
        setHasFetched(true);
        showToast({ text: response.message, bgColor: 'green' });
      } else {
        showToast({ text: response.message || 'Failed to fetch events', bgColor: 'red' });
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : 'Network error occurred',
        bgColor: 'red',
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
        status: 'upcoming' as BookingStatus,
        text: `Opens ${formatIndianDate(bookingStart)}`,
        badgeClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        badgeIcon: Clock,
        buttonClass: 'cursor-not-allowed border border-slate-700/60 bg-slate-800/60 text-slate-500',
        buttonText: 'Booking not open',
        disabled: true,
      };
    } else if (now >= startTime && now <= endTime) {
      return {
        status: 'active' as BookingStatus,
        text: `Closes ${formatIndianDate(bookingEnd)}`,
        badgeClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        badgeIcon: CheckCircle,
        buttonClass:
          'cursor-pointer bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60',
        buttonText: 'Book ticket',
        disabled: false,
      };
    } else {
      return {
        status: 'closed' as BookingStatus,
        text: 'Booking window closed',
        badgeClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        badgeIcon: XCircle,
        buttonClass: 'cursor-not-allowed border border-slate-700/60 bg-slate-800/60 text-slate-500',
        buttonText: 'Booking closed',
        disabled: true,
      };
    }
  };

  // Filter by name or place
  const filteredEvents = useMemo(() => {
    if (!events) return events;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (event: EVENTS) => event.name?.toLowerCase().includes(q) || event.place?.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  // Split the filtered events into started / not started / closed sections
  const grouped = useMemo(() => {
    const buckets: Record<BookingStatus, EVENTS[]> = { active: [], upcoming: [], closed: [] };
    (filteredEvents ?? []).forEach((event: EVENTS) => {
      buckets[getBookingStatus(event.bookingStart, event.bookingEnd).status].push(event);
    });

    const t = (d: Date | string) => new Date(d).getTime();
    buckets.active.sort((a, b) => t(a.bookingEnd) - t(b.bookingEnd)); // closing soonest first
    buckets.upcoming.sort((a, b) => t(a.bookingStart) - t(b.bookingStart)); // opening soonest first
    buckets.closed.sort((a, b) => t(b.bookingEnd) - t(a.bookingEnd)); // most recently closed first
    return buckets;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEvents]);

  const hasEvents = !!events && events.length > 0;
  const noMatches = hasEvents && (filteredEvents?.length ?? 0) === 0;

  const renderCard = (event: EVENTS) => {
    const bookingState = getBookingStatus(event.bookingStart, event.bookingEnd);
    const BadgeIcon = bookingState.badgeIcon;

    return (
      <article
        key={event.id}
        className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-indigo-500/40 hover:bg-slate-900"
      >
        {/* Status badge */}
        <span
          className={`inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${bookingState.badgeClass}`}
        >
          <BadgeIcon className="h-3 w-3 shrink-0" />
          <span className="truncate">{bookingState.text}</span>
        </span>

        <h3
          title={event.name}
          className="mt-3 line-clamp-1 text-lg font-semibold text-white transition-colors group-hover:text-indigo-300"
        >
          {event.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="h-4 w-4 shrink-0 text-indigo-400/80" />
          <span className="truncate" title={event.place}>
            {event.place}
          </span>
        </div>

        <dl className="mt-4 divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950/50 text-xs">
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="flex items-center gap-2 text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              Event date
            </dt>
            <dd className="font-medium text-slate-200">{formatIndianDateOnly(event.date)}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="flex items-center gap-2 text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              Event time
            </dt>
            <dd className="font-medium text-slate-200">{formatIndianTime(event.date)}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="flex items-center gap-2 text-slate-500">
              <Users className="h-3.5 w-3.5" />
              Capacity
            </dt>
            <dd className="font-medium text-emerald-400">{event.capacity} Seats</dd>
          </div>
          <div className="px-4 py-2.5">
            <dt className="flex items-center gap-2 text-slate-500">
              <Ticket className="h-3.5 w-3.5" />
              Booking window
            </dt>
            <dd className="mt-1.5 pl-5.5 leading-relaxed text-slate-300">
              {formatIndianDate(event.bookingStart)}
              <span className="mx-1.5 text-slate-600">to</span>
              {formatIndianDate(event.bookingEnd)}
            </dd>
          </div>
        </dl>

        {/* Pinned to the bottom so buttons line up across a row */}
        <button
          disabled={bookingState.disabled}
          onClick={() => {
            if (!bookingState.disabled) {
              router.push(`/booking/availability?id=${event.id}`);
            }
          }}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors sm:py-2.5 ${bookingState.buttonClass}`}
        >
          {!bookingState.disabled && <Ticket className="h-4 w-4" />}
          {bookingState.buttonText}
        </button>
      </article>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Toolbar: stays visible while the page scrolls */}
      <div className="sticky top-0 z-30 -mx-1 px-1 pb-1 pt-1">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl shadow-black/30 backdrop-blur sm:p-5 lg:flex-row lg:items-center">
          <div className="shrink-0">
            <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                <Sparkles className="h-4 w-4 text-indigo-400" />
              </span>
              Upcoming events
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">Live schedules and booking windows</p>
          </div>

          <div className="flex flex-1 justify-center lg:px-4">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name or place"
                aria-label="Search events by name or place"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 py-3 pl-10 pr-9 text-base text-slate-200 outline-none transition-colors placeholder:text-slate-500 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 sm:py-2.5 sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => fetchMutation.mutate()}
            disabled={fetchMutation.isPending}
            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5"
          >
            {fetchMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching details...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Fetch upcoming events
              </>
            )}
          </button>
        </div>
      </div>

      {/* Empty: nothing fetched yet */}
      {!hasFetched && !hasEvents && (
        <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center sm:p-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <Calendar className="h-9 w-9 text-slate-500" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-slate-200">Ready to sync</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Click <span className="font-medium text-indigo-400">Fetch upcoming events</span> above to load active schedules.
          </p>
        </div>
      )}

      {/* Empty: fetched, but the system has none */}
      {hasFetched && !hasEvents && (
        <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center sm:p-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <AlertCircle className="h-9 w-9 text-slate-500" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-slate-200">No upcoming events found</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">There are currently no events configured in the system.</p>
        </div>
      )}

      {/* Events exist, but the search matched none */}
      {noMatches && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
          <p className="text-base font-medium text-slate-300">No events match &ldquo;{searchQuery.trim()}&rdquo;</p>
          <p className="mt-1 text-sm text-slate-500">Try a different name or place.</p>
        </div>
      )}

      {/* Grouped sections */}
      {GROUPS.map(({ key, title, description, dot }) => {
        const list = grouped[key];
        if (list.length === 0) return null;

        return (
          <section key={key} aria-labelledby={`group-${key}`}>
            <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <h2 id={`group-${key}`} className="flex items-center gap-2.5 text-lg font-semibold text-white">
                  <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                  {title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
                {list.length} {list.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{list.map(renderCard)}</div>
          </section>
        );
      })}
    </div>
  );
}