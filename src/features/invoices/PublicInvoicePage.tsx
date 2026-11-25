import { useParams } from "react-router";
import { Printer } from "lucide-react";
import { invoiceStatus } from "../../data/selectors";
import { useAppData } from "../../data/store";
import { Toaster } from "../../shared/components/Toast";
import { todayKey } from "../../shared/time";
import { InvoiceDocument } from "./InvoiceDocument";

/** What the client sees: the invoice alone, no app chrome, with copy buttons for payment details. */
export function PublicInvoicePage() {
  const { invoiceId } = useParams();
  const data = useAppData();
  const invoice = data.invoices.find((item) => item.id === invoiceId && item.status !== "draft");

  return (
    <div className="min-h-dvh bg-paper-rule px-4 py-6 md:py-12 print:bg-white print:p-0">
      <main className="mx-auto max-w-3xl">
        {invoice ? (
          <>
            <InvoiceDocument
              profile={data.profile}
              number={invoice.number}
              status={invoiceStatus(invoice, todayKey())}
              currency={invoice.currency}
              issuedOn={invoice.issuedOn}
              dueOn={invoice.dueOn}
              billedTo={invoice.billedTo}
              lines={invoice.lines}
              totalMinor={invoice.totalMinor}
              payment={invoice.payment}
              paymentMethods={data.settings.payments}
              copyable
            />
            <div className="mt-4 flex justify-center print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill px-4 text-body font-bold text-paper-ink hover-fine:bg-paper"
              >
                <Printer aria-hidden="true" size={16} />
                Print or save as PDF
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-paper p-8 text-paper-ink">
            <h1 className="text-display">Invoice not found</h1>
            <p className="mt-2 text-body text-paper-muted">This invoice link is no longer valid. Contact the sender for a new link.</p>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
