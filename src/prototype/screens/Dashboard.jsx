import { Link } from 'react-router'
import {
  Avatar,
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  EmptyState,
  Icon,
  ProgressRing,
  StatCard,
  formatDate,
  formatHours,
  formatMoney,
} from '../../components/ui'
import { TODAY } from '../mockData'
import { daysLate, entrySeconds, invoiceClient, invoiceStatus, invoiceTotal, unbilledByClient, unbilledByCurrency } from '../model'
import { useStore } from '../store'

const GOAL_HOURS = 8

/** Sum per currency, never across currencies: "₱42,075" + "and $123". */
function money(rows) {
  if (!rows.length) return { value: '—', note: null }
  const [first, ...rest] = rows
  return {
    value: formatMoney(first.amount, first.currency, { cents: false }),
    note: rest.length ? `and ${rest.map((r) => formatMoney(r.amount, r.currency, { cents: false })).join(', ')}` : null,
  }
}

function byCurrency(state, invoices) {
  const map = new Map()
  for (const i of invoices) {
    const cur = invoiceClient(state, i).currency
    map.set(cur, (map.get(cur) ?? 0) + invoiceTotal(state, i))
  }
  return [...map.entries()]
    .map(([currency, amount]) => ({ currency, amount }))
    .sort((a) => (a.currency === state.profile.defaultCurrency ? -1 : 1))
}

function lastSevenDays(state) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY)
    d.setDate(TODAY.getDate() - (6 - i))
    const key = d.toDateString()
    const secs = state.entries.filter((e) => e.start.toDateString() === key).reduce((s, e) => s + entrySeconds(state, e), 0)
    const value = secs / 3600
    return {
      key,
      label: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      value,
      display: value ? `${value.toFixed(1)} h` : '–',
      active: key === TODAY.toDateString(),
    }
  })
}

/** Share of the payment term that has passed (overdue = 100%). */
function termProgress(inv) {
  const span = inv.due - inv.issued
  return span > 0 ? (TODAY - inv.issued) / span : 1
}

