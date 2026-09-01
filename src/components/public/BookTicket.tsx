'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useEventStore } from '@/store/eventStore';
import { checkAvailability } from '@/actions/tickets/checkAvailability'; // Update path as needed
import { showToast } from '@/components/utility/ToastStore'; // Update path as needed
import { EVENTS } from '@/types';

interface BookTicketProps {
  eventId: number;
}

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
        showToast({ text: response.message, bgColor: "green" });
      } else {
        showToast({ text: response.message || "Failed to retrieve available seats", bgColor: "red" });
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : "Network error occurred",
        bgColor: "red",
      });
    },
  });

  if (!event) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <p>Event details could not be found or loaded.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6 max-w-2xl mx-auto text-slate-100">
      
      {/* Event Header Info */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 bg-slate-800 text-slate-400 rounded-md">
            ID: #{event.id}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full">
            Total Capacity: {event.capacity}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">{event.name}</h2>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.place}
        </p>
      </div>

      {/* Date & Booking Schedule Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <span className="text-slate-500 block">Event Schedule</span>
          <p className="font-semibold text-slate-200">{new Date(event.date).toLocaleDateString()}</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <span className="text-slate-500 block">Booking Window</span>
          <p className="font-semibold text-slate-200">
            {new Date(event.bookingStart).toLocaleDateString()} - {new Date(event.bookingEnd).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Live Seat Availability Panel */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-medium text-slate-200">Live Seat Availability</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {availableSeats !== null 
              ? `${availableSeats} seats currently available for booking` 
              : "Click check to verify real-time remaining capacity"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {availableSeats !== null && (
            <span className="text-xl font-mono font-bold text-indigo-400 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              {availableSeats}
            </span>
          )}
          <button
            onClick={() => availabilityMutation.mutate()}
            disabled={availabilityMutation.isPending}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {availabilityMutation.isPending ? "Checking..." : "Check Availability"}
          </button>
        </div>
      </div>

      {/* Next Step Placeholder */}
      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <button
          disabled={availableSeats === null || availableSeats <= 0}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
}