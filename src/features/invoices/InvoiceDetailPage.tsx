import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Check, ChevronLeft, Copy, Link2, Pencil, Printer, Send, Trash2, Undo2 } from "lucide-react";
import { daysBetween, todayKey } from "../../shared/time";
import { invoiceStatus } from "../../data/selectors";
import { deleteInvoice, markInvoiceUnpaid, sendInvoice, useAppData } from "../../data/store";
import { ConfirmDialog } from "../../shared/components/Modal";
import { toast } from "../../shared/components/Toast";
import { copyText } from "../../shared/hooks";
import { formatInvoiceDate } from "../../shared/FormatInvoiceDate";
import { button, card } from "../../shared/ui";
import { features } from "../../app/features";
import { NotFoundPage } from "../../app/gates";
import { InvoiceDocument } from "./InvoiceDocument";
import { invoiceMessage, publicInvoiceUrl, sentToast } from "./invoiceMessages";
import { MarkPaidDialog } from "./MarkPaidDialog";
import { StatusChip } from "./StatusChip";

const timestampDay = (iso: string) => formatInvoiceDate(iso.slice(0, 10));

export function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const data = useAppData();
  const navigate = useNavigate();
  const [markingPaid, setMarkingPaid] = useState(false);
  const [confirm, setConfirm] = useState<"delete" | "unpay" | null>(null);
  const today = todayKey();

  const invoice = data.invoices.find((item) => item.id === invoiceId);
  if (!invoice) return <NotFoundPage />;

  const status = invoiceStatus(invoice, today);
  const client = data.clients.find((item) => item.id === invoice.clientId);

  async function copy(text: string, what: string) {
    const copied = await copyText(text);
    toast(copied ? `${what} copied` : "Couldn't copy. Your browser blocked the clipboard.", copied ? "success" : "error");
  }

  const history = [
    { label: "Created", detail: timestampDay(invoice.createdAt) },
    ...(invoice.sentAt ? [{ label: "Sent", detail: timestampDay(invoice.sentAt) }] : []),
    ...(status === "overdue"
      ? [{ label: "Overdue since", detail: `${formatInvoiceDate(invoice.dueOn)} · ${daysBetween(invoice.dueOn, today)} days`, tone: "text-overdue" }]
      : invoice.status === "sent"
        ? [{ label: "Due", detail: formatInvoiceDate(invoice.dueOn) }]
        : []),
    ...(invoice.payment
      ? [
          {
            label: "Paid",
            detail: `${formatInvoiceDate(invoice.payment.receivedOn)} · ${invoice.payment.methodLabel}${invoice.payment.reference ? ` · ref. ${invoice.payment.reference}` : ""}`,
            tone: "text-paid",
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <Link to="/invoices" className="-ml-1 mb-1 inline-flex min-h-8 items-center gap-1 text-label font-bold text-text-secondary hover-fine:text-text">
            <ChevronLeft aria-hidden="true" size={14} />
            Invoices
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-display">{invoice.number}</h1>
            <StatusChip status={status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {invoice.status === "draft" ? (
            <>
              <button type="button" onClick={() => setConfirm("delete")} className={button.secondary}>
                <Trash2 aria-hidden="true" size={15} />
                Delete
              </button>
              <Link to={`/invoices/${invoice.id}/edit`} className={button.secondary}>
                <Pencil aria-hidden="true" size={15} />
                Edit entries
              </Link>
              <button
                type="button"
                onClick={() => {
                  sendInvoice(invoice.id);
                  toast(sentToast);
                }}
                className={button.primary}
              >
                <Send aria-hidden="true" size={15} />
                Send invoice
              </button>
            </>
          ) : (
            <>
              {features.publicInvoiceLinks && (
                <button type="button" onClick={() => copy(publicInvoiceUrl(invoice), "Link")} className={button.secondary}>
                  <Link2 aria-hidden="true" size={15} />
                  Copy link
                </button>
              )}
              {invoice.status === "sent" && (
                <button
                  type="button"
                  onClick={() => copy(invoiceMessage(invoice, data.profile, status === "overdue"), status === "overdue" ? "Reminder" : "Message")}
                  className={button.secondary}
                >
                  <Copy aria-hidden="true" size={15} />
                  {status === "overdue" ? "Copy reminder" : "Copy message"}
                </button>
              )}
              {invoice.status === "sent" ? (
                <button type="button" onClick={() => setMarkingPaid(true)} className={button.primary}>
                  <Check aria-hidden="true" size={15} />
                  Mark as paid
                </button>
              ) : (
                <button type="button" onClick={() => setConfirm("unpay")} className={button.secondary}>
                  <Undo2 aria-hidden="true" size={15} />
                  Mark as unpaid
                </button>
              )}
            </>
          )}
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <InvoiceDocument
          profile={data.profile}
          number={invoice.number}
          status={status}
          currency={invoice.currency}
          issuedOn={invoice.issuedOn}
          dueOn={invoice.dueOn}
          billedTo={invoice.billedTo}
          lines={invoice.lines}
          totalMinor={invoice.totalMinor}
          payment={invoice.payment}
          paymentMethods={data.settings.payments}
        />

        <aside className="space-y-4 print:hidden">
          <section aria-labelledby="history-heading" className={`${card} p-5`}>
            <h2 id="history-heading" className="text-headline">
              History
            </h2>
            <ol className="mt-3 divide-y divide-border">
              {history.map((item) => (
                <li key={item.label} className="py-3">
                  <p className={`text-body font-bold ${item.tone ?? ""}`}>{item.label}</p>
                  <p className="text-label text-text-muted">{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="billed-heading" className={`${card} p-5`}>
            <h2 id="billed-heading" className="text-headline">
              Billed to
            </h2>
            {client ? (
              <Link to={`/clients/${client.id}`} className="mt-2 block font-bold hover-fine:underline">
                {invoice.billedTo.name}
              </Link>
            ) : (
              <p className="mt-2 font-bold">{invoice.billedTo.name}</p>
            )}
            <p className="text-label text-text-muted">{invoice.billedTo.email || "No email on file"}</p>
          </section>

          <section className={`${card} space-y-3 p-5`} aria-label="More actions">
            <button type="button" onClick={() => window.print()} className={`${button.secondary} w-full`}>
              <Printer aria-hidden="true" size={15} />
              Print or save PDF
            </button>
            {invoice.status !== "draft" && (
              <>
                <Link to={`/i/${invoice.id}`} className={`${button.ghost} w-full`}>
                  Preview client view
                </Link>
                {!features.publicInvoiceLinks && (
                  <p className="text-label text-text-muted">
                    Your data stays on this device, so clients can't open invoice links yet. Save the PDF and send it with the
                    copied message.
                  </p>
                )}
                <button type="button" onClick={() => setConfirm("delete")} className={`${button.ghost} w-full text-overdue hover-fine:text-overdue`}>
                  <Trash2 aria-hidden="true" size={15} />
                  Delete invoice
                </button>
              </>
            )}
          </section>
        </aside>
      </div>

      {invoice.status === "sent" && <MarkPaidDialog open={markingPaid} invoice={invoice} onClose={() => setMarkingPaid(false)} />}
      <ConfirmDialog
        open={confirm === "delete"}
        title={`Delete ${invoice.number}?`}
        description={`Its ${invoice.entryIds.length} time ${invoice.entryIds.length === 1 ? "entry goes" : "entries go"} back to unbilled time. This can't be undone.`}
        confirmLabel="Delete invoice"
        onConfirm={() => {
          deleteInvoice(invoice.id);
          toast(`${invoice.number} deleted`);
          navigate("/invoices", { replace: true });
        }}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "unpay"}
        title={`Mark ${invoice.number} as unpaid?`}
        description="The payment record is removed and the invoice goes back to sent."
        confirmLabel="Mark as unpaid"
        tone="primary"
        onConfirm={() => {
          markInvoiceUnpaid(invoice.id);
          toast(`${invoice.number} marked as unpaid`);
        }}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}
