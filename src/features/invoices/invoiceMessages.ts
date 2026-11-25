import { features } from "../../app/features";
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
  // Without shared storage a link would open on this device only, so point to the attached PDF.
  const details = features.publicInvoiceLinks
    ? `You can view it and the payment details here:\n${publicInvoiceUrl(invoice)}`
    : "The invoice is attached as a PDF, with the payment details.";
  return `${greeting}\n\n${body} ${details}\n\nThank you!\n${sender}`;
}

/** Shown after an invoice is marked as sent. */
export const sentToast = features.publicInvoiceLinks
  ? "Invoice ready to send. Copy the link or message to your client."
  : "Invoice marked as sent. Save the PDF and copy the message for your client.";
