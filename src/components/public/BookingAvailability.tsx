'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useEventStore } from '@/store/eventStore';
import { checkAvailability } from '@/actions/tickets/checkAvailability';
import { showToast } from '@/components/utility/ToastStore';
import Loader from '@/components/utility/Loader';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin, Users, RefreshCw, Loader2, SearchX } from 'lucide-react';

const formatDate = (v: string | Date) =>
  new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
const formatTime = (v: string | Date) =>
  new Date(v).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

export default function BookingAvailability() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get('id');
  const eventId = idParam ? Number(idParam) : null;

  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  // 1. ALL HOOKS CALLED AT THE TOP LEVEL (Before any conditional returns)
  const getEventDetails = useEventStore((state) => state.getEventDetails);
  const event = eventId ? getEventDetails(eventId) : null;

  // Check if store has finished rehydrating from localStorage
  useEffect(() => {
    const checkHydration = () => {
      if (useEventStore.persist.hasHydrated()) {
        setIsReady(true);
      } else {
        const timer = setTimeout(() => setIsReady(true), 200);
        return () => clearTimeout(timer);
      }
    };
    checkHydration();
  }, []);

  // Hook is declared unconditionally here every single render
  const availabilityMutation = useMutation({
    mutationFn: async () => {
      if (!eventId) throw new Error('Invalid event ID');
      return await checkAvailability(eventId);
    },
    onSuccess: (response) => {
      showToast({
        text: response.message,
        bgColor: response.success ? 'green' : 'red',
      });

      if (response.success && response.data !== null && response.data !== undefined) {
        setAvailableSeats(response.data);
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : 'Network Error',
        bgColor: 'red',
      });
    },
  });

  // 2. CONDITIONAL RETURNS ONLY AFTER ALL HOOKS ARE DECLARED
  if (!isReady) {
    return <Loader message="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center shadow-2xl shadow-black/30 sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <SearchX className="h-7 w-7 text-slate-500" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-white">Event not found</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            The requested event could not be found or your session data is empty.
          </p>
          <Link
            href="/upcoming-events"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to upcoming events
          </Link>
        </div>
      </div>
    );
  }

  // Share of capacity still free (used for the bar and its colour)
  const pct =
    availableSeats !== null && event.capacity > 0
      ? Math.min(100, Math.max(0, Math.round((availableSeats / event.capacity) * 100)))
      : 0;
  const soldOut = availableSeats !== null && availableSeats <= 0;
  const low = availableSeats !== null && !soldOut && pct <= 20;
  const barColor = soldOut ? 'bg-rose-500' : low ? 'bg-amber-400' : 'bg-emerald-400';
  const numColor = soldOut ? 'text-rose-400' : low ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="border-b border-slate-900">
        <div className="mx-auto flex h-14 w-full max-w-xl items-center justify-between px-4 sm:px-0">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-1.5 rounded-lg py-2 pr-2 text-sm font-medium text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="rounded-md border border-slate-700/60 bg-slate-800/70 px-2 py-1 font-mono text-[11px] text-slate-400">
            Event #{event.id}
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-6 sm:items-center sm:py-12">
        <div className="w-full max-w-xl space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/30 sm:space-y-6 sm:p-8">
          {/* Event heading */}
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">{event.name}</h1>
            <p className="mt-2 flex items-start gap-2 text-sm text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400/80" />
              <span className="min-w-0 break-words">{event.place}</span>
            </p>
          </div>

          {/* Details */}
          <dl className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950/60 text-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="flex items-center gap-2 text-slate-500">
                <CalendarDays className="h-4 w-4" />
                Event date
              </dt>
              <dd className="font-medium text-slate-200">{formatDate(event.date)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="flex items-center gap-2 text-slate-500">
                <Clock className="h-4 w-4" />
                Event time
              </dt>
              <dd className="font-medium text-slate-200">{formatTime(event.date)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="flex items-center gap-2 text-slate-500">
                <Users className="h-4 w-4" />
                Total capacity
              </dt>
              <dd className="font-medium text-slate-200">{event.capacity} Seats</dd>
            </div>
          </dl>

          {/* Real-time seat status */}
          <section className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
            <h2 className="text-base font-semibold text-slate-100">Real-time seat status</h2>
            <p className="mt-1 text-sm text-slate-400">
              {availableSeats !== null
                ? `${availableSeats} seats available right now`
                : 'Verify current booking window and capacity'}
            </p>

            {availableSeats !== null && (
              <div className="mt-4" aria-live="polite">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold tabular-nums ${numColor}`}>{availableSeats}</span>
                  <span className="text-sm text-slate-500">
                    {soldOut ? 'left, sold out' : `left of ${event.capacity}`}
                  </span>
                </div>
                <div
                  className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Seats remaining"
                >
                  <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}

            <button
              onClick={() => availabilityMutation.mutate()}
              disabled={availabilityMutation.isPending}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {availabilityMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Check availability
                </>
              )}
            </button>
          </section>

          {/* Checkout */}
          {availableSeats !== null && availableSeats > 0 && (
            <button
              onClick={() => router.push(`/booking/checkout?id=${event.id}&seats=${availableSeats}`)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            >
              Proceed to checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}