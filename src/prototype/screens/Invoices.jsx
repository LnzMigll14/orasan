import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  EmptyState,
  EntryRow,
  Input,
  InvoiceSheet,
  LedgerHead,
  PageHeader,
  SectionHead,
  Select,
  cn,
  formatDate,
  formatHours,
  formatMoney,
  useToast,
} from '../../components/ui'
import { TODAY } from '../mockData'
import {
  byId,
  copyMessage,
  entryAmount,
  entryRowProps,
  entrySeconds,
  invoiceClient,
  invoiceStatus,
  invoiceTotal,
  invoiceView,
  methodsFor,
  nextInvoiceNumber,
  publicLink,
} from '../model'
import { useStore } from '../store'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Old status fades out while the new one fades in, in the same place (150ms). */
export function StatusSwap({ status }) {
  const [shown, setShown] = useState(status)
  const [prev, setPrev] = useState(null)
  useEffect(() => {
    if (status === shown) return
    setPrev(shown)
    setShown(status)
    const t = setTimeout(() => setPrev(null), 160)
    return () => clearTimeout(t)
  }, [status, shown])
  return (
    <span className="inline-grid self-start" aria-live="polite">
      {prev ? <Badge status={prev} className="col-start-1 row-start-1 animate-[orasan-out_150ms_var(--ease-out)_forwards]" /> : null}
      <Badge key={shown} status={shown} className={cn('col-start-1 row-start-1', prev && 'animate-[orasan-in_150ms_var(--ease-out)]')} />
    </span>
  )
}

const ORDER = { overdue: 0, draft: 1, sent: 2, paid: 3 }