export function Dashboard() {
  const { state } = useStore()
  const first = state.profile.name.split(' ')[0]
  const ready = unbilledByClient(state).sort((a, b) => b.amount - a.amount)
  const open = state.invoices.filter((i) => invoiceStatus(i) !== 'paid')
  const sent = open.filter((i) => ['sent', 'overdue'].includes(invoiceStatus(i)))
  const overdue = open.filter((i) => invoiceStatus(i) === 'overdue')

  if (!ready.length && !state.invoices.length) {
    return (
      <>
        <Header first={first} />
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
      </>
    )
  }

  const unbilled = money(unbilledByCurrency(state))
  const waiting = money(byCurrency(state, sent))
  const late = money(byCurrency(state, overdue))
  const days = lastSevenDays(state)
  const worked = days.filter((d) => d.value)
  const avg = worked.length ? worked.reduce((s, d) => s + d.value, 0) / worked.length : 0

  return (
    <>
      <Header first={first} />

      <section aria-label="Money owed" className="grid gap-3 md:grid-cols-3">
        <StatCard tone="lavender" icon="wallet" label="Unbilled time" value={unbilled.value} note={unbilled.note ?? `${ready.length} clients`} />
        <StatCard tone="blend" icon="sent" label="Waiting on sent invoices" value={waiting.value} note={waiting.note ?? `${sent.length} invoices`} />
        <StatCard
          tone="rose"
          icon="overdue"
          label="Overdue"
          value={late.value}
          note={overdue.length ? (overdue.length === 1 ? `${invoiceClient(state, overdue[0]).name} · ${daysLate(overdue[0])} days late` : `${overdue.length} invoices`) : 'Nothing overdue'}
        />
      </section>

      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card aria-labelledby="hours-h" className="p-5 md:p-6">
          <CardHead id="hours-h" title="Hours tracked">
            <span className="type-label text-muted">Last 7 days</span>
            <span className="ml-3 flex items-baseline gap-1 border-l border-rule pl-3">
              <span className="type-stat text-ink">{avg.toFixed(1)}</span>
              <span className="type-label text-muted">h avg</span>
            </span>
          </CardHead>
          <BarChart
            className="mt-6"
            data={days}
            reference={GOAL_HOURS}
            referenceLabel={`${GOAL_HOURS} h goal`}
            caption="Hours tracked per day, last 7 days"
          />
        </Card>

        <Card aria-labelledby="ready-h" className="flex flex-col p-5 md:p-6">
          <CardHead id="ready-h" title="Ready to invoice">
            <Link to="/clients" className="type-label-strong text-muted no-underline hover-fine:text-ink">
              See all
            </Link>
          </CardHead>
          {ready.length ? (
            <ul className="m-0 mt-2 flex-1 list-none p-0">
              {ready.map((u) => (
                <li key={u.client.id} className="border-b border-rule last:border-b-0">
                  <Link
                    to={`/invoices/new?client=${u.client.id}`}
                    aria-label={`Create invoice for ${u.client.name}, ${formatMoney(u.amount, u.client.currency)} unbilled`}
                    className="-mx-2 flex min-h-(--size-row-touch) items-center gap-3 rounded-md px-2 py-2 no-underline hover-fine:bg-sunken"
                  >
                    <Avatar name={u.client.name} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate type-label-strong text-ink">{u.client.name}</span>
                      <span className="type-label text-muted">
                        {formatHours(u.seconds)} · {u.entries.length} entries
                      </span>
                    </span>
                    <span className="flex flex-col items-end">
                      <span className="type-figure text-ink">{formatMoney(u.amount, u.client.currency)}</span>
                      <span className="type-label text-accent">Invoice</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 type-body text-muted">Nothing unbilled. New time entries show up here.</p>
          )}
          <Button as={Link} to="/clients?new=1" kind="secondary" block className="mt-4">
            <Icon name="plus" />
            Add client
          </Button>
        </Card>
      </div>

      <section aria-labelledby="tracker-h" className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="tracker-h" className="m-0 flex items-center gap-2 type-headline text-ink">
            Invoice tracker
            {overdue.length ? (
              <span className="rounded-pill bg-surface px-2.5 py-0.5 type-label-strong text-overdue shadow-card">{overdue.length} overdue</span>
            ) : null}
          </h2>
          <Link to="/invoices" className="type-label-strong text-muted no-underline hover-fine:text-ink">
            All invoices
          </Link>
        </div>
        <Card as="div" className="overflow-hidden">
          {open.length ? (
            <table className="w-full border-collapse">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-rule type-column-head text-muted">
                  <th scope="col" className="px-5 py-3 text-left font-semibold">Invoice</th>
                  <th scope="col" className="px-3 py-3 text-left font-semibold">Term used</th>
                  <th scope="col" className="px-3 py-3 text-left font-semibold">Issued</th>
                  <th scope="col" className="px-3 py-3 text-left font-semibold">Due</th>
                  <th scope="col" className="px-3 py-3 text-left font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {open
                  .sort((a, b) => a.due - b.due)
                  .map((inv) => {
                    const client = invoiceClient(state, inv)
                    const status = invoiceStatus(inv)
                    return (
                      <tr key={inv.id} className="border-b border-rule last:border-b-0 hover-fine:bg-sunken">
                        <td className="px-5 py-3 md:py-4">
                          <Link to={`/invoices/${inv.id}`} className="flex flex-col no-underline">
                            <span className="type-label-strong text-ink">{inv.number}</span>
                            <span className="type-label text-muted">{client.name}</span>
                          </Link>
                        </td>
                        <td className="hidden px-3 md:table-cell">
                          {status === 'draft' ? (
                            <span className="type-label text-faint">Not sent</span>
                          ) : (
                            <ProgressRing value={termProgress(inv)} tone={status === 'overdue' ? 'rose' : 'accent'} />
                          )}
                        </td>
                        <td className="hidden px-3 type-figure text-muted md:table-cell">{formatDate(inv.issued)}</td>
                        <td className="hidden px-3 type-figure text-muted md:table-cell">{formatDate(inv.due)}</td>
                        <td className="px-3">
                          <Badge status={status} />
                        </td>
                        <td className="px-5 text-right type-figure text-ink">{formatMoney(invoiceTotal(state, inv), client.currency)}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-6 type-body text-muted">No open invoices. Paid ones are under Invoices.</p>
          )}
        </Card>
      </section>
    </>
  )
}

function Header({ first }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col">
        <h1 className="m-0 type-display text-ink">Welcome back, {first}!</h1>
        <p className="type-body text-muted">{TODAY.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>
      <Button as={Link} to="/invoices/new">
        <Icon name="plus" />
        New invoice
      </Button>
    </div>
  )
}
