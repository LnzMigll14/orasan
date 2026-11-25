import { Link } from "react-router";
import { invoiceStatus } from "../../data/selectors";
import type { Invoice } from "../../data/types";
import { formatInvoiceDate } from "../../shared/FormatInvoiceDate";
import { formatMoney } from "../../shared/formatMoney";
import { StatusChip } from "./StatusChip";

/** A list of invoices; each row opens the invoice. Phones get stacked cards so status and amount stay visible. */
export function InvoiceTable({ invoices, today, label }: { invoices: readonly Invoice[]; today: string; label: string }) {
  return (
    <>
      <ul aria-label={label} className="divide-y divide-border rounded-lg border border-border bg-surface md:hidden">
        {invoices.map((invoice) => (
          <li key={invoice.id} className="relative">
            <Link to={`/invoices/${invoice.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 px-4 py-3">
              <span className="truncate font-semibold">{invoice.number}</span>
              <span className="text-right font-bold tabular-nums">
                {formatMoney(invoice.totalMinor, invoice.currency, "narrow")}
              </span>
              <span className="truncate text-label text-text-muted">
                {invoice.billedTo.name} · due {formatInvoiceDate(invoice.dueOn)}
              </span>
              <span className="justify-self-end">
                <StatusChip status={invoiceStatus(invoice, today)} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div role="region" aria-label={label} tabIndex={0} className="hidden overflow-x-auto rounded-lg border border-border bg-surface focus-visible:-outline-offset-2 md:block">
        <table className="w-full min-w-[42rem] text-left text-body">
          <colgroup>
            <col className="w-[46%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead className="border-b border-border bg-raised text-label text-text-muted">
            <tr>
              <th scope="col" className="px-5 py-2.5 font-medium">Invoice</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Issued</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Due</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
              <th scope="col" className="px-5 py-2.5 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="relative border-t border-border first:border-t-0 hover-fine:bg-raised">
                <th scope="row" className="px-5 py-4 font-normal">
                  {/* The link stretches over the row so the whole row opens the invoice. */}
                  <Link to={`/invoices/${invoice.id}`} className="block font-semibold text-text after:absolute after:inset-0">
                    {invoice.number}
                  </Link>
                  <div className="text-label text-text-muted">{invoice.billedTo.name}</div>
                </th>
                <td className="whitespace-nowrap px-3 py-4 text-text-secondary">
                  <time dateTime={invoice.issuedOn}>{formatInvoiceDate(invoice.issuedOn)}</time>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-text-secondary">
                  <time dateTime={invoice.dueOn}>{formatInvoiceDate(invoice.dueOn)}</time>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <StatusChip status={invoiceStatus(invoice, today)} />
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums">
                  {formatMoney(invoice.totalMinor, invoice.currency, "narrow")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
