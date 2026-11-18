import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  Badge,
  Button,
  DayHeader,
  EmptyState,
  EntryRow,
  Input,
  LedgerHead,
  PageHeader,
  SectionHead,
  Select,
  SlideOver,
  currencySymbol,
  formatHours,
  formatMoney,
  useToast,
} from '../../components/ui'
import { byId, entryRowProps, entrySeconds, groupByDay, invoiceStatus, invoiceTotal, projectRate, unbilledByClient } from '../model'
import { useStore } from '../store'
import { useTimer } from '../useTimer'

function outstanding(state, clientId) {
  return state.invoices
    .filter((i) => i.clientId === clientId && ['sent', 'overdue'].includes(invoiceStatus(i)))
    .reduce((s, i) => s + invoiceTotal(state, i), 0)
}

export function AddClient({ open, onClose }) {
  const { state, dispatch, newId } = useStore()
  const toast = useToast()
  const blank = { name: '', email: '', currency: state.profile.defaultCurrency, rate: '', project: '' }
  const [f, setF] = useState(blank)
  const [errors, setErrors] = useState({})
  const close = () => {
    setF(blank)
    setErrors({})
    onClose()
  }
  const save = (e) => {
    e?.preventDefault()
    const err = {}
    if (!f.name.trim()) err.name = 'Enter the client’s name.'
    if (!(Number(f.rate) > 0)) err.rate = 'Enter an hourly rate above 0.'
    setErrors(err)
    if (Object.keys(err).length) return
    const id = newId('c')
    dispatch({
      type: 'client/add',
      client: { id, name: f.name.trim(), contact: '', email: f.email.trim(), currency: f.currency, rate: Number(f.rate) },
      projects: f.project.trim() ? [{ id: newId('p'), clientId: id, name: f.project.trim(), rate: null }] : [],
    })
    toast(`${f.name.trim()} added.`)
    close()
  }
  return (
    <SlideOver
      open={open}
      onClose={close}
      title="Add client"
      footer={
        <>
          <Button kind="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={save}>Save client</Button>
        </>
      }
    >
      <form onSubmit={save} noValidate className="flex flex-col gap-4">
        <Input label="Client name" data-autofocus value={f.name} error={errors.name} help={errors.name ? null : 'Shown on invoices.'} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <Input label="Billing email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <Select label="Currency" help="Invoices for this client use this currency." value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>
          <option value="PHP">PHP — Philippine peso</option>
          <option value="USD">USD — US dollar</option>
        </Select>
        <Input label="Hourly rate" currency={currencySymbol(f.currency)} placeholder="0.00" value={f.rate} error={errors.rate} help={errors.rate ? null : 'Projects can override this.'} onChange={(e) => setF({ ...f, rate: e.target.value })} />
        <Input label="First project" help="Optional. You can add projects later." value={f.project} onChange={(e) => setF({ ...f, project: e.target.value })} />
        <button type="submit" hidden />
      </form>
    </SlideOver>
  )
}

export function Clients() {
  const { state } = useStore()
  const [adding, setAdding] = useState(false)
  const unbilled = unbilledByClient(state)

  return (
    <>
      <PageHeader title="Clients">
        <Button onClick={() => setAdding(true)}>Add client</Button>
      </PageHeader>
      {state.clients.length ? (
        <div>
          <LedgerHead>
            <span className="flex-1">Client</span>
            <span className="w-32">Rate</span>
            <span className="w-32 text-right">Unbilled</span>
            <span className="w-32 text-right">Outstanding</span>
          </LedgerHead>
          <ul className="m-0 list-none p-0">
            {state.clients.map((c) => {
              const u = unbilled.find((x) => x.client.id === c.id)
              const out = outstanding(state, c.id)
              return (
                <li key={c.id}>
                  <Link
                    to={`/clients/${c.id}`}
                    className="flex min-h-(--size-row-touch) items-center gap-3 border-b border-rule bg-surface px-4 py-2 no-underline hover-fine:bg-sunken md:min-h-(--size-row) md:py-0"
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate type-body-mobile text-ink md:type-body">{c.name}</span>
                      <span className="type-label text-muted md:hidden">
                        {formatMoney(c.rate, c.currency)}/h · {c.currency}
                      </span>
                    </span>
                    <span className="hidden w-32 type-figure text-muted md:block">
                      {formatMoney(c.rate, c.currency)}/h
                    </span>
                    <span className="w-32 text-right type-figure-mobile text-ink md:type-figure">
                      <span className="sr-only">Unbilled </span>
                      {u ? formatMoney(u.amount, c.currency) : <span className="text-faint">—</span>}
                    </span>
                    <span className="hidden w-32 text-right type-figure text-ink md:block">
                      {out ? formatMoney(out, c.currency) : <span className="text-faint">—</span>}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 type-label text-muted md:hidden">Amounts on the right are unbilled.</p>
        </div>
      ) : (
        <EmptyState
          headline="Wala pang kliyente."
          detail="Add a client with their currency and hourly rate, then track time against their projects."
          action={<Button onClick={() => setAdding(true)}>Add client</Button>}
          band={false}
        />
      )}
      <AddClient open={adding} onClose={() => setAdding(false)} />
    </>
  )
}

export function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useStore()
  const { resume } = useTimer()
  const client = byId(state.clients, id)
  if (!client) {
    return (
      <EmptyState
        headline="Client not found."
        detail="It may have been removed in this session. Reloading resets the prototype data."
        action={
          <Button as={Link} to="/clients" kind="secondary">
            Back to clients
          </Button>
        }
        rows={0}
        band={false}
      />
    )
  }
  const projects = state.projects.filter((p) => p.clientId === client.id)
  const pIds = projects.map((p) => p.id)
  const unbilled = state.entries.filter((e) => !e.invoiceId && pIds.includes(e.projectId))
  const unbilledAmount = unbilled.reduce((s, e) => s + (entrySeconds(state, e) / 3600) * projectRate(state, e.projectId), 0)
  const invoices = state.invoices.filter((i) => i.clientId === client.id).sort((a, b) => b.issued - a.issued)

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link to="/clients" className="type-label text-muted hover-fine:text-ink">
          Clients
        </Link>
        <PageHeader title={client.name} className="mt-1">
          {unbilled.length ? <Button onClick={() => navigate(`/invoices/new?client=${client.id}`)}>Create invoice</Button> : null}
        </PageHeader>
        <dl className="-mt-2 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
          {[
            ['Contact', client.contact || '—'],
            ['Email', client.email || '—'],
            ['Rate', `${formatMoney(client.rate, client.currency)}/h · ${client.currency}`],
            ['Unbilled', formatMoney(unbilledAmount, client.currency)],
          ].map(([k, v]) => (
            <div key={k} className="flex min-w-0 flex-col gap-0.5">
              <dt className="type-column-head text-muted">{k}</dt>
              <dd className="m-0 truncate type-figure text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section aria-labelledby="proj-h">
        <SectionHead id="proj-h" title="Projects" aside={`${projects.length}`} />
        <ul className="m-0 list-none p-0">
          {projects.map((p) => {
            const secs = unbilled.filter((e) => e.projectId === p.id).reduce((s, e) => s + entrySeconds(state, e), 0)
            return (
              <li key={p.id} className="flex min-h-(--size-row-touch) items-center gap-3 border-b border-rule bg-surface px-4 md:min-h-(--size-row)">
                <span className="flex-1 truncate type-body-mobile text-ink md:type-body">{p.name}</span>
                <span className="type-figure text-muted">
                  {formatMoney(projectRate(state, p.id), client.currency)}/h{p.rate ? ' (own rate)' : ''}
                </span>
                <span className="w-20 text-right type-figure text-ink">{formatHours(secs)}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="unb-h">
        <SectionHead id="unb-h" title="Unbilled time" aside={formatMoney(unbilledAmount, client.currency)} />
        {unbilled.length ? (
          <div className="mt-2 flex flex-col gap-4">
            {groupByDay(state, unbilled).map((d) => (
              <div key={d.key}>
                <DayHeader label={d.label} total={d.total} />
                {d.entries.map((e) => (
                  <EntryRow key={e.id} {...entryRowProps(state, e)} client={null} onResume={() => resume(e)} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 type-body text-muted">No unbilled time for this client.</p>
        )}
      </section>

      <section aria-labelledby="inv-h">
        <SectionHead id="inv-h" title="Invoices" aside={`${invoices.length}`} />
        {invoices.length ? (
          <ul className="m-0 list-none p-0">
            {invoices.map((i) => (
              <li key={i.id}>
                <Link to={`/invoices/${i.id}`} className="flex min-h-(--size-row-touch) items-center gap-3 border-b border-rule bg-surface px-4 no-underline hover-fine:bg-sunken md:min-h-(--size-row)">
                  <span className="flex-1 type-body-mobile text-ink md:type-body">{i.number}</span>
                  <Badge status={invoiceStatus(i)} />
                  <span className="w-28 text-right type-figure text-ink">{formatMoney(invoiceTotal(state, i), client.currency)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 type-body text-muted">No invoices yet.</p>
        )}
      </section>
    </div>
  )
}
