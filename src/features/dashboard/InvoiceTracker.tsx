import { useMemo } from "react";
import { Link } from "react-router";
import { invoiceStatus, paymentTerm } from "../../data/selectors";
import type { AppData } from "../../data/types";
import { formatInvoiceDate } from "../../shared/FormatInvoiceDate";
import { formatMoney } from "../../shared/formatMoney";
import { button } from "../../shared/ui";
import { StatusChip } from "../invoices/StatusChip";

const statusOrder = { overdue: 0, sent: 1, draft: 2, paid: 3 } as const;

/** Unpaid invoices: overdue first, then by due date. */
export function InvoiceTracker({ data, today }: { data: AppData; today: string }) {
  const invoices = useMemo(
    () =>
      data.invoices
        .map((invoice) => ({ invoice, status: invoiceStatus(invoice, today), term: paymentTerm(invoice, today) }))
        .filter(({ status }) => status !== "paid")
        .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.invoice.dueOn.localeCompare(b.invoice.dueOn))
        .slice(0, 6),
    [data.invoices, today],
  );
  const overdueCount = invoices.filter(({ status }) => status === "overdue").length;

  return (
    <section aria-labelledby="invoice-tracker" className="min-w-0 space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-2">
          <h2 id="invoice-tracker" className="text-headline">
            Invoice tracker
          </h2>
          {overdueCount > 0 && (
            <span className="rounded-pill bg-overdue-tint px-2.5 py-1 text-label font-bold text-overdue">
              {overdueCount} overdue
            </span>
          )}
        </div>
        <Link to="/invoices" className={button.link}>
          All invoices
        </Link>
      </header>

      {invoices.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-5 text-body text-text-secondary">
          {data.invoices.length ? "Bayad na lahat! Every invoice is paid." : "No invoices yet. Create one from your unbilled time."}
        </p>
      ) : (
        <div className="rounded-lg border border-border bg-surface">
          {/* The focusable region lets keyboard users scroll the table horizontally. */}
          <div role="region" aria-label="Unpaid invoices" tabIndex={0} className="overflow-x-auto rounded-lg focus-visible:-outline-offset-2">
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
                  <th scope="col" className="px-4 py-3 font-medium">Invoice</th>
                  <th scope="col" className="px-4 py-3 font-medium">Payment term</th>
                  <th scope="col" className="px-4 py-3 font-medium">Issued</th>
                  <th scope="col" className="px-4 py-3 font-medium">Due</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-body">
                {invoices.map(({ invoice, status, term }) => (
                  <tr key={invoice.id} className="relative hover-fine:bg-raised">
                    <th scope="row" className="px-4 py-4 font-normal">
                      {/* The link stretches over the row so the whole row opens the invoice. */}
                      <Link to={`/invoices/${invoice.id}`} className="block font-bold text-text after:absolute after:inset-0">
                        {invoice.number}
                      </Link>
                      <span className="block text-label text-text-muted">{invoice.billedTo.name}</span>
                    </th>
                    <td className="px-4 py-4">
                      {term ? (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span
                            aria-hidden="true"
                            className="grid size-[18px] shrink-0 place-items-center rounded-full"
                            style={{
                              background: `conic-gradient(${term.overdue ? "var(--color-overdue)" : "var(--color-amber)"} 0 ${term.progress}%, var(--color-border) ${term.progress}% 100%)`,
                            }}
                          >
                            <span className="size-3 rounded-full bg-surface" />
                          </span>
                          <span className="font-bold">{term.label}</span>
                        </div>
                      ) : (
                        <span className="text-text-muted">Not sent</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-text-secondary">
                      <time dateTime={invoice.issuedOn}>{formatInvoiceDate(invoice.issuedOn)}</time>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-text-secondary">
                      <time dateTime={invoice.dueOn}>{formatInvoiceDate(invoice.dueOn)}</time>
                    </td>
                    <td className="px-4 py-4">
                      <StatusChip status={status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-bold tabular-nums">
                      {formatMoney(invoice.totalMinor, invoice.currency, "narrow")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
