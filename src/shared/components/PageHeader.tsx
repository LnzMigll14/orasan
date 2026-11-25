import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { QuickTimer } from "./QuickTimer";

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: { to: string; label: string };
  /** The page's main action, shown after the timer controls. */
  action?: ReactNode;
  /** Hide the quick timer (the Timer page has its own). */
  timer?: boolean;
};

export function PageHeader({ title, subtitle, back, action, timer = true }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link
            to={back.to}
            className="-ml-1 mb-1 inline-flex min-h-8 items-center gap-1 text-label font-bold text-text-secondary hover-fine:text-text"
          >
            <ChevronLeft aria-hidden="true" size={14} />
            {back.label}
          </Link>
        )}
        <h1 className="text-display">{title}</h1>
        {subtitle && <div className="mt-1 text-body text-text-secondary">{subtitle}</div>}
      </div>

      {(timer || action) && (
        // On phones the project picker spans both columns; from md the controls sit in one row.
        <div className="grid w-full grid-cols-2 gap-2 md:ml-auto md:flex md:w-auto md:items-center md:gap-3">
          {timer && <QuickTimer />}
          {action}
        </div>
      )}
    </header>
  );
}
