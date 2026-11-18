import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Badge, Button, InvoiceSheet, formatDate, formatMoney, useToast } from '../../components/ui'
import { invoiceClient, invoiceStatus, invoiceTotal, invoiceView } from '../model'
import { useStore } from '../store'

/**
 * The client's view: no app chrome, a paper document, English only.
 * Payment details for the invoice's currency, each with a copy button.
 */
export function PublicInvoice() {
  const { token } = useParams()
  const { state } = useStore()
  const toast = useToast()
  const invoice = state.invoices.find((i) => i.token === token && i.status !== 'draft')

  useEffect(() => {
    document.documentElement.style.setProperty('--toast-offset', '16px')
  }, [])
  useEffect(() => {
    // Link previews in chat apps show this title.
    if (invoice) document.title = `Invoice ${invoice.number} from ${state.profile.business || state.profile.name}`
  }, [invoice, state.profile])

  if (!invoice) {
    return (
      <main className="min-h-dvh bg-paper px-4 py-16">
        <div className="mx-auto max-w-200">
          <h1 className="m-0 type-headline text-ink">This invoice link is not valid.</h1>
          <p className="mt-2 type-body text-muted">Ask the sender for a new link.</p>
        </div>
      </main>
    )
  }

  const client = invoiceClient(state, invoice)
  const status = invoiceStatus(invoice)
  const total = formatMoney(invoiceTotal(state, invoice), client.currency)
  const copy = async (value, what) => {
    try {
      await navigator.clipboard.writeText(value)
      toast(`${what[0].toUpperCase()}${what.slice(1)} copied.`)
    } catch {
      toast('Could not copy. Select the text and copy it instead.')
    }
  }

  return (
    <main className="min-h-dvh bg-paper px-4 pt-6 pb-16 md:px-8 md:pt-12">
      <div className="mx-auto flex max-w-200 flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="m-0 type-body text-ink">
            {status === 'paid' ? (
              <>Paid in full. Thank you.</>
            ) : (
              <>
                <span className="type-figure-strong">{total}</span>{' '}
                <span className="text-muted">due {formatDate(invoice.due)}</span>
              </>
            )}
          </p>
          <Button kind="secondary" onClick={() => toast(`${invoice.number}.pdf downloaded (prototype).`)}>
            Download PDF
          </Button>
        </div>
        <InvoiceSheet
          invoice={invoiceView(state, invoice)}
          onCopy={status === 'paid' ? undefined : copy}
          statusSlot={status === 'overdue' || status === 'paid' ? <Badge status={status} /> : null}
          headingLevel={1}
        />
        <p className="type-label text-faint">Sent with Orasan</p>
      </div>
    </main>
  )
}
