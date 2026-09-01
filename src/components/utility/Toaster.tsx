"use client";

import { useEffect, useRef, useState } from "react";
import { subscribe, dismissToast, type Toast } from "./ToastStore"

type DisplayToast = Toast & { leaving?: boolean };

const EXIT_DURATION = 220; // ms, keep in sync with the exit transition below

/**
 * Mount this once, near the root of your app (e.g. in app/layout.tsx):
 *
 *   import { Toaster } from "@/components/toaster";
 *   ...
 *   <body>
 *     {children}
 *     <Toaster />
 *   </body>
 *
 * Then call `showToast({ text, bgColor, duration })` from anywhere,
 * client component or event handler:
 *
 *   import { showToast } from "@/components/toast-store";
 *   showToast({ text: "Changes saved", bgColor: "#16a34a" });
 */
export function Toaster() {
  const [items, setItems] = useState<DisplayToast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const unsubscribe = subscribe((toasts) => {
      setItems((prev) => {
        const nextIds = new Set(toasts.map((t) => t.id));

        // mark toasts that left the store as "leaving" so they can animate out
        const stillHere = prev.map((p) =>
          nextIds.has(p.id) ? p : { ...p, leaving: true }
        );

        for (const p of stillHere) {
          if (p.leaving && !timers.current.has(p.id)) {
            const timeout = setTimeout(() => {
              setItems((curr) => curr.filter((t) => t.id !== p.id));
              timers.current.delete(p.id);
            }, EXIT_DURATION);
            timers.current.set(p.id, timeout);
          }
        }

        const existingIds = new Set(stillHere.map((t) => t.id));
        const incoming = toasts.filter((t) => !existingIds.has(t.id));

        return [...stillHere, ...incoming];
      });
    });

    return () => {
      unsubscribe();
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-9999 flex flex-col-reverse items-center gap-2 px-4"
    >
      {items.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: DisplayToast }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const visible = entered && !toast.leaving;

  return (
    <div
      role="status"
      style={{ background: toast.bgColor, color: toast.textColor }}
      className={[
        "pointer-events-auto relative flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-xl px-4 py-3 shadow-lg shadow-black/20 ring-1 ring-black/5",
        "transition-all duration-200 ease-out",
        visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95",
      ].join(" ")}
    >
      {toast.icon && <span className="shrink-0">{toast.icon}</span>}

      <span className="flex-1 text-sm font-medium leading-snug wrap-break-word">
        {toast.text}
      </span>

      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {toast.duration > 0 && !toast.leaving && (
        <span
          className="absolute inset-x-0 bottom-0 h-0.75 origin-left bg-white/35"
          style={{
            animation: `toast-shrink ${toast.duration}ms linear forwards`,
          }}
        />
      )}

      <style jsx>{`
        @keyframes toast-shrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}