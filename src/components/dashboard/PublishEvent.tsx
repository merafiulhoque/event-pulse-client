'use client';

import { ReactNode } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { EventCreateSchema, EventCreateData } from '@/zod/schemas';
import { showToast } from '@/components/utility/ToastStore';
import { ApiResponse, EVENTS } from '@/types';
import { publishEvent } from '@/actions/events/publishEvent';
import { useEventStore } from '@/store/eventStore';
import { Calendar, Clock, MapPin, Users, CalendarRange, AlertCircle, Loader2 } from 'lucide-react';
import { IndianDateInput } from '@/components/utility/CustomDateInput';

// ---------- Past-date prevention (India time) ----------
const TZ = 'Asia/Kolkata';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const todayISO = () => new Date().toLocaleDateString('en-CA', { timeZone: TZ }); // YYYY-MM-DD
const nowHHmm = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });

// Returns an error message if the date (and, for today, the time) is in the past
function pastError(label: string, date?: string, time?: string): string | undefined {
  if (!date || !ISO_DATE.test(date)) return undefined; // empty / partial: zod reports that
  const today = todayISO();
  if (date < today) return `${label} date can't be in the past`;
  if (date === today && time && time < nowHHmm()) return `${label} time has already passed today`;
  return undefined;
}

// Runs the zod schema first, then adds the past-date checks on top of it
const resolver: Resolver<EventCreateData> = async (values, context, options) => {
  const result = await zodResolver(EventCreateSchema)(values, context, options);

  const extra: Record<string, { type: string; message: string }> = {};
  const add = (field: string, message?: string) => {
    if (message) extra[field] = { type: 'validate', message };
  };

  add('date', pastError('Event', values.date) );
  add('time', pastError('Event', values.date, values.time)?.includes('time') ? pastError('Event', values.date, values.time) : undefined);
  add('bookingStartDate', pastError('Booking start', values.bookingStartDate));
  add('bookingStartTime', pastError('Booking start', values.bookingStartDate, values.bookingStartTime)?.includes('time') ? pastError('Booking start', values.bookingStartDate, values.bookingStartTime) : undefined);
  add('bookingEndDate', pastError('Booking end', values.bookingEndDate));
  add('bookingEndTime', pastError('Booking end', values.bookingEndDate, values.bookingEndTime)?.includes('time') ? pastError('Booking end', values.bookingEndDate, values.bookingEndTime) : undefined);

  if (Object.keys(extra).length === 0) return result;
  return { values: {}, errors: { ...(result.errors as object), ...extra } } as any;
};

// ---------- Styling ----------
const inputClass =
  'w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-base text-slate-100 placeholder-slate-600 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:py-2.5 sm:text-sm';
const timeClass =
  inputClass +
  ' [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60';

function Field({
  label,
  icon,
  error,
  htmlFor,
  className = '',
  children,
}: {
  label: string;
  icon?: ReactNode;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
        {icon}
        {label}
        <span className="text-indigo-400">*</span>
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-rose-400">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function PublishEvent() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EventCreateData>({
    resolver,
    mode: 'onChange', // show past-date errors as soon as the date is typed
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
        bgColor: response.success ? 'green' : 'red',
      });

      if (response.success && response.data) {
        addEvent(response.data);
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1000);
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : 'Failed to publish event',
        bgColor: 'red',
      });
    },
  });

  const onSubmit = (data: EventCreateData) => {
    mutation.mutate(data);
  };

  // When the chosen date is today, the time picker can't go earlier than now
  const [eventDate, startDate, endDate] = watch(['date', 'bookingStartDate', 'bookingEndDate']);
  const minTime = (date?: string) => (date === todayISO() ? nowHHmm() : undefined);

  const iconClass = 'h-3.5 w-3.5 text-indigo-400';

  return (
    // Plain flowing page (no card, no inner scroll container): the layout's <main> handles scrolling.
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}
      <header className="pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Publish new event</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Type dates naturally (e.g. 22102026) and they format automatically. Past dates are not allowed.
        </p>
      </header>

      <form id="publish-form" onSubmit={handleSubmit(onSubmit)} noValidate className="divide-y divide-slate-800 border-y border-slate-800">
        {/* General info */}
        <section className="py-7">
          <h2 className="text-base font-semibold text-white">General info</h2>
          <p className="mb-5 mt-0.5 text-sm text-slate-500">What, where and when the event takes place.</p>

          {/* One column on mobile, two from md up */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Event name" htmlFor="name" error={errors.name?.message} className="md:col-span-2">
              <input id="name" type="text" {...register('name')} placeholder="e.g. Tech Innovators Summit 2026" className={inputClass} />
            </Field>

            <Field label="Location / place" htmlFor="place" icon={<MapPin className={iconClass} />} error={errors.place?.message} className="md:col-span-2">
              <input id="place" type="text" {...register('place')} placeholder="e.g. Biswa Bangla Convention Centre, Kolkata" className={inputClass} />
            </Field>

            <Field label="Event date" icon={<Calendar className={iconClass} />} error={errors.date?.message}>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <IndianDateInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={!!errors.date} />
                )}
              />
            </Field>

            <Field label="Event time (24h)" htmlFor="time" icon={<Clock className={iconClass} />} error={errors.time?.message}>
              <input id="time" type="time" min={minTime(eventDate)} {...register('time')} className={timeClass} />
            </Field>

            <Field label="Maximum seat capacity" htmlFor="capacity" icon={<Users className={iconClass} />} error={errors.capacity?.message} className="md:col-span-2">
              <input id="capacity" type="number" inputMode="numeric" {...register('capacity', { valueAsNumber: true })} placeholder="50" className={inputClass} />
            </Field>
          </div>
        </section>

        {/* Booking window */}
        <section className="py-7">
          <h2 className="text-base font-semibold text-white">Booking window</h2>
          <p className="mb-5 mt-0.5 text-sm text-slate-500">When attendees can start and stop booking seats.</p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Start date" icon={<CalendarRange className={iconClass} />} error={errors.bookingStartDate?.message}>
              <Controller
                control={control}
                name="bookingStartDate"
                render={({ field }) => (
                  <IndianDateInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={!!errors.bookingStartDate} />
                )}
              />
            </Field>

            <Field label="Start time" htmlFor="bookingStartTime" icon={<Clock className={iconClass} />} error={errors.bookingStartTime?.message}>
              <input id="bookingStartTime" type="time" min={minTime(startDate)} {...register('bookingStartTime')} className={timeClass} />
            </Field>

            <Field label="End date" icon={<CalendarRange className={iconClass} />} error={errors.bookingEndDate?.message}>
              <Controller
                control={control}
                name="bookingEndDate"
                render={({ field }) => (
                  <IndianDateInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={!!errors.bookingEndDate} />
                )}
              />
            </Field>

            <Field label="End time" htmlFor="bookingEndTime" icon={<Clock className={iconClass} />} error={errors.bookingEndTime?.message}>
              <input id="bookingEndTime" type="time" min={minTime(endDate)} {...register('bookingEndTime')} className={timeClass} />
            </Field>
          </div>
        </section>
      </form>

      {/* Actions: stacked full-width on mobile (Publish on top), right-aligned from sm up */}
      <div className="flex flex-col-reverse gap-3 pb-6 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 sm:py-2.5"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="publish-form"
          disabled={mutation.isPending}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            'Publish event'
          )}
        </button>
      </div>
    </div>
  );
}