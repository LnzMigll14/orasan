import { Copy } from "lucide-react";
import type { Currency, InvoiceLine, InvoiceStatus, Payment, PaymentMethod, Profile } from "../../data/types";
import { copyText } from "../../shared/hooks";
import { formatInvoiceDate } from "../../shared/FormatInvoiceDate";
import { formatMoney } from "../../shared/formatMoney";
import { formatDayRange } from "../../shared/time";
import { toast } from "../../shared/components/Toast";
import { invoiceStatusStyles } from "./invoiceStatusStyles";

export type InvoiceDocumentProps = {
  profile: Profile;
  number: string;
  status: InvoiceStatus;
  currency: Currency;
  issuedOn: string;
  dueOn: string;
  billedTo: { name: string; email: string };
  lines: InvoiceLine[];
  totalMinor: number;
  payment: Payment | null;
  /** All of the user's methods; only enabled ones in the invoice's currency are shown. */
  paymentMethods: PaymentMethod[];
  /** Show copy buttons beside payment details (the client-facing page). */
  copyable?: boolean;
};

const paperStatus: Record<InvoiceStatus, string> = {
  draft: "bg-paper-draft-tint text-paper-ink",
  sent: "bg-paper-draft-tint text-paper-ink",
  overdue: "bg-paper-overdue-tint text-paper-overdue",
  paid: "bg-paper-paid-tint text-paper-paid",
};

const hours = (minutes: number) => `${Number((minutes / 60).toFixed(2))} h`;

/** The invoice as the client sees it: a light paper document, always in English. */
export function InvoiceDocument(props: InvoiceDocumentProps) {
  const { profile, number, status, currency, issuedOn, dueOn, billedTo, lines, totalMinor, payment, copyable } = props;
  const methods = props.paymentMethods.filter((method) => method.enabled && method.currency === currency);
  const { label, icon: StatusIcon } = invoiceStatusStyles[status];

  return (
    <article
      aria-label={`Invoice ${number}`}
      className="invoice-document rounded-xl bg-paper p-6 text-paper-ink md:p-10 print:rounded-none print:p-0"
    >
      <header className="flex flex-col-reverse gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          {profile.business && <p className="text-title">{profile.business}</p>}
          <p className={profile.business ? "text-body text-paper-muted" : "text-title"}>{profile.name}</p>
          <p className="text-body text-paper-muted">{profile.email}</p>
          {profile.tin && <p className="text-body text-paper-muted">TIN {profile.tin}</p>}
        </div>
        <div className="md:text-right">
          <h2 className="text-display">Invoice {number}</h2>
          <span className={`mt-2 inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-label font-bold ${paperStatus[status]}`}>
            <StatusIcon aria-hidden="true" size={13} />
            {label}
          </span>
        </div>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
        <div className="col-span-2">
          <dt className="caps-label text-paper-muted">Billed to</dt>
          <dd className="text-title">{billedTo.name}</dd>
          {billedTo.email && <dd className="text-body text-paper-muted">{billedTo.email}</dd>}
        </div>
        <div>
          <dt className="caps-label text-paper-muted">Issued</dt>
          <dd className="text-body">{formatInvoiceDate(issuedOn)}</dd>
        </div>
        <div>
          <dt className="caps-label text-paper-muted">Due</dt>
          <dd className="text-body">{formatInvoiceDate(dueOn)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="caps-label text-paper-muted">{status === "paid" ? "Amount paid" : "Amount due"}</dt>
          <dd className="figure text-title">{formatMoney(totalMinor, currency)}</dd>
        </div>
        {payment && (
          <div className="col-span-2">
            <dt className="caps-label text-paper-muted">Paid</dt>
            <dd className="text-body">
              {formatInvoiceDate(payment.receivedOn)} via {payment.methodLabel}
              {payment.reference && `, ref. ${payment.reference}`}
            </dd>
          </div>
        )}
      </dl>

      <table className="mt-8 w-full text-left text-body">
        <thead>
          <tr className="border-b-2 border-paper-ink">
            <th scope="col" className="caps-label pb-2 text-paper-muted">Description</th>
            <th scope="col" className="caps-label pb-2 text-right text-paper-muted">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.projectId} className="border-b border-paper-rule">
              <td className="py-3 pr-4">
                <span className="block text-title">{line.description}</span>
                <span className="text-label text-paper-muted">
                  {formatDayRange(line.firstDate, line.lastDate)} · {hours(line.minutes)} × {formatMoney(line.rateMinor, currency)}
                </span>
              </td>
              <td className="figure py-3 text-right align-top whitespace-nowrap">{formatMoney(line.amountMinor, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-6 ml-auto grid max-w-xs gap-2 text-body">
        <div className="flex justify-between gap-4">
          <dt className="text-paper-muted">Subtotal</dt>
          <dd className="figure">{formatMoney(totalMinor, currency)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-paper-ink pt-2 text-title">
          <dt>Total ({currency})</dt>
          <dd className="figure">{formatMoney(totalMinor, currency)}</dd>
        </div>
      </dl>

      {status !== "paid" && (
        <section className="@container mt-10 border-t border-paper-rule pt-6" aria-label="How to pay">
          <h3 className="text-headline">How to pay</h3>
          {methods.length === 0 ? (
            <p className="mt-2 text-body text-paper-muted">Contact {profile.email || profile.name} for payment details.</p>
          ) : (
            // Two columns only when the document itself is wide enough, not the viewport.
            <div className="mt-3 grid gap-6 @lg:grid-cols-2">
              {methods.map((method) => (
                <div key={method.id}>
                  <p className="text-body font-bold">{method.label}</p>
                  <dl className="mt-1">
                    {method.fields.map((field) => (
                      <div key={field.label} className="flex items-center gap-3 border-b border-paper-rule py-2">
                        <dt className="w-28 shrink-0 text-label text-paper-muted">{field.label}</dt>
                        <dd className="min-w-0 flex-1 break-words text-body font-bold">{field.value}</dd>
                        {copyable && field.value && (
                          <button
                            type="button"
                            aria-label={`Copy ${method.label} ${field.label.toLowerCase()}`}
                            onClick={async () => {
                              const copied = await copyText(field.value);
                              toast(copied ? `${field.label} copied` : "Couldn't copy. Select the text instead.", copied ? "success" : "error");
                            }}
                            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-pill text-paper-muted hover-fine:bg-paper-rule hover-fine:text-paper-ink focus-visible:outline-paper-accent print:hidden md:size-9"
                          >
                            <Copy aria-hidden="true" size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}
          <p className="mt-6 text-body text-paper-muted">Please include {number} as the payment reference. Thank you.</p>
        </section>
      )}
    </article>
  );
}
