import { Link } from 'react-router'
import { Badge, Button, EmptyState, Icon, SectionHead, formatDate, formatHours, formatMoney } from '../../components/ui'
import { daysLate, invoiceClient, invoiceStatus, invoiceTotal, unbilledByClient, unbilledByCurrency } from '../model'
import { useStore } from '../store'

/** "₱47,850 unbilled across 2 clients and $210 from Northwind Remote LLC" — one currency at a time. */
function Statement({ state }) {
  const groups = unbilledByCurrency(state)
  const perClient = unbilledByClient(state)
  const part = (g) => {
    const amount = formatMoney(g.amount, g.currency, { cents: false })
    if (g.clients === 1) {
      const name = perClient.find((u) => u.client.currency === g.currency)?.client.name
      return { amount, rest: `from ${name}` }
    }
    return { amount, rest: `across ${g.clients} clients` }
  }
  const [first, second] = groups.map(part)
  return (
    <h1 className="m-0 max-w-[30ch] type-statement-mobile text-ink md:type-statement">
      {first.amount} <span className="text-muted">unbilled {first.rest}</span>
      {second ? (
        <>
          {' '}
          <span className="text-muted">and</span> {second.amount} <span className="text-muted">{second.rest}</span>
        </>
      ) : null}
    </h1>
  )
}

function Outstanding({ state }) {
  const open = state.invoices.filter((i) => ['sent', 'overdue'].includes(invoiceStatus(i)))
  if (!open.length) return null
  const byCur = new Map()
  for (const i of open) {
    const cur = invoiceClient(state, i).currency
    const row = byCur.get(cur) ?? { total: 0, overdue: 0, count: 0 }
    row.total += invoiceTotal(state, i)
    row.count += 1
    if (invoiceStatus(i) === 'overdue') row.overdue += invoiceTotal(state, i)
    byCur.set(cur, row)
  }
  const overdue = open.filter((i) => invoiceStatus(i) === 'overdue')
  const rows = [...byCur.entries()]
  return (
    <div className="mt-4 flex flex-col gap-1">
      {overdue.length ? (
        <p className="flex flex-wrap items-center gap-x-2 type-title text-ink">
          <Icon name="square-filled" size={12} className="text-overdue" />
          {rows
            .filter(([, r]) => r.overdue)
            .map(([cur, r]) => formatMoney(r.overdue, cur, { cents: false }))
            .join(' and ')}{' '}
          <span className="text-overdue">
            overdue from {overdue.length === 1 ? invoiceClient(state, overdue[0]).name : `${overdue.length} invoices`}
          </span>
        </p>
      ) : null}
      <p className="type-body text-muted">
        {rows.map(([cur, r], idx) => (
          <span key={cur}>
            {idx ? ' ' : ''}
            {formatMoney(r.total, cur)} is waiting on {r.count} sent {r.count === 1 ? 'invoice' : 'invoices'}
            {r.overdue ? ', overdue included' : ''}.
          </span>
        ))}
      </p>
    </div>
  )
}

export function Dashboard() {
  const { state } = useStore()
  const ready = unbilledByClient(state).sort((a, b) => b.since - a.since)
  const overdue = state.invoices.filter((i) => invoiceStatus(i) === 'overdue').sort((a, b) => a.due - b.due)

  if (!ready.length && !state.invoices.length) {
    return (
      <EmptyState
        headline="Wala pang singilin. Nothing to bill yet."
        detail="Track time against a client’s project and it will show up here, ready to invoice."
        action={
          state.projects.length ? (
            <Button as={Link} to="/timer">
              Go to timer
            </Button>
          ) : (
            <Button as={Link} to="/clients?new=1">
              Add a client
            </Button>
          )
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <section aria-label="Money owed">
        {ready.length ? <Statement state={state} /> : <h1 className="m-0 type-statement-mobile text-ink md:type-statement">Everything tracked is invoiced.</h1>}
        <Outstanding state={state} />
      </section>

      <section aria-labelledby="ready-h">
        <SectionHead id="ready-h" title="Ready to invoice" aside={ready.length ? `${ready.length} ${ready.length === 1 ? 'client' : 'clients'}` : null} />
        {ready.length ? (
          <ul className="m-0 list-none p-0">
            {ready.map((u) => (
              <li key={u.client.id}>
                <Link
                  to={`/invoices/new?client=${u.client.id}`}
                  aria-label={`Create invoice for ${u.client.name}, ${formatMoney(u.amount, u.client.currency)} unbilled`}
                  className="group flex min-h-(--size-row-touch) items-center gap-4 border-b border-rule bg-surface px-4 py-3 no-underline hover-fine:bg-sunken md:py-2"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="type-body-mobile text-ink md:type-body">{u.client.name}</span>
                    <span className="type-label text-muted">
                      {formatHours(u.seconds)} since {formatDate(u.since).replace(/ \d{4}$/, '')} · {u.entries.length} entries
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-0.5">
                    <span className="type-figure-mobile text-ink md:type-figure">{formatMoney(u.amount, u.client.currency)}</span>
                    <span className="type-label-strong text-ink underline underline-offset-3 md:hidden">Create invoice</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden h-(--size-control) items-center rounded-sm border border-rule-strong bg-surface px-4 type-button text-ink group-hover:bg-paper md:inline-flex"
                  >
                    Create invoice
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 type-body text-muted">Nothing unbilled. New time entries will show up here.</p>
        )}
      </section>

      <section aria-labelledby="overdue-h">
        <SectionHead id="overdue-h" title="Overdue" aside={overdue.length ? `${overdue.length} ${overdue.length === 1 ? 'invoice' : 'invoices'}` : null} />
        {overdue.length ? (
          <ul className="m-0 list-none p-0">
            {overdue.map((inv) => {
              const client = invoiceClient(state, inv)
              return (
                <li key={inv.id}>
                  <Link
                    to={`/invoices/${inv.id}`}
                    className="flex min-h-(--size-row-touch) items-center gap-4 border-b border-rule bg-surface px-4 py-3 no-underline hover-fine:bg-sunken md:py-2"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="type-body-mobile text-ink md:type-body">
                        {inv.number} · {client.name}
                      </span>
                      <span className="type-label text-muted">
                        {daysLate(inv)} days late · due {formatDate(inv.due)}
                      </span>
                    </div>
                    <span className="type-figure-mobile text-ink md:type-figure">{formatMoney(invoiceTotal(state, inv), client.currency)}</span>
                    <span className="hidden md:block">
                      <Badge status="overdue" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="py-4 type-body text-muted">No overdue invoices.</p>
        )}
      </section>
    </div>
  )
}