export function Invoices() {
  const { state } = useStore()
  const rows = [...state.invoices].sort((a, b) => ORDER[invoiceStatus(a)] - ORDER[invoiceStatus(b)] || b.issued - a.issued)
  return (
    <>
      <PageHeader title="Invoices">
        {state.clients.length ? (
          <Button as={Link} to="/invoices/new" kind="secondary">
            New invoice
          </Button>
        ) : null}
      </PageHeader>
      {rows.length ? (
        <div>
          <LedgerHead>
            <span className="w-24">Number</span>
            <span className="flex-1">Client</span>
            <span className="w-28">Due</span>
            <span className="w-24">Status</span>
            <span className="w-32 text-right">Amount</span>
          </LedgerHead>
          <ul className="m-0 list-none p-0">
            {rows.map((inv) => {
              const client = invoiceClient(state, inv)
              const status = invoiceStatus(inv)
              return (
                <li key={inv.id}>
                  <Link
                    to={`/invoices/${inv.id}`}
                    className="flex min-h-(--size-row-touch) items-center gap-3 border-b border-rule bg-surface px-4 py-2 no-underline hover-fine:bg-sunken md:min-h-(--size-row) md:py-0"
                  >
                    <span className="hidden w-24 type-figure text-ink md:block">{inv.number}</span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="type-body-mobile text-ink md:truncate md:type-body">
                        <span className="md:hidden">{inv.number} · </span>
                        {client.name}
                      </span>
                      <span className="flex items-center gap-2 md:hidden">
                        <Badge status={status} />
                        <span className="type-label text-muted">Due {formatDate(inv.due)}</span>
                      </span>
                    </span>
                    <span className="hidden w-28 type-figure text-muted md:block">{formatDate(inv.due)}</span>
                    <span className="hidden w-24 md:block">
                      <Badge status={status} />
                    </span>
                    <span className="w-32 text-right type-figure-mobile text-ink md:type-figure">{formatMoney(invoiceTotal(state, inv), client.currency)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <EmptyState
          headline="Wala pang invoice."
          detail="Invoices you make from tracked time will be listed here with their status."
          action={
            state.clients.length ? (
              <Button as={Link} to="/invoices/new">
                Create invoice
              </Button>
            ) : (
              <Button as={Link} to="/clients">
                Add a client first
              </Button>
            )
          }
        />
      )}
    </>
  )
}

/* ---------------------------------------------------------------- Builder */

export function InvoiceBuilder() {
  const { state, dispatch, newId } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const clientId = params.get('client') ?? ''
  const client = byId(state.clients, clientId)
  const [tab, setTab] = useState('entries')

  const projects = state.projects.filter((p) => p.clientId === clientId)
  const unbilled = useMemo(
    () => state.entries.filter((e) => !e.invoiceId && projects.some((p) => p.id === e.projectId)).sort((a, b) => a.start - b.start),
    [state.entries, projects],
  )
  // Pre-check every unbilled entry for the chosen client.
  const [selected, setSelected] = useState(() => new Set(unbilled.map((e) => e.id)))
  useEffect(() => setSelected(new Set(unbilled.map((e) => e.id))), [clientId]) // eslint-disable-line react-hooks/exhaustive-deps

  const clientsWithWork = state.clients.filter((c) =>
    state.entries.some((e) => !e.invoiceId && byId(state.projects, e.projectId)?.clientId === c.id),
  )

  if (!client) {
    return (
      <>
        <PageHeader title="New invoice" />
        {clientsWithWork.length ? (
          <div className="max-w-100">
            <Select label="Client" value="" onChange={(e) => setParams({ client: e.target.value })}>
              <option value="" disabled>
                Choose a client with unbilled time
              </option>
              {clientsWithWork.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        ) : (
          <EmptyState headline="Nothing to invoice yet." detail="Every tracked entry is already on an invoice." rows={2} band={false} />
        )}
      </>
    )
  }

  const chosen = unbilled.filter((e) => selected.has(e.id))
  const seconds = chosen.reduce((s, e) => s + entrySeconds(state, e), 0)
  const total = chosen.reduce((s, e) => s + entryAmount(state, e), 0)
  const previewState = { ...state, entries: state.entries.map((e) => (selected.has(e.id) ? { ...e, invoiceId: '__preview' } : e)) }
  const draft = {
    id: '__preview',
    number: nextInvoiceNumber(state),
    clientId,
    status: 'draft',
    issued: TODAY,
    due: new Date(TODAY.getTime() + state.settings.dueDays * 86400000),
    staticLines: [],
  }
  const view = invoiceView(previewState, draft)
  const noMethods = methodsFor(state, client.currency).length === 0

  const toggle = (ids, on) =>
    setSelected((s) => {
      const n = new Set(s)
      ids.forEach((id) => (on ? n.add(id) : n.delete(id)))
      return n
    })

  const create = (status) => {
    const id = newId('inv')
    dispatch({ type: 'invoice/create', id, clientId, status, entryIds: [...selected] })
    if (status === 'sent') navigate(`/invoices/${id}/sent`)
    else {
      toast(`Draft ${draft.number} saved.`)
      navigate(`/invoices/${id}`)
    }
  }

  const summary = (
    <div className="flex flex-col gap-4 rounded-md border border-rule bg-surface p-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="type-label text-muted">
          {chosen.length} of {unbilled.length} entries · {formatHours(seconds)}
        </span>
        <span className="type-figure-strong text-ink" aria-live="polite">
          {formatMoney(total, client.currency)}
        </span>
      </div>
      {noMethods ? (
        <p className="type-label text-danger">
          Error: No {client.currency} payment method is on. <Link to="/settings">Turn one on in Settings</Link> so the client knows how to pay.
        </p>
      ) : null}
      <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
        <Button kind="secondary" disabled={!chosen.length} onClick={() => create('draft')}>
          Save draft
        </Button>
        <Button disabled={!chosen.length} onClick={() => create('sent')}>
          Send invoice
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="mb-6 flex flex-col gap-1 md:mb-8">
        <Link to="/" className="type-label text-muted hover-fine:text-ink">
          Dashboard
        </Link>
        <h1 className="m-0 type-headline text-ink">
          New invoice for {client.name} <span className="type-figure text-muted">{draft.number}</span>
        </h1>
      </div>

      <div className="mb-4 lg:hidden">{summary}</div>
      <div role="tablist" aria-label="Builder view" className="mb-4 flex border-b border-rule lg:hidden">
        {[
          ['entries', 'Entries'],
          ['preview', 'Preview'],
        ].map(([k, l]) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn('h-11 flex-1 cursor-pointer border-b-2 type-label-strong', tab === k ? 'border-ink text-ink' : 'border-transparent text-muted')}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)]">
        <div className={cn('flex flex-col gap-6', tab !== 'entries' && 'hidden lg:flex')}>
          {projects.map((p) => {
            const list = unbilled.filter((e) => e.projectId === p.id)
            if (!list.length) return null
            const ids = list.map((e) => e.id)
            const all = ids.every((id) => selected.has(id))
            const sub = list.filter((e) => selected.has(e.id)).reduce((s, e) => s + entryAmount(state, e), 0)
            return (
              <section key={p.id} aria-label={p.name}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 bg-sunken px-4">
                  <Checkbox
                    checked={all}
                    aria-label={`Include all ${p.name} entries`}
                    onChange={(e) => toggle(ids, e.target.checked)}
                  />
                  <span className="flex-1 type-label-strong text-ink">{p.name}</span>
                  <span className="type-figure text-ink">{formatMoney(sub, client.currency)}</span>
                </label>
                {list.map((e) => (
                  <EntryRow
                    key={e.id}
                    {...entryRowProps(state, e)}
                    range={`${formatDate(e.start).replace(/ \d{4}$/, '')}`}
                    showMeta={false}
                    project={null}
                    selectable
                    checked={selected.has(e.id)}
                    onCheckedChange={(on) => toggle([e.id], on)}
                  />
                ))}
              </section>
            )
          })}
        </div>

        <div className={cn('flex flex-col gap-4 lg:self-start', tab !== 'preview' && 'hidden lg:flex')}>
          <div className="sticky top-[calc(var(--size-bar)+16px)] z-10 hidden lg:block">{summary}</div>
          <InvoiceSheet invoice={view} statusSlot={<Badge status="draft" />} />
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- Sent */

export function InvoiceSent() {
  const { id } = useParams()
  const { state } = useStore()
  const toast = useToast()
  const invoice = byId(state.invoices, id)
  const [status, setStatus] = useState('draft')
  useEffect(() => {
    const t = requestAnimationFrame(() => setStatus(invoice ? invoiceStatus(invoice) : 'sent'))
    return () => cancelAnimationFrame(t)
  }, [invoice])
  if (!invoice) return <EmptyState headline="Invoice not found." detail="Reloading resets the prototype data." rows={0} band={false} />
  const client = invoiceClient(state, invoice)
  const link = `https://${publicLink(invoice)}`
  const message = copyMessage(state, invoice)

  const copy = async (text, what) => {
    const ok = await copyText(text)
    toast(ok ? `${what} copied.` : `Could not copy. Select the text and copy it instead.`)
  }

  return (
    <div className="flex max-w-170 flex-col gap-8">
      <div className="flex flex-col gap-3">
        <StatusSwap status={status} />
        <h1 className="m-0 type-headline text-ink">Naipadala na! Share {invoice.number} with {client.name}.</h1>
        <p className="type-body text-muted">
          {formatMoney(invoiceTotal(state, invoice), client.currency)} · due {formatDate(invoice.due)}. Your client opens the link to see the invoice and how to pay.
        </p>
      </div>

      <section aria-labelledby="link-h" className="flex flex-col gap-3">
        <SectionHead id="link-h" title="Invoice link" />
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <code className="flex h-(--size-control-touch) min-w-0 flex-1 items-center truncate rounded-sm border border-rule bg-sunken px-3 font-mono type-body text-ink md:h-(--size-control)">
            {link}
          </code>
          <Button onClick={() => copy(link, 'Link')}>Copy link</Button>
        </div>
      </section>

      <section aria-labelledby="msg-h" className="flex flex-col gap-3">
        <SectionHead id="msg-h" title="Message to paste" />
        <p className="m-0 rounded-sm border border-rule bg-surface p-4 type-body text-ink">{message}</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <Button kind="secondary" onClick={() => copy(message, 'Message')}>
            Copy message
          </Button>
          <Button kind="secondary" onClick={() => toast(`${invoice.number}.pdf downloaded (prototype).`)}>
            Download PDF
          </Button>
        </div>
      </section>

      <div className="flex flex-col gap-2 border-t border-rule pt-6 md:flex-row">
        <Button as={Link} to={`/i/${invoice.token}`} kind="ghost">
          View as client
        </Button>
        <Button as={Link} to={`/invoices/${invoice.id}`} kind="ghost">
          Go to invoice
        </Button>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Detail */

function MarkPaid({ open, onClose, invoice }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const client = invoiceClient(state, invoice)
  const methods = methodsFor(state, client.currency)
  const [method, setMethod] = useState(methods[0]?.id ?? 'other')
  const [reference, setReference] = useState('')
  const [date, setDate] = useState('2026-11-18')
  const [error, setError] = useState(null)
  const label = (m) => {
    const id = m.fields.find((f) => f.key === 'number' || f.key === 'email')?.value
    return id ? `${m.label} — ${id}` : m.label
  }
  const confirm = (e) => {
    e?.preventDefault()
    if (!reference.trim()) {
      setError('Enter the reference number from the receipt.')
      return
    }
    dispatch({ type: 'invoice/paid', id: invoice.id, payment: { method, reference: reference.trim(), date: new Date(`${date}T09:00:00`) } })
    toast(`Bayad na! ${invoice.number} marked as paid.`)
    onClose()
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Mark ${invoice.number} as paid`}
      description={`${client.name} · ${formatMoney(invoiceTotal(state, invoice), client.currency)} · due ${formatDate(invoice.due)}`}
      footer={
        <>
          <Button kind="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={confirm}>Mark as paid</Button>
        </>
      }
    >
      <form onSubmit={confirm} noValidate className="flex flex-col gap-4">
        <Select label="Payment method" value={method} onChange={(e) => setMethod(e.target.value)} data-autofocus>
          {methods.map((m) => (
            <option key={m.id} value={m.id}>
              {label(m)}
            </option>
          ))}
          <option value="other">Other</option>
        </Select>
        <Input
          label="Reference number"
          value={reference}
          error={error}
          help={error ? null : 'From the GCash, bank or Wise receipt.'}
          onChange={(e) => {
            setReference(e.target.value)
            setError(null)
          }}
        />
        <Input label="Date received" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" hidden />
      </form>
    </Dialog>
  )
}

export function InvoiceDetail() {
  const { id } = useParams()
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [paying, setPaying] = useState(false)
  const invoice = byId(state.invoices, id)
  if (!invoice) {
    return (
      <EmptyState
        headline="Invoice not found."
        detail="Reloading resets the prototype data."
        action={
          <Button as={Link} to="/invoices" kind="secondary">
            Back to invoices
          </Button>
        }
        rows={0}
        band={false}
      />
    )
  }
  const client = invoiceClient(state, invoice)
  const status = invoiceStatus(invoice)
  const view = invoiceView(state, invoice)
  const link = `https://${publicLink(invoice)}`
  const method = invoice.payment ? (byId(state.methods, invoice.payment.method)?.label ?? 'Other') : null
  const entries = state.entries.filter((e) => e.invoiceId === invoice.id)

  const history = [
    ['Created', formatDate(invoice.issued)],
    invoice.status !== 'draft' ? ['Sent', formatDate(invoice.issued)] : null,
    status === 'overdue' ? ['Overdue since', formatDate(invoice.due)] : null,
    invoice.payment ? ['Paid', `${formatDate(invoice.payment.date)} · ${method} · ref ${invoice.payment.reference}`] : null,
  ].filter(Boolean)

  return (
    <>
      <div className="mb-6 flex flex-col gap-1 md:mb-8">
        <Link to="/invoices" className="type-label text-muted hover-fine:text-ink">
          Invoices
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="m-0 type-headline text-ink">{invoice.number}</h1>
            <StatusSwap status={status} />
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            {invoice.status === 'draft' ? (
              <Button
                onClick={() => {
                  dispatch({ type: 'invoice/send', id: invoice.id })
                  toast(`${invoice.number} sent.`)
                }}
              >
                Send invoice
              </Button>
            ) : null}
            {['sent', 'overdue'].includes(status) ? (
              <>
                <Button
                  kind="secondary"
                  onClick={async () => {
                    const ok = await copyText(link)
                    toast(ok ? 'Link copied.' : 'Could not copy. Select the link and copy it instead.')
                  }}
                >
                  Copy link
                </Button>
                <Button onClick={() => setPaying(true)} className="order-first md:order-none">
                  Mark as paid
                </Button>
              </>
            ) : null}
            {invoice.status !== 'draft' ? (
              <Button as={Link} to={`/i/${invoice.token}`} kind="ghost">
                View as client
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <InvoiceSheet invoice={view} statusSlot={<StatusSwap status={status} />} />
        <aside className="flex flex-col gap-8">
          <section aria-labelledby="hist-h">
            <SectionHead id="hist-h" title="History" />
            <ol className="m-0 list-none p-0">
              {history.map(([k, v]) => (
                <li key={k} className="flex flex-col gap-0.5 border-b border-rule py-3">
                  <span className={cn('type-label-strong', k.startsWith('Overdue') ? 'text-overdue' : 'text-ink')}>{k}</span>
                  <span className="type-figure text-muted">{v}</span>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="bill-h">
            <SectionHead id="bill-h" title="Billed to" />
            <p className="mt-3 type-body text-ink">
              <Link to={`/clients/${client.id}`}>{client.name}</Link>
            </p>
            <p className="type-body text-muted">{client.email}</p>
            {entries.length ? (
              <p className="mt-2 type-label text-muted">
                {entries.length} time entries are locked to this invoice.
              </p>
            ) : null}
          </section>
        </aside>
      </div>

      {invoice.status !== 'draft' ? <MarkPaid open={paying} onClose={() => setPaying(false)} invoice={invoice} /> : null}
    </>
  )
}
