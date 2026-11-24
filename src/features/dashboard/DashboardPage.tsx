import {
  ArrowRight,
  Plus,
  Send,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { ProjectSelect } from "../../shared/components/ProjectSelect";
import { HoursTracked } from "./HoursTracked";
import { InvoiceTracker } from "./InvoiceTracker";
import { ReadyToInvoice } from "./ReadyToInvoice";

// Display the Manila calendar date and use the same instant for the time element's ISO value.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Manila",
});

// These sample values are for display. The unbilled card shows PHP and USD separately.
const summaries = [
  {
    id: "unbilled",
    label: "Unbilled time",
    amount: "₱42,075",
    detail: "and $141 · 3 clients",
    icon: Wallet,
    iconClass: "bg-amber-tint text-amber",
    borderClass: "border-border",
  },
  {
    id: "sent",
    label: "Sent, not due yet",
    amount: "₱8,550",
    detail: "1 invoice · Kalye Coffee Co.",
    icon: Send,
    iconClass: "bg-sent-tint text-sent",
    borderClass: "border-border",
  },
  {
    id: "overdue",
    label: "Overdue",
    amount: "₱36,000",
    detail: "Reyes Studio · 11 days late",
    icon: TriangleAlert,
    iconClass: "bg-overdue-tint text-overdue",
    borderClass: "border-overdue-tint",
  },
];

// Optional callbacks let each action become available when its workflow is connected.
type DashboardPageProps = {
  onStartTimer?: () => void;
  onNewInvoice?: () => void;
  onViewOverdue?: () => void;
};

export function DashboardPage({
  onStartTimer,
  onNewInvoice,
  onViewOverdue,
}: DashboardPageProps) {
  const today = new Date();

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display">Welcome back, Lanz</h1>
          <time
            dateTime={today.toISOString()}
            className="mt-1 block text-body text-text-secondary"
          >
            {dateFormat.format(today)}
          </time>
        </div>

        {/* On phones the project picker spans both columns. From md, the controls use a compact flex row. */}
        <div className="grid w-full grid-cols-2 gap-2 md:ml-auto md:flex md:w-auto md:items-center md:gap-3">
          <ProjectSelect />

          <button
            type="button"
            onClick={onStartTimer}
            disabled={!onStartTimer}
            className="h-(--size-control-touch) whitespace-nowrap rounded-pill border border-border bg-raised px-4 text-body font-bold enabled:cursor-pointer disabled:cursor-not-allowed md:h-(--size-control)"
          >
            Start timer
          </button>

          <button
            type="button"
            onClick={onNewInvoice}
            disabled={!onNewInvoice}
            className="inline-flex h-(--size-control-touch) items-center justify-center gap-2 whitespace-nowrap rounded-pill bg-amber px-4 text-body font-bold text-on-amber enabled:cursor-pointer enabled:hover:bg-amber-hover disabled:cursor-not-allowed md:h-(--size-control)"
          >
            <Plus aria-hidden="true" size={16} />
            New invoice
          </button>
        </div>
      </header>

      <section aria-label="Billing summary">
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {summaries.map(
            ({
              id,
              label,
              amount,
              detail,
              icon: Icon,
              iconClass,
              borderClass,
            }) => (
              <li
                key={id}
                className={`flex min-h-24 items-center gap-4 rounded-lg border bg-surface p-4 md:gap-2 md:px-3 xl:gap-4 xl:px-4 ${borderClass}`}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full md:size-10 xl:size-11 ${iconClass}`}
                >
                  <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-label text-text-secondary">{label}</p>
                  <p className="text-stat tabular-nums">{amount}</p>
                  <p className="text-label text-text-muted">{detail}</p>
                </div>

                {id === "overdue" && (
                  <button
                    type="button"
                    aria-label="View overdue invoices"
                    onClick={onViewOverdue}
                    disabled={!onViewOverdue}
                    className="grid size-11 shrink-0 place-items-center rounded-full text-text-secondary enabled:cursor-pointer enabled:hover:bg-raised disabled:cursor-not-allowed md:size-10 xl:size-11"
                  >
                    <ArrowRight aria-hidden="true" size={18} />
                  </button>
                )}
              </li>
            ),
          )}
        </ul>
      </section>

      {/* Start with stacked panels and give the chart the wider column from xl. */}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
        <HoursTracked />
        <ReadyToInvoice />
      </div>

      <InvoiceTracker />
    </div>
  );
}
