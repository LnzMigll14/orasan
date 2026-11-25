import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, Plus, Send, TriangleAlert, Wallet } from "lucide-react";
import {
  indexById,
  invoiceStatus,
  lastSevenDays,
  sumByCurrency,
  unbilledByClient,
} from "../../data/selectors";
import { useAppData } from "../../data/store";
import type { Currency } from "../../data/types";
import { PageHeader } from "../../shared/components/PageHeader";
import { formatMoney } from "../../shared/formatMoney";
import { useNow } from "../../shared/hooks";
import { daysBetween, secondsBetween, todayKey } from "../../shared/time";
import { button } from "../../shared/ui";
import { HoursTracked } from "./HoursTracked";
import { InvoiceTracker } from "./InvoiceTracker";
import { ReadyToInvoice } from "./ReadyToInvoice";

// Display the Manila calendar date.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Manila",
});

/** The biggest currency leads; the other follows as "and $141". Currencies are never added together. */
function splitTotals(totals: Partial<Record<Currency, number>>, fallback: Currency) {
  const entries = (Object.entries(totals) as [Currency, number][]).filter(([, amount]) => amount > 0);
  // PHP and USD aren't comparable, so lead with PHP when both exist (most users bill in pesos).
  entries.sort(([a], [b]) => (a === "PHP" ? -1 : b === "PHP" ? 1 : 0));
  const [first, ...rest] = entries;
  return {
    main: formatMoney(first?.[1] ?? 0, first?.[0] ?? fallback, "narrow"),
    rest: rest.map(([currency, amount]) => formatMoney(amount, currency, "narrow")),
  };
}

const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

export function DashboardPage() {
  const data = useAppData();
  const now = useNow(data.runningTimer !== null);
  const today = todayKey(now);
  const firstName = data.profile.name.trim().split(/\s+/)[0];
  const fallbackCurrency = data.clients[0]?.currency ?? "PHP";

  const summary = useMemo(() => {
    const clients = indexById(data.clients);
    const unbilled = unbilledByClient(data);
    const unbilledTotals = sumByCurrency(
      [...unbilled].map(([clientId, totals]) => ({
        currency: clients.get(clientId)?.currency ?? "PHP",
        amountMinor: totals.amountMinor,
      })),
    );

    const sent = data.invoices.filter((invoice) => invoiceStatus(invoice, today) === "sent");
    const overdue = data.invoices
      .filter((invoice) => invoiceStatus(invoice, today) === "overdue")
      .sort((a, b) => a.dueOn.localeCompare(b.dueOn));

    const names = (ids: string[]) => {
      const unique = [...new Set(ids)].map((id) => clients.get(id)?.name ?? "Deleted client");
      return unique.length > 2 ? `${unique.length} clients` : unique.join(", ");
    };

    return {
      unbilled: { totals: unbilledTotals, clientCount: unbilled.size },
      sent: { totals: sumByCurrency(sent.map((i) => ({ currency: i.currency, amountMinor: i.totalMinor }))), invoices: sent, names: names(sent.map((i) => i.clientId)) },
      overdue: {
        totals: sumByCurrency(overdue.map((i) => ({ currency: i.currency, amountMinor: i.totalMinor }))),
        invoices: overdue,
        names: names(overdue.map((i) => i.clientId)),
        oldestDays: overdue[0] ? daysBetween(overdue[0].dueOn, today) : 0,
      },
    };
  }, [data, today]);

  const runningSeconds = data.runningTimer ? secondsBetween(Date.parse(data.runningTimer.startedAt), now) : 0;
  // Rebuild the week when entries change or the running timer passes another minute.
  const runningMinute = Math.floor(runningSeconds / 60);
  const week = useMemo(
    () => lastSevenDays(data.entries, today, runningMinute * 60),
    [data.entries, today, runningMinute],
  );

  const unbilledSplit = splitTotals(summary.unbilled.totals, fallbackCurrency);
  const sentSplit = splitTotals(summary.sent.totals, fallbackCurrency);
  const overdueSplit = splitTotals(summary.overdue.totals, fallbackCurrency);
  const withRest = (rest: string[], detail: string) => [rest.length ? `and ${rest.join(" and ")}` : "", detail].filter(Boolean).join(" · ");

  const cards = [
    {
      id: "unbilled",
      label: "Unbilled time",
      amount: unbilledSplit.main,
      detail: withRest(
        unbilledSplit.rest,
        summary.unbilled.clientCount ? plural(summary.unbilled.clientCount, "client") : "Nothing to bill yet",
      ),
      icon: Wallet,
      iconClass: "bg-amber-tint text-amber",
      borderClass: "border-border",
      to: summary.unbilled.clientCount ? "/invoices/new" : null,
      linkLabel: "Create an invoice from unbilled time",
    },
    {
      id: "sent",
      label: "Sent, not due yet",
      amount: sentSplit.main,
      detail: withRest(
        sentSplit.rest,
        summary.sent.invoices.length
          ? `${plural(summary.sent.invoices.length, "invoice")} · ${summary.sent.names}`
          : "No invoices waiting",
      ),
      icon: Send,
      iconClass: "bg-sent-tint text-sent",
      borderClass: "border-border",
      to: summary.sent.invoices.length ? "/invoices?status=sent" : null,
      linkLabel: "View sent invoices",
    },
    {
      id: "overdue",
      label: "Overdue",
      amount: overdueSplit.main,
      detail: withRest(
        overdueSplit.rest,
        summary.overdue.invoices.length
          ? `${summary.overdue.names} · ${plural(summary.overdue.oldestDays, "day")} late`
          : "Nothing overdue",
      ),
      icon: TriangleAlert,
      iconClass: "bg-overdue-tint text-overdue",
      borderClass: summary.overdue.invoices.length ? "border-overdue-tint" : "border-border",
      to: summary.overdue.invoices.length ? "/invoices?status=overdue" : null,
      linkLabel: "View overdue invoices",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-6">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        subtitle={<time dateTime={today}>{dateFormat.format(now)}</time>}
        action={
          <Link to="/invoices/new" className={button.primary}>
            <Plus aria-hidden="true" size={16} />
            New invoice
          </Link>
        }
      />

      <section aria-label="Billing summary">
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {cards.map(({ id, label, amount, detail, icon: Icon, iconClass, borderClass, to, linkLabel }) => (
            <li
              key={id}
              className={`flex min-h-24 items-center gap-4 rounded-lg border bg-surface p-4 md:gap-2 md:px-3 xl:gap-4 xl:px-4 ${borderClass}`}
            >
              <span className={`grid size-11 shrink-0 place-items-center rounded-full md:size-10 xl:size-11 ${iconClass}`}>
                <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-label text-text-secondary">{label}</p>
                <p className="text-stat tabular-nums">{amount}</p>
                <p className="truncate text-label text-text-muted" title={detail}>
                  {detail}
                </p>
              </div>

              {to && (
                <Link to={to} aria-label={linkLabel} className={button.icon}>
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Start with stacked panels and give the chart the wider column from xl. */}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
        <HoursTracked days={week} goalHours={data.settings.goalHours} />
        <ReadyToInvoice data={data} />
      </div>

      <InvoiceTracker data={data} today={today} />
    </div>
  );
}
