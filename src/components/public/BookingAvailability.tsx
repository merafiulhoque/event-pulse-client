'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useEventStore } from '@/store/eventStore';
import { checkAvailability } from '@/actions/tickets/checkAvailability';
import { showToast } from '@/components/utility/ToastStore';
import Loader from '@/components/utility/Loader';
import Link from 'next/link';

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
      if (!eventId) throw new Error("Invalid event ID");
      return await checkAvailability(eventId);
    },
    onSuccess: (response) => {
      showToast({
        text: response.message,
        bgColor: response.success ? "green" : "red",
      });

      if (response.success && response.data !== null && response.data !== undefined) {
        setAvailableSeats(response.data);
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : "Network Error",
        bgColor: "red",
      });
    },
  });

  // 2. CONDITIONAL RETURNS ONLY AFTER ALL HOOKS ARE DECLARED
  if (!isReady) {
    return <Loader message="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-md w-full shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">The requested event could not be found or your session data is empty.</p>
          <Link
            href="/upcoming-events"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Back to Upcoming Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            href="/upcoming-events"
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            ← Back
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
            Event ID: #{event.id}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">{event.name}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.place}
          </p>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-4 text-xs mt-4">
            <div>
              <span className="text-slate-500 block mb-1">Event Date</span>
              <span className="font-semibold text-slate-200">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Total Capacity</span>
              <span className="font-semibold text-slate-200">{event.capacity} Seats</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-200">Real-Time Seat Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {availableSeats !== null
                ? `${availableSeats} seats available right now`
                : "Verify current booking window and capacity"}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {availableSeats !== null && (
              <span className="text-lg font-mono font-bold text-emerald-400 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                {availableSeats} Left
              </span>
            )}
            <button
              onClick={() => availabilityMutation.mutate()}
              disabled={availabilityMutation.isPending}
              className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {availabilityMutation.isPending ? "Checking..." : "Check Availability"}
            </button>
          </div>
        </div>

        {availableSeats !== null && availableSeats > 0 && (
          <div className="pt-2">
            <button
              onClick={() => router.push(`/booking/checkout?id=${event.id}&seats=${availableSeats}`)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}