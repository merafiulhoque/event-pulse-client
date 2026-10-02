'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { organizerLogin } from '@/actions/auth/organizerLogin';
import { requireUser } from '@/actions/auth/requireUser';
import { requireEvents } from '@/actions/events/requireEvents';
import { ApiResponse } from '@/types';
import { OrganizerLoginData, OrganizerLoginSchema } from '@/zod/schemas';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { showToast } from '@/components/utility/ToastStore';
import Loader from '../utility/Loader';
import { ArrowLeft, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const inputBase =
  'block w-full rounded-xl border bg-slate-950 py-3 pl-10 pr-3.5 text-base text-slate-100 placeholder-slate-600 transition-colors focus:outline-none focus:ring-2 sm:py-2.5 sm:text-sm';
const inputOk = 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20';
const inputErr = 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { setEvents } = useEventStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizerLoginData>({
    resolver: zodResolver(OrganizerLoginSchema),
    defaultValues: {
      email: 'john@gmail.com',
      password: 'abcdef',
    },
  });

  const mutation = useMutation({
    mutationFn: organizerLogin,
    onSuccess: async (response: ApiResponse<null>) => {
      showToast({
        text: response.message,
        bgColor: response.success ? 'green' : 'red',
      });

      if (response.success) {
        try {
          setIsLoading(true);

          const [userResponse, eventsResponse] = await Promise.all([
            requireUser(),
            requireEvents(),
          ]);

          if (!userResponse.success || !userResponse.data) {
            throw new Error(userResponse.message || 'Unauthorized session');
          }

          if (!eventsResponse.success || !eventsResponse.data) {
            throw new Error(eventsResponse.message || 'Failed to fetch events');
          }

          setUser(userResponse.data);
          setEvents(eventsResponse.data);

          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } catch (error) {
          setIsLoading(false);
          useAuthStore.getState().clearUser();
          useEventStore.getState().clearEvents();

          showToast({
            text: error instanceof Error ? error.message : 'Authentication synchronization failed',
            bgColor: 'red',
          });
        }
      }
    },
    onError: (err: unknown) => {
      setIsLoading(false);
      showToast({
        text: err instanceof Error ? err.message : 'Network Error',
        bgColor: 'red',
      });
    },
  });

  const onSubmit = (data: OrganizerLoginData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <Loader message="Loading user details..." />;

  const busy = mutation.isPending || isSubmitting;

  const fieldError = (msg?: string) =>
    msg ? (
      <p role="alert" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-400">
        <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
        {msg}
      </p>
    ) : null;

  return (
    // min-h-screen (not h-screen + overflow-hidden) so nothing is clipped on short phones or with the keyboard open
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[320px] w-[640px] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

      {/* Top bar: back link sits in the flow so it can't overlap the card on small screens */}
      <header className="relative z-20 px-4 pt-5 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 sm:p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-600/30">
              E
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="mt-1.5 text-sm text-slate-400">Log in to your organizer account</p>
          </div>

          {/* Form */}
          <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  placeholder="you@example.com"
                />
              </div>
              {fieldError(errors.email?.message)}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  className={`${inputBase} ${errors.password ? inputErr : inputOk}`}
                  placeholder="••••••••"
                />
              </div>
              {fieldError(errors.password?.message)}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/create-account" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}