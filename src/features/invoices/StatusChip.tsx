import type { InvoiceStatus } from "../../data/types";
import { invoiceStatusStyles } from "./invoiceStatusStyles";

/** Status is always an icon plus a word, never colour alone. */
export function StatusChip({ status }: { status: InvoiceStatus }) {
  const { label, icon: Icon, colorClass } = invoiceStatusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill px-2.5 py-1 text-label font-bold ${colorClass}`}
    >
      <Icon aria-hidden="true" size={13} strokeWidth={1.75} />
      {label}
    </span>
  );
}
