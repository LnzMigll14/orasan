import { formatInvoiceDate } from "../../shared/FormatInvoiceDate";
import { formatMoney } from "../../shared/formatMoney";
import { invoiceStatusStyles } from "../invoices/invoiceStatusStyles";

const invoices = [
  {
    id: "INV-0009",
    client: "Reyes Studio",
    issued: "2026-10-24",
    due: "2026-11-07",
    status: "overdue",
    amountMinor: 3_600_000,
    currency: "PHP",
    term: {
      label: "11 days late",
      progress: 100,
      color: "var(--color-overdue)",
    },
  },
  {
    id: "INV-0011",
    client: "Kalye Coffee Co.",
    issued: "2026-11-10",
    due: "2026-11-24",
    status: "sent",
    amountMinor: 855_000,
    currency: "PHP",
    term: { label: "6 days left", progress: 57, color: "var(--color-amber)" },
  },
  {
    id: "INV-0012",
    client: "Northwind Remote LLC",
    issued: "2026-11-13",
    due: "2026-11-27",
    status: "draft",
    amountMinor: 6_900,
    currency: "USD",
    term: null,
  },
] as const;

type InvoiceTrackerProps = {
  onViewAll?: () => void;
};

export function InvoiceTracker({ onViewAll }: InvoiceTrackerProps) {
  const overdueCount = invoices.filter(
    ({ status }) => status === "overdue",
  ).length;

  return (
    <section aria-label="Invoice tracker" className="min-w-0 space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-headline">invoice tracker</h2>

          {overdueCount > 0 && (
            <span className="rounded-pill bg-overdue-tint px-2.5 py-1 text-label font-bold text-overdue">
              {overdueCount} overdue
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onViewAll}
          disabled={!onViewAll}
          className="min-h-11 text-label font-bold text-text-secondary enabled:hover:text-text"
        >
          All invoices
        </button>
      </header>

      <div className="rounded-lg border border-border bg-surface">
        {/* The focusable region lets keyboard users scroll the table horizontally. */}
        <div
          role="region"
          aria-label="Invoice table"
          tabIndex={0}
          className="overflow-x-auto rounded-lg focus-visible:-outline-offset-2"
        >
          <table className="w-full min-w-[760px] text-left">
            <colgroup>
              <col className="w-[21%]" />
              <col className="w-[19%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
            </colgroup>

            <thead className="border-b border-border text-label text-text-secondary">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Invoice
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Payment term
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Issued
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Due
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-body">
              {invoices.map((invoice) => {
                const { label, icon: StatusIcon, colorClass } =
                  invoiceStatusStyles[invoice.status];

                return (
                  <tr key={invoice.id}>
                    <th scope="row" className="px-4 py-4 font-normal">
                      <span className="block font-bold text-text">{invoice.id}</span>
                      <span className="block text-label text-text-muted">{invoice.client}</span>
                    </th>

                    <td className="px-4 py-4">
                      {invoice.term ? (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span
                            aria-hidden="true"
                            className="grid size-[18px] shrink-0 place-items-center rounded-full"
                            style={{
                              background: `conic-gradient(${invoice.term.color} 0 ${invoice.term.progress}%, var(--color-border) ${invoice.term.progress}% 100%)`,
                            }}
                          >
                            <span className="size-3 rounded-full bg-surface" />
                          </span>

                          <span className="font-bold">{invoice.term.label}</span>
                        </div>
                      ) : (
                        <span className="text-text-muted">Not sent</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-text-secondary">
                      <time dateTime={invoice.issued}>
                        {formatInvoiceDate(invoice.issued)}
                      </time>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-text-secondary">
                      <time dateTime={invoice.due}>
                        {formatInvoiceDate(invoice.due)}
                      </time>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill px-2.5 py-1.5 text-label font-bold ${colorClass}`}
                      >
                        <StatusIcon aria-hidden="true" size={14} strokeWidth={1.75} />
                        {label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right font-bold tabular-nums">
                      {formatMoney(invoice.amountMinor, invoice.currency, "narrow")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
