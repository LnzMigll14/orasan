import type { Invoice, Profile } from "../../data/types";
import { formatInvoiceDate } from "../../shared/FormatInvoiceDate";
import { formatMoney } from "../../shared/formatMoney";

export function publicInvoiceUrl(invoice: Invoice) {
  return `${window.location.origin}/i/${invoice.id}`;
}

/** A ready-to-paste message for chat or email. Client-facing, so always English. */
export function invoiceMessage(invoice: Invoice, profile: Profile, overdue: boolean) {
  const amount = formatMoney(invoice.totalMinor, invoice.currency);
  const due = formatInvoiceDate(invoice.dueOn);
  const sender = profile.business || profile.name;
  const greeting = `Hi ${invoice.billedTo.name},`;
  const body = overdue
    ? `A friendly reminder that invoice ${invoice.number} for ${amount} was due on ${due}.`
    : `Here's invoice ${invoice.number} for ${amount}, due on ${due}.`;
  return `${greeting}\n\n${body} You can view it and the payment details here:\n${publicInvoiceUrl(invoice)}\n\nThank you!\n${sender}`;
}
