'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useEventStore } from '@/store/eventStore';
import { checkAvailability } from '@/actions/tickets/checkAvailability'; // Update path as needed
import { showToast } from '@/components/utility/ToastStore'; // Update path as needed
import { EVENTS } from '@/types';
import { CalendarDays, Ticket, MapPin, RefreshCw, Loader2, SearchX } from 'lucide-react';

interface BookTicketProps {
  eventId: number;
}

const formatDate = (v: string | Date) =>
  new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });

export default function BookTicket({ eventId }: BookTicketProps) {
  // Retrieve the specific event details from your Zustand store
  const getEventDetails = useEventStore((state) => state.getEventDetails);
  const event: EVENTS | undefined = getEventDetails(eventId);

  const [availableSeats, setAvailableSeats] = useState<number | null>(null);

  // Mutation for checking live seat availability
  const availabilityMutation = useMutation({
    mutationFn: () => checkAvailability(eventId),
    onSuccess: (response) => {
      if (response.success && response.data !== undefined && response.data !== null) {
        setAvailableSeats(response.data);
        showToast({ text: response.message, bgColor: 'green' });
      } else {
        showToast({ text: response.message || 'Failed to retrieve available seats', bgColor: 'red' });
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : 'Network error occurred',
        bgColor: 'red',
      });
    },
  });

  if (!event) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
          <SearchX className="h-7 w-7 text-slate-500" />
        </div>
        <p className="mt-4 text-sm text-slate-400">Event details could not be found or loaded.</p>
      </div>
    );
  }

  const pct =
    availableSeats !== null && event.capacity > 0
      ? Math.min(100, Math.max(0, Math.round((availableSeats / event.capacity) * 100)))
      : 0;
  const soldOut = availableSeats !== null && availableSeats <= 0;
  const low = availableSeats !== null && !soldOut && pct <= 20;
  const barColor = soldOut ? 'bg-rose-500' : low ? 'bg-amber-400' : 'bg-emerald-400';
  const numColor = soldOut ? 'text-rose-400' : low ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-100 shadow-xl shadow-black/20 sm:space-y-6 sm:p-8">
      {/* Event header */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-md border border-slate-700/60 bg-slate-800/70 px-2 py-1 font-mono text-[11px] text-slate-400">
            ID #{event.id}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            Total capacity: {event.capacity}
          </span>
        </div>
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">{event.name}</h2>
        <p className="mt-2 flex items-start gap-2 text-sm text-slate-400">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400/80" />
          <span className="min-w-0 break-words">{event.place}</span>
        </p>
      </div>

      {/* Schedule: stacked on mobile, two columns from sm */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" />
            Event schedule
          </span>
          <p className="mt-1.5 text-sm font-semibold text-slate-200">{formatDate(event.date)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <Ticket className="h-4 w-4" />
            Booking window
          </span>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate-200">
            {formatDate(event.bookingStart)}
            <span className="mx-1.5 font-normal text-slate-600">to</span>
            {formatDate(event.bookingEnd)}
          </p>
        </div>
      </div>

      {/* Live seat availability */}
      <section className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
        <h3 className="text-base font-semibold text-slate-100">Live seat availability</h3>
        <p className="mt-1 text-sm text-slate-400">
          {availableSeats !== null
            ? `${availableSeats} seats currently available for booking`
            : 'Click check to verify real-time remaining capacity'}
        </p>

        {availableSeats !== null && (
          <div className="mt-4" aria-live="polite">
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold tabular-nums ${numColor}`}>{availableSeats}</span>
              <span className="text-sm text-slate-500">{soldOut ? 'left, sold out' : `left of ${event.capacity}`}</span>
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

      {/* Next step placeholder */}
      <div className="flex justify-end border-t border-slate-800 pt-5">
        <button
          disabled={availableSeats === null || availableSeats <= 0}
          className="w-full cursor-pointer rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}