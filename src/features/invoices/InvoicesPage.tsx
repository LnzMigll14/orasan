import { Plus } from "lucide-react";
import { ProjectSelect } from "../../shared/components/ProjectSelect";
import { StartTimerLink } from "../../shared/components/StartTimerLink";
import { formatInvoiceDate } from "../../shared/FormatInvoiceDate";
import { formatMoney } from "../../shared/formatMoney";
import { invoiceStatusStyles } from "./invoiceStatusStyles";
import { invoicesPageData } from "./invoicesData";

const { invoices } = invoicesPageData;
type Invoice = (typeof invoices)[number];

const overdueCount = invoices.filter(
  ({ status }) => status === "overdue",
).length;

export function InvoicesPage() {
  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-display">Invoices</h1>
          <p className="mt-1 text-body text-text-secondary">
            {invoices.length} invoices - {overdueCount} overdue{" "}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:flex md:width-auto md:items-center md:gap-3">
          <ProjectSelect />

          <StartTimerLink />

          <button
            type="button"
            disabled
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-amber rounded-pill px-4 text-body text-on-amber disabled: cursor-not-allowed font-bold"
          >
            <Plus size={16} aria-hidden="true" />
            Add client
          </button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[42rem] text-left text-body">
          <colgroup>
            <col className="w-[55%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
            <col className="w-[12%]" />
          </colgroup>

          <thead className="border-b border-border bg-raised text-label text-text-muted">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left font-medium">
                Invoice
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-medium">
                Issued
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-medium">
                Due
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-medium">
                Status
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const { label, icon: StatusIcon, borderClass, colorClass } =
    invoiceStatusStyles[invoice.status];

  return (
    <tr className="border-t border-border">
      <th scope="row" className="px-5 py-4">
        <div className="flex flex-col items-start">
          <div className="font-semibold">{invoice.id}</div>
          <div className="text-label font-normal text-text-muted">
            {invoice.client}
          </div>
        </div>
      </th>

      <td className="whitespace-nowrap px-3 py-4 text-left text-muted">
        {formatInvoiceDate(invoice.issued)}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-left text-muted">
        {formatInvoiceDate(invoice.due)}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-left text-muted first-letter:uppercase">
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill border px-2 py-1 text-label font-bold ${borderClass} ${colorClass}`}
        >
          <StatusIcon aria-hidden="true" size={12} strokeWidth={1.75} />
          {label}
        </span>
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-left text-muted tabular-nums text-right font-semibold">
        {formatMoney(invoice.amountMinor, invoice.currency, "narrow")}
      </td>
    </tr>
  );
}
