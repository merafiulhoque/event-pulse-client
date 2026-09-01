'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { EventCreateSchema, EventCreateData } from '@/zod/schemas';
import { showToast } from '@/components/utility/ToastStore';
import { ApiResponse, EVENTS } from '@/types';
import { publishEvent } from '@/actions/events/publishEvent';
import { useEventStore } from '@/store/eventStore';
import { Calendar, Clock, MapPin, Users, CalendarRange, Sparkles } from 'lucide-react';
import { IndianDateInput } from '@/components/utility/CustomDateInput';

export default function PublishEvent() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventCreateData>({
    resolver: zodResolver(EventCreateSchema),
    defaultValues: {
      capacity: 50,
    },
  });

  const { addEvent } = useEventStore();

  const mutation = useMutation({
    mutationFn: (data: EventCreateData) => {
      // Data dates are already passed in ISO format (YYYY-MM-DD) via IndianDateInput component handler
      return publishEvent(data);
    },
    onSuccess: (response: ApiResponse<EVENTS | null>) => {
      showToast({
        text: response.message,
        bgColor: response.success ? "green" : "red",
      });

      if (response.success && response.data) {
        addEvent(response.data);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : "Failed to publish event",
        bgColor: "red",
      });
    },
  });

  const onSubmit = (data: EventCreateData) => {
    mutation.mutate(data);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] flex items-center justify-center p-3 md:p-4 overflow-hidden">
      
      <div className="w-full max-w-4xl h-[94vh] max-h-[700px] bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl shadow-indigo-950/50 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="px-5 py-3.5 flex items-center justify-between relative z-10 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-xl border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-100">
                Publish New Event
              </h1>
              <p className="text-[11px] text-slate-400">Type naturally (e.g. 22102026) for auto formatting</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            🇮🇳 Auto-Hyphen DD-MM-YYYY
          </span>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
          <form id="publish-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            
            {/* Section 1: General Info */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                1. General Info
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Event Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="e.g. Tech Innovators Summit 2026"
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                  {errors.name && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.name.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-400" />
                    <span>Location / Place</span> <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("place")}
                    placeholder="e.g. Biswa Bangla Convention Centre, Kolkata"
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                  {errors.place && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.place.message}</p>}
                </div>

                {/* Reusable Event Date Field */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span>Event Date (DD-MM-YYYY)</span> <span className="text-indigo-400">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <IndianDateInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={!!errors.date}
                      />
                    )}
                  />
                  {errors.date && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>Event Time (24h)</span> <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="time"
                    {...register("time")}
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 shadow-inner [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  {errors.time && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.time.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-400" />
                    <span>Maximum Seat Capacity</span> <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("capacity", { valueAsNumber: true })}
                    placeholder="50"
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                  {errors.capacity && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.capacity.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Booking Windows */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                2. Booking Windows
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Reusable Booking Start Date */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <CalendarRange className="w-3 h-3 text-indigo-400" />
                    <span>Start Date (DD-MM-YYYY)</span> <span className="text-indigo-400">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="bookingStartDate"
                    render={({ field }) => (
                      <IndianDateInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={!!errors.bookingStartDate}
                      />
                    )}
                  />
                  {errors.bookingStartDate && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.bookingStartDate.message}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>Start Time</span> <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="time"
                    {...register("bookingStartTime")}
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 shadow-inner [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  {errors.bookingStartTime && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.bookingStartTime.message}</p>}
                </div>

                {/* Reusable Booking End Date */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <CalendarRange className="w-3 h-3 text-indigo-400" />
                    <span>End Date (DD-MM-YYYY)</span> <span className="text-indigo-400">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="bookingEndDate"
                    render={({ field }) => (
                      <IndianDateInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={!!errors.bookingEndDate}
                      />
                    )}
                  />
                  {errors.bookingEndDate && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.bookingEndDate.message}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>End Time</span> <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="time"
                    {...register("bookingEndTime")}
                    className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 shadow-inner [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  {errors.bookingEndTime && <p className="mt-1 text-[11px] text-rose-400 font-medium">⚠️ {errors.bookingEndTime.message}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-end gap-3 relative z-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-all hover:bg-slate-800/50 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="publish-form"
            disabled={mutation.isPending}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <span className="animate-spin">⏳</span>
                Publishing...
              </>
            ) : (
              'Publish Event'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}