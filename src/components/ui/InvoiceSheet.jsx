import { IconButton } from './Button'
import { Icon } from './Icon'
import { cn } from './cn'

/**
 * Invoice line item. Responds to the sheet's width (container query), not the viewport,
 * so the same row works in the builder preview, the detail page and the public page.
 */
export function InvoiceLineItem({ head = false, description, period, hours, rate, amount }) {
  if (head) {
    return (
      <div className="flex items-center gap-4 border-b border-ink py-2 type-column-head text-muted" role="row">
        <span className="flex-1" role="columnheader">
          Description
        </span>
        <span className="hidden w-18 text-right @md:block" role="columnheader">
          Hours
        </span>
        <span className="hidden w-24 text-right @md:block" role="columnheader">
          Rate
        </span>
        <span className="w-28 text-right" role="columnheader">
          Amount
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-4 border-b border-rule py-3" role="row">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5" role="cell">
        <span className="type-doc-body text-ink">{description}</span>
        <span className="type-label text-muted">
          {period}
          <span className="@md:hidden">
            {' '}
            · {hours} h × {rate}
          </span>
        </span>
      </span>
      <span className="hidden w-18 text-right type-doc-figure text-ink @md:block" role="cell">
        {hours}
      </span>
      <span className="hidden w-24 text-right type-doc-figure text-ink @md:block" role="cell">
        {rate}
      </span>
      <span className="w-28 text-right type-doc-figure text-ink" role="cell">
        {amount}
      </span>
    </div>
  )
}

function Meta({ label, children, className }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-0.5', className)}>
      <dt className="type-column-head text-muted">{label}</dt>
      <dd className="m-0 type-doc-body text-ink break-words">{children}</dd>
    </div>
  )
}

/**
 * The invoice as a paper document: sender, client, line items, totals, how to pay.
 * Everything here is client-facing, so it stays in English.
 * `onCopy(value, label)` shows a copy button beside each payment detail (public view).
 */
export function InvoiceSheet({ invoice, onCopy, className, statusSlot, headingLevel = 2 }) {
  const Title = `h${headingLevel}`
  const Sub = `h${headingLevel + 1}`
  const { number, issued, due, from, to, lines, subtotal, total, currencyName, methods = [], note, amountLabel = 'Amount due' } = invoice
  return (
    <div className={cn('@container', className)}>
    <article aria-label={`Invoice ${number}`} className="rounded-lg bg-surface p-6 text-ink shadow-card @md:p-10">
      <header className="flex flex-col gap-6 @md:flex-row @md:items-start @md:justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="type-title text-ink">{from.business}</p>
          <p className="type-doc-body text-muted">{from.name}</p>
          <p className="type-doc-body text-muted">{from.email}</p>
          {from.tin ? <p className="type-doc-body text-muted">TIN {from.tin}</p> : null}
        </div>
        <div className="flex flex-col items-start gap-1 @md:items-end">
          <Title className="m-0 type-doc-title text-ink">Invoice {number}</Title>
          {statusSlot}
        </div>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 @md:grid-cols-3">
        <Meta label="Billed to" className="col-span-2 @md:col-span-3">
          {to.name}
          {to.email ? <span className="block text-muted">{to.email}</span> : null}
        </Meta>
        <Meta label="Issued">{issued}</Meta>
        <Meta label="Due">{due}</Meta>
        <Meta label={amountLabel} className="col-span-2 @md:col-span-1 @md:text-right">
          <span className="type-figure-strong">{total}</span>
        </Meta>
      </dl>

      <div className="mt-8" role="table" aria-label="Line items">
        <InvoiceLineItem head />
        {lines.map(({ key, ...l }) => (
          <InvoiceLineItem key={key} {...l} />
        ))}
      </div>

      <div className="mt-4 ml-auto flex w-full max-w-80 flex-col gap-1">
        <div className="flex justify-between type-doc-body text-muted">
          <span>Subtotal</span>
          <span className="type-doc-figure">{subtotal}</span>
        </div>
        <div className="flex justify-between border-t border-ink pt-2">
          <span className="type-title">Total ({currencyName})</span>
          <span className="type-figure-strong">{total}</span>
        </div>
      </div>

      {methods.length ? (
        <section className="mt-10 border-t border-rule pt-6" aria-label="How to pay">
          <Sub className="m-0 type-title text-ink">How to pay</Sub>
          <div className="mt-4 grid gap-6 @xl:grid-cols-2">
            {methods.map((m) => (
              <div key={m.id} className="flex flex-col">
                <p className="type-label-strong text-ink">{m.label}</p>
                <dl className="mt-1">
                  {m.fields.map((f) => (
                    <div key={f.label} className="flex min-h-11 items-center gap-2 border-b border-rule">
                      <dt className="w-28 flex-none type-label text-muted">{f.label}</dt>
                      <dd className="m-0 min-w-0 flex-1 truncate type-doc-figure text-ink">{f.value}</dd>
                      {onCopy && f.copy !== false ? (
                        <IconButton label={`Copy ${m.label} ${f.label.toLowerCase()}`} onClick={() => onCopy(f.value, `${m.label} ${f.label.toLowerCase()}`)}>
                          <Icon name="copy" />
                        </IconButton>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {note ? <p className="mt-8 type-doc-body text-muted">{note}</p> : null}
    </article>
    </div>
  )
}
