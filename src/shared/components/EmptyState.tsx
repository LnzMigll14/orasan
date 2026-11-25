import type { ReactNode } from "react";

/** A compact, left-aligned empty state: what's missing and the one action that fixes it. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border-strong/60 bg-surface px-5 py-6">
      <div>
        <p className="text-title">{title}</p>
        {children && <p className="mt-1 max-w-prose text-body text-text-secondary">{children}</p>}
      </div>
      {action}
    </div>
  );
}
