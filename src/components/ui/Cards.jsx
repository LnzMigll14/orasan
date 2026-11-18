import { Link } from 'react-router'
import { Icon } from './Icon'
import { cn } from './cn'

/** White rounded panel with a soft shadow (hairline border in dark). */
export function Card({ as: As = 'section', className, children, ...rest }) {
  return (
    <As className={cn('rounded-lg bg-surface shadow-card', className)} {...rest}>
      {children}
    </As>
  )
}

/** Card title row: title left, optional controls right. */
export function CardHead({ title, id, children, className }) {
  return (
    <div className={cn('flex min-h-11 flex-wrap items-center justify-between gap-3', className)}>
      <h2 id={id} className="m-0 type-headline text-ink">
        {title}
      </h2>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  )
}

const TONE = {
  rose: 'bg-rose-tint',
  lavender: 'bg-lavender-tint',
  blend: 'bg-linear-to-r from-blend-from to-blend-to',
  plain: 'bg-surface shadow-card',
}

/** Pastel stat card: icon in a white circle, label, big tabular value, small unit. */
export function StatCard({ tone = 'lavender', icon, label, value, unit, note, to, className }) {
  const Root = to ? Link : 'div'
  return (
    <Root
      to={to}
      className={cn(
        'flex min-w-0 items-center gap-3 rounded-lg p-4 no-underline',
        to && 'pressable cursor-pointer ring-rose-ink/0 hover-fine:ring-2 hover-fine:ring-rose-ink/30',
        TONE[tone],
        className,
      )}
    >
      <span className="flex size-10 flex-none items-center justify-center rounded-pill bg-surface text-ink">
        <Icon name={icon} size={18} />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate type-label text-muted">{label}</span>
        <span className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="type-stat text-ink">{value}</span>
          {unit ? <span className="type-label text-muted">{unit}</span> : null}
        </span>
        {note ? <span className="type-label text-muted">{note}</span> : null}
      </div>
      {to ? <Icon name="arrow" size={16} className="ml-auto text-muted" /> : null}
    </Root>
  )
}

const AVATAR_TONES = ['bg-lavender-tint', 'bg-rose-tint', 'bg-tint', 'bg-paid-bg', 'bg-sunken']

/** Initials avatar with a stable pastel tone per name. */
export function Avatar({ name = '', size = 40, className }) {
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  const tone = AVATAR_TONES[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_TONES.length]
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn('inline-flex flex-none items-center justify-center rounded-pill type-label-strong text-ink', tone, className)}
    >
      {initials || '·'}
    </span>
  )
}

const RING = { accent: 'stroke-accent', rose: 'stroke-overdue', paid: 'stroke-paid', muted: 'stroke-rule-strong' }

/** Small progress ring with its percentage beside it (never the ring alone). */
export function ProgressRing({ value, tone = 'accent', label, size = 22 }) {
  const r = 8
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true" className="-rotate-90">
        <circle cx="11" cy="11" r={r} fill="none" strokeWidth="3.5" className="stroke-rule" />
        <circle
          cx="11"
          cy="11"
          r={r}
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          className={RING[tone]}
        />
      </svg>
      <span className="type-figure text-ink">{label ?? `${Math.round(v * 100)}%`}</span>
    </span>
  )
}

/**
 * Bar chart: values printed on the bars, today highlighted, a dashed reference line.
 * data: [{ key, label, value, display, active }]. A hidden table carries the same data.
 */
export function BarChart({ data, max, reference, referenceLabel, caption, unit = 'h', className }) {
  const top = Math.max(max ?? 0, reference ?? 0, ...data.map((d) => d.value)) || 1
  const ceil = Math.ceil(top / 2) * 2
  const ticks = [0, ceil / 4, ceil / 2, (ceil * 3) / 4, ceil].reverse()
  return (
    <figure className={cn('m-0', className)}>
      <div className="flex gap-3" aria-hidden="true">
        <div className="flex h-40 flex-col justify-between pb-0 type-label text-faint md:h-56">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-2 leading-4">
              {Math.round(t * 10) / 10}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="relative flex h-40 items-end gap-2 md:h-56 md:gap-3">
            {reference ? (
              <div
                className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-rose-ink"
                style={{ bottom: `${(reference / ceil) * 100}%` }}
              >
                <span className="absolute -top-3 left-0 rounded-pill bg-rose-ink px-2 py-0.5 type-label-strong text-on-danger">
                  {referenceLabel}
                </span>
              </div>
            ) : null}
            {data.map((d) => {
              const h = d.value ? Math.max(8, (d.value / ceil) * 100) : 6
              return (
                <div key={d.key} className="flex h-full flex-1 flex-col justify-end">
                  <div
                    className={cn(
                      'relative flex justify-center rounded-t-lg rounded-b-sm',
                      d.active
                        ? 'bg-bar-active'
                        : 'bg-bar bg-[repeating-linear-gradient(135deg,var(--color-chart-hatch)_0_2px,transparent_2px_8px)]',
                    )}
                    style={{ height: `${h}%` }}
                  >
                    <span
                      className={cn(
                        'absolute -top-3.5 rounded-pill px-2 py-0.5 type-label-strong whitespace-nowrap shadow-card',
                        d.active ? 'bg-accent text-on-accent' : 'bg-surface text-ink',
                      )}
                    >
                      {d.display}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex gap-2 md:gap-3">
            {data.map((d) => (
              <span key={d.key} className={cn('flex-1 text-center type-label', d.active ? 'type-label-strong text-accent' : 'text-muted')}>
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <th scope="row">{d.label}</th>
              <td>
                {d.display}
                {d.active ? ' (today)' : ''}
              </td>
            </tr>
          ))}
          {reference ? (
            <tr>
              <th scope="row">{referenceLabel}</th>
              <td>
                {reference} {unit}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </figure>
  )
}
