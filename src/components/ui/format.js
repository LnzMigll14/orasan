/**
 * Money and time formatting. Every amount belongs to one currency; PHP and USD
 * are never added together, so there is no cross-currency helper here on purpose.
 */
const SYMBOL = { PHP: '₱', USD: '$' }

export function currencySymbol(currency) {
  return SYMBOL[currency] ?? ''
}

/** ₱48,200.00 / $1,250.00. `cents: false` drops centavos (dashboard statement only). */
export function formatMoney(amount, currency, { cents = true } = {}) {
  const value = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  })
  return `${amount < 0 ? '−' : ''}${currencySymbol(currency)}${value}`
}

/** Seconds → "2:15" (h:mm), used in rows and day totals. */
export function formatDuration(seconds) {
  const m = Math.round(seconds / 60)
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}

/** Seconds → "02:45:12", the running clock. */
export function formatClock(seconds) {
  const s = Math.max(0, Math.floor(seconds))
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

/** Seconds → "38.5 h" (one decimal) or "18.50" for invoice quantities. */
export function formatHours(seconds, { suffix = true, decimals = 1 } = {}) {
  const h = (seconds / 3600).toFixed(decimals)
  return suffix ? `${h} h` : h
}

/** "9:00" from a Date. */
export function formatTime(date) {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** "Mon, 17 Nov" */
export function formatDay(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** "17 Nov 2026" */
export function formatDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** "3–14 Nov" or "28 Oct – 3 Nov" */
export function formatRange(from, to) {
  const sameMonth = from.getMonth() === to.getMonth()
  const d = (x, m) => x.toLocaleDateString('en-GB', m ? { day: 'numeric', month: 'short' } : { day: 'numeric' })
  return sameMonth ? `${d(from)}–${d(to, true)}` : `${d(from, true)} – ${d(to, true)}`
}
