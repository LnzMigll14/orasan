import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus } from "lucide-react";
import { invoiceStatus } from "../../data/selectors";
import { useAppData } from "../../data/store";
import type { InvoiceStatus } from "../../data/types";
import { EmptyState } from "../../shared/components/EmptyState";
import { PageHeader } from "../../shared/components/PageHeader";
import { todayKey } from "../../shared/time";
import { button } from "../../shared/ui";
import { InvoiceTable } from "./InvoiceTable";

const filters: { id: "all" | InvoiceStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "overdue", label: "Overdue" },
  { id: "sent", label: "Sent" },
  { id: "draft", label: "Drafts" },
  { id: "paid", label: "Paid" },
];

export function InvoicesPage() {
  const data = useAppData();
  const [params, setParams] = useSearchParams();
  const today = todayKey();
  const requested = params.get("status");
  const filter = filters.some((item) => item.id === requested) ? (requested as (typeof filters)[number]["id"]) : "all";

  const { invoices, counts } = useMemo(() => {
    const withStatus = [...data.invoices]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((invoice) => ({ invoice, status: invoiceStatus(invoice, today) }));
    const counts: Record<string, number> = { all: withStatus.length };
    for (const { status } of withStatus) counts[status] = (counts[status] ?? 0) + 1;
    return {
      counts,
      invoices: withStatus.filter(({ status }) => filter === "all" || status === filter).map(({ invoice }) => invoice),
    };
  }, [data.invoices, today, filter]);

  const newInvoice = (
    <Link to="/invoices/new" className={button.primary}>
      <Plus aria-hidden="true" size={16} />
      New invoice
    </Link>
  );

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <PageHeader
        title="Invoices"
        subtitle={`${counts.all} ${counts.all === 1 ? "invoice" : "invoices"} · ${counts.overdue ?? 0} overdue`}
        action={newInvoice}
      />

      {data.invoices.length === 0 ? (
        <EmptyState title="No invoices yet" action={newInvoice}>
          Turn your unbilled time into an invoice, then send your client the link.
        </EmptyState>
      ) : (
        <>
          <nav aria-label="Filter invoices" className="-mx-1 overflow-x-auto px-1">
            <ul className="flex gap-2">
              {filters.map(({ id, label }) => (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={filter === id}
                    onClick={() => setParams(id === "all" ? {} : { status: id }, { replace: true })}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-pill border border-border px-4 text-body font-bold text-text-secondary hover-fine:text-text aria-pressed:border-amber aria-pressed:bg-amber-tint aria-pressed:text-amber md:min-h-10"
                  >
                    {label}
                    <span className="tabular-nums text-label opacity-80">{counts[id] ?? 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {invoices.length === 0 ? (
            <p className="rounded-lg border border-border bg-surface px-5 py-5 text-body text-text-secondary">
              {filter === "overdue" ? "Nothing overdue. Ayos!" : `No ${filters.find((f) => f.id === filter)?.label.toLowerCase()} invoices.`}
            </p>
          ) : (
            <InvoiceTable invoices={invoices} today={today} label="Invoices" />
          )}
        </>
      )}
    </div>
  );
}
