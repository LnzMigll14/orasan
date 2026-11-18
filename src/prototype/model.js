/**
 * Derived data for the prototype: rates, rounding, invoice lines, totals and status.
 * Every total stays in its own currency.
 */
import { formatDate, formatDay, formatDuration, formatHours, formatMoney, formatRange, formatTime } from '../components/ui'
import { TODAY } from './mockData'

export const byId = (list, id) => list.find((x) => x.id === id)

export function projectRate(state, projectId) {
  const p = byId(state.projects, projectId)
  if (!p) return 0
  return p.rate ?? byId(state.clients, p.clientId)?.rate ?? 0
}

export function projectClient(state, projectId) {
  const p = byId(state.projects, projectId)
  return p ? byId(state.clients, p.clientId) : null
}

/** Seconds for an entry, rounded up per the rounding setting. */
export function entrySeconds(state, entry) {
  const raw = Math.max(0, (entry.end - entry.start) / 1000)
  const step = Number(state.settings.rounding)
  if (!step) return raw
  return Math.ceil(raw / (step * 60)) * step * 60
}

export function entryAmount(state, entry) {
  return (entrySeconds(state, entry) / 3600) * projectRate(state, entry.projectId)
}

/** draft | sent | paid | overdue (sent and past due). */
export function invoiceStatus(invoice) {
  if (invoice.status === 'sent' && invoice.due < TODAY) return 'overdue'
  return invoice.status
}

export function daysLate(invoice) {
  return Math.max(0, Math.round((TODAY - invoice.due) / 86400000))
}

/** One line per project from linked entries, plus static lines billed earlier. */
export function invoiceLines(state, invoice) {
  const entries = state.entries.filter((e) => e.invoiceId === invoice.id)
  const groups = new Map()
  for (const e of entries) {
    if (!groups.has(e.projectId)) groups.set(e.projectId, [])
    groups.get(e.projectId).push(e)
  }
  const lines = [...groups.entries()].map(([projectId, list]) => {
    const seconds = list.reduce((s, e) => s + entrySeconds(state, e), 0)
    const rate = projectRate(state, projectId)
    const from = new Date(Math.min(...list.map((e) => e.start)))
    const to = new Date(Math.max(...list.map((e) => e.start)))
    return {
      key: projectId,
      description: byId(state.projects, projectId)?.name ?? 'Work',
      from,
      to,
      hours: seconds / 3600,
      rate,
      amount: (seconds / 3600) * rate,
    }
  })
  const fixed = invoice.staticLines.map((l, i) => ({
    key: `s${i}`,
    description: l.description,
    from: new Date(`${l.from}T09:00:00`),
    to: new Date(`${l.to}T09:00:00`),
    hours: l.hours,
    rate: l.rate,
    amount: l.hours * l.rate,
  }))
  return [...fixed, ...lines]
}

export function invoiceTotal(state, invoice) {
  return invoiceLines(state, invoice).reduce((s, l) => s + l.amount, 0)
}

export function invoiceClient(state, invoice) {
  return byId(state.clients, invoice.clientId)
}

/** Payment methods shown on an invoice: enabled and matching its currency. */
export function methodsFor(state, currency) {
  return state.methods.filter((m) => m.enabled && m.currency === currency && m.fields.some((f) => f.value))
}

const CURRENCY_NAME = { PHP: 'PHP', USD: 'USD' }

/** Shape an invoice for <InvoiceSheet>. */
export function invoiceView(state, invoice) {
  const client = invoiceClient(state, invoice)
  const cur = client.currency
  const lines = invoiceLines(state, invoice)
  const total = lines.reduce((s, l) => s + l.amount, 0)
  return {
    number: invoice.number,
    issued: formatDate(invoice.issued),
    due: formatDate(invoice.due),
    from: state.profile,
    to: { name: client.name, email: client.email },
    currencyName: CURRENCY_NAME[cur],
    amountLabel: invoice.status === 'paid' ? 'Amount paid' : 'Amount due',
    lines: lines.map((l) => ({
      key: l.key,
      description: l.description,
      period: formatRange(l.from, l.to),
      hours: l.hours.toFixed(2),
      rate: formatMoney(l.rate, cur),
      amount: formatMoney(l.amount, cur),
    })),
    subtotal: formatMoney(total, cur),
    total: formatMoney(total, cur),
    methods: methodsFor(state, cur).map((m) => ({
      id: m.id,
      label: m.label,
      fields: m.fields.filter((f) => f.value).map((f) => ({ label: f.label, value: f.value, copy: f.key !== 'bank' })),
    })),
    note: `Please include ${invoice.number} as the payment reference. Thank you.`,
  }
}

