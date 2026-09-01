'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { OrganizerCreateSchema, OrganizerCreateInput } from '@/zod/schemas';
import { useMutation } from '@tanstack/react-query';
import { createAccount } from '@/actions/auth/createAccount';
import { ApiResponse } from '@/types';
import { showToast } from '@/components/utility/ToastStore';
import { useRouter } from 'next/navigation';

// Icons
const UserIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const LogoIcon = () => (
  <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default function CreateAccountPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizerCreateInput>({
    resolver: zodResolver(OrganizerCreateSchema),
  });

  const mutation = useMutation({
    mutationFn: createAccount,
    onSuccess: (response: ApiResponse<null>) => {
      showToast({
        text: response.message,
        bgColor: response.success ? "green" : "red",
      });

      if (response.success) {
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    },
    onError: (err: any) => {
      showToast({
        text: err instanceof Error ? err.message : "Network Error",
        bgColor: "red",
      });
    },
  });

  const onSubmit = (data: OrganizerCreateInput) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4">

      {/* Background Deep Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Floating Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl text-slate-300 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all shadow-sm backdrop-blur-md"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Single Viewport Compact Glassmorphic Card */}
      <div className="relative w-full max-w-sm z-10">
        <div className="backdrop-blur-2xl bg-slate-900/60 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-7">

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 shadow-inner">
              <LogoIcon />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Create an Account
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Sign up as an organizer to get started
            </p>
          </div>

          {/* Form */}
          <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">

              {/* Name Field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    type="text"
                    {...register("name")}
                    className={`block w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border ${
                      errors.name ? 'border-red-500/50' : 'border-slate-800'
                    } text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EmailIcon />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    className={`block w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border ${
                      errors.email ? 'border-red-500/50' : 'border-slate-800'
                    } text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    {...register("password")}
                    className={`block w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border ${
                      errors.password ? 'border-red-500/50' : 'border-slate-800'
                    } text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.password.message}</p>
                )}
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={mutation.isPending || isSubmitting}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
              >
                {mutation.isPending || isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}