import { useSyncExternalStore } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

// A tiny toast queue. Call toast("Saved") from anywhere; <Toaster /> renders it.

type Toast = { id: number; message: string; tone: "success" | "error" };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function toast(message: string, tone: Toast["tone"] = "success") {
  const id = nextId++;
  toasts = [...toasts.slice(-2), { id, message, tone }];
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((item) => item.id !== id);
    emit();
  }, tone === "error" ? 6000 : 3500);
}

export function Toaster() {
  const items = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => toasts,
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 md:inset-x-auto md:right-6 md:bottom-6 md:items-end"
    >
      {items.map((item) => {
        const Icon = item.tone === "error" ? CircleAlert : CircleCheck;
        return (
          <p
            key={item.id}
            className="toast-item pointer-events-auto flex max-w-sm items-center gap-2 rounded-xl border border-border-strong bg-raised px-4 py-2.5 text-body font-semibold shadow-overlay"
          >
            <Icon
              aria-hidden="true"
              size={16}
              className={item.tone === "error" ? "shrink-0 text-overdue" : "shrink-0 text-paid"}
            />
            {item.message}
          </p>
        );
      })}
    </div>
  );
}