/** Unbilled work per client, each in its own currency. */
export function unbilledByClient(state) {
  return state.clients
    .map((client) => {
      const projectIds = state.projects.filter((p) => p.clientId === client.id).map((p) => p.id)
      const entries = state.entries.filter((e) => !e.invoiceId && projectIds.includes(e.projectId))
      const seconds = entries.reduce((s, e) => s + entrySeconds(state, e), 0)
      const amount = entries.reduce((s, e) => s + entryAmount(state, e), 0)
      const since = entries.length ? new Date(Math.min(...entries.map((e) => e.start))) : null
      return { client, entries, seconds, amount, since }
    })
    .filter((x) => x.entries.length)
}

/** Totals per currency: [{ currency, amount, clients }] — never summed across currencies. */
export function unbilledByCurrency(state) {
  const map = new Map()
  for (const u of unbilledByClient(state)) {
    const cur = u.client.currency
    const row = map.get(cur) ?? { currency: cur, amount: 0, clients: 0 }
    row.amount += u.amount
    row.clients += 1
    map.set(cur, row)
  }
  return [...map.values()].sort((a, b) => (a.currency === state.profile.defaultCurrency ? -1 : 1))
}

/** Entries grouped by calendar day, newest first. */
export function groupByDay(state, entries) {
  const sorted = [...entries].sort((a, b) => b.start - a.start)
  const days = []
  for (const e of sorted) {
    const key = e.start.toDateString()
    let d = days.find((x) => x.key === key)
    if (!d) {
      d = { key, date: e.start, entries: [] }
      days.push(d)
    }
    d.entries.push(e)
  }
  return days.map((d) => ({
    ...d,
    label:
      d.key === TODAY.toDateString()
        ? `Today, ${d.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
        : formatDay(d.date),
    total: formatHours(d.entries.reduce((s, e) => s + entrySeconds(state, e), 0)),
  }))
}

/** Row props for <EntryRow>. */
export function entryRowProps(state, entry) {
  const project = byId(state.projects, entry.projectId)
  const client = project ? byId(state.clients, project.clientId) : null
  const invoice = entry.invoiceId ? byId(state.invoices, entry.invoiceId) : null
  return {
    description: entry.description,
    project: project?.name,
    client: client?.name,
    range: `${formatTime(entry.start)}–${formatTime(entry.end)}`,
    duration: formatDuration(entrySeconds(state, entry)),
    billedOn: invoice?.number ?? null,
  }
}

export function projectOptions(state) {
  return state.projects.map((p) => ({ id: p.id, label: `${byId(state.clients, p.clientId)?.name.split(' ')[0]} · ${p.name}` }))
}

export function nextInvoiceNumber(state) {
  return `${state.settings.prefix}${String(state.settings.nextNumber).padStart(4, '0')}`
}

export function publicLink(invoice) {
  return `orasan.app/i/${invoice.token}`
}

/** The ready-to-paste chat message. Client-facing, so English only. */
export function copyMessage(state, invoice) {
  const client = invoiceClient(state, invoice)
  const total = formatMoney(invoiceTotal(state, invoice), client.currency)
  const first = client.contact?.split(' ')[0] ?? 'there'
  return `Hi ${first}, here is invoice ${invoice.number} for ${total}, due ${formatDate(invoice.due)}. You can view it and see payment details here: https://${publicLink(invoice)}. Thank you!`
}

/** Polite overdue reminder, ready to paste. Client-facing, so English only. */
export function reminderMessage(state, invoice) {
  const client = invoiceClient(state, invoice)
  const total = formatMoney(invoiceTotal(state, invoice), client.currency)
  const first = client.contact?.split(' ')[0] ?? 'there'
  return `Hi ${first}, a friendly reminder that invoice ${invoice.number} for ${total} was due on ${formatDate(invoice.due)}. You can view it and the payment details here: https://${publicLink(invoice)}. If you've already paid, please send me the reference number so I can mark it as paid. Thank you!`
}

export { formatHours }
