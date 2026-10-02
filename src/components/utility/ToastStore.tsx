"use client";

/**
 * Minimal pub/sub store powering the toast system.
 * Lets `showToast()` be called from anywhere — event handlers,
 * server action callbacks, utils, etc — without needing hooks.
 */

export type ToastOptions = {
  text: string;
  bgColor?: string; // any valid CSS color/gradient, e.g. "#16a34a" or "linear-gradient(...)"
  textColor?: string;
  duration?: number; // ms, default 3000. Pass 0 to persist until manually closed.
  icon?: React.ReactNode;
};

export type Toast = Required<Omit<ToastOptions, "icon">> & {
  id: string;
  icon?: React.ReactNode;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(toasts);
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  listener(toasts);
  return () => listeners.delete(listener);
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function showToast(options: ToastOptions): () => void {
  const id = "ID-" + Date.now()

  const toast: Toast = {
    id,
    text: options.text,
    bgColor: options.bgColor ?? "#18181b",
    textColor: options.textColor ?? "#ffffff",
    duration: options.duration ?? 3000,
    icon: options.icon,
  };

  toasts = [...toasts, toast];
  emit();

  if (toast.duration > 0) {
    setTimeout(() => dismissToast(id), toast.duration);
  }

  return () => dismissToast(id);
}