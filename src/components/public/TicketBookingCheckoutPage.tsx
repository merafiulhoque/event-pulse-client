'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { TicketBookingSchema, ticketBookingData } from '@/zod/schemas';
import { useEventStore } from '@/store/eventStore';
import { showToast } from '@/components/utility/ToastStore';
import Loader from '@/components/utility/Loader';
import Link from 'next/link';
import { bookTicket } from '@/actions/tickets/bookTicket';

export default function TicketBookingCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get('id');
  const seatsParam = searchParams.get('seats');
  const eventId = idParam ? Number(idParam) : null;

  const [isReady, setIsReady] = useState(false);
  const [bookedTicket, setBookedTicket] = useState<any | null>(null); // State to hold successful ticket details

  // 1. ALL HOOKS AT THE TOP LEVEL
  const getEventDetails = useEventStore((state) => state.getEventDetails);
  const event = eventId ? getEventDetails(eventId) : null;

  // Check store hydration
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ticketBookingData>({
    resolver: zodResolver(TicketBookingSchema),
  });

  const bookingMutation = useMutation({
    mutationFn: ({formData, idempotencyKey}:{formData: ticketBookingData, idempotencyKey: string}) => {
      if (!eventId) throw new Error("Event ID is missing");
      return bookTicket(eventId, formData, idempotencyKey);
    },
    onSuccess: (response) => {
      showToast({
        text: response.message,
        bgColor: response.success ? "green" : "red",
      });

      if (response.success && response.data) {
        // Save ticket details to state to display the success confirmation screen
        setBookedTicket(response.data);
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : "Booking failed",
        bgColor: "red",
      });
    },
  });

  useEffect(()=>{
    if(!eventId) return
    const storageKey = `idempotencyKey:${eventId}`
    const idempotencyKey = sessionStorage.getItem(storageKey)
    if(!idempotencyKey){
      const key = "IK" + Date.now()
      sessionStorage.setItem(storageKey, key)
    }
  }, [eventId])

  const onSubmit = (data: ticketBookingData) => {
    if(!eventId) return
    const idempotencyKey = sessionStorage.getItem(`idempotencyKey:${eventId}`)
    if(!idempotencyKey) throw new Error("Idempotency Key is missing")

    bookingMutation.mutate({
      formData: data,
      idempotencyKey
    });
  };

  const downloadTicket = (id: number) => {
    window.location.href = `/api/ticket/download/${id}`    
  }

  // 2. COMBINED LOADER & NULL GUARD
  if (!isReady || !event || !eventId) {
    return <Loader message={!isReady ? "Loading checkout session..." : "Loading event details..."} />;
  }

  // 3. SUCCESS VIEW: Rendered when ticket booking is confirmed
  if (bookedTicket) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
            ✓
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Ticket Booked Successfully!</h2>
            <p className="text-xs text-slate-400 mt-1">Your booking has been secured and registered.</p>
          </div>

          {/* Ticket Summary Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Ticket ID:</span>
              <span className="font-mono font-medium text-indigo-400">#{bookedTicket.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Event:</span>
              <span className="font-medium text-slate-200">{event.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Attendee Name:</span>
              <span className="font-medium text-slate-200">{bookedTicket.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-medium text-slate-200">{bookedTicket.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {bookedTicket.status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => downloadTicket(bookedTicket.id)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Download Ticket PDF
            </button>
            <Link
              href="/upcoming-events"
              className="block w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
            >
              Back to Upcoming Events
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // 4. DEFAULT CHECKOUT FORM VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            href={`/booking/availability?id=${event.id}`}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            ← Back to Availability
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
            Event ID: #{event.id}
          </span>
        </div>

        {/* Event Summary Box */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <h2 className="text-lg font-bold text-white">{event.name}</h2>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Location: <strong className="text-slate-200">{event.place}</strong></span>
            {seatsParam && (
              <span className="text-emerald-400 font-medium">
                {seatsParam} Seats Available
              </span>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (10 digits)</label>
            <input
              type="tel"
              {...register("phone")}
              placeholder="9876543210"
              maxLength={10}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {errors.phone && <p className="mt-1 text-[11px] text-red-400">{errors.phone.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={bookingMutation.isPending || isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {bookingMutation.isPending || isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Confirming Booking...
                </>
              ) : (
                "Confirm & Book Ticket"
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}