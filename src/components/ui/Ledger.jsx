import { Button, IconButton } from './Button'
import { Checkbox } from './Field'
import { Icon } from './Icon'
import { cn } from './cn'

/** Sunken band that groups a day of entries. Total is right-aligned, tabular. */
export function DayHeader({ label, total, className }) {
  return (
    <div className={cn('flex h-9 items-center justify-between bg-sunken px-4', className)}>
      <h3 className="type-label-strong text-ink">{label}</h3>
      <span className="type-figure text-ink">
        <span className="sr-only">Total </span>
        {total}
      </span>
    </div>
  )
}

/**
 * EntryRow
 *  normal: description, project · client, time range, duration, Resume
 *  billed: paper fill, faint text, lock + invoice number, no actions
 *  selectable: the whole row is the checkbox's label (invoice builder)
 * Desktop and mobile layouts come from the same markup (md: breakpoint).
 */
export function EntryRow({
  description,
  project,
  client,
  range,
  duration,
  billedOn,
  selectable = false,
  checked = false,
  onCheckedChange,
  onResume,
  showMeta = true,
  className,
}) {
  const billed = Boolean(billedOn)
  const ink = billed ? 'text-faint' : 'text-ink'
  const muted = billed ? 'text-faint' : 'text-muted'
  const Row = selectable ? 'label' : 'div'
  const meta = [project, client].filter(Boolean).join(' · ')

  return (
    <Row
      className={cn(
        'flex min-h-(--size-row-touch) items-center gap-3 border-b border-rule px-4 py-2 md:h-(--size-row) md:min-h-0 md:py-0',
        billed ? 'bg-paper' : 'bg-surface',
        selectable && 'cursor-pointer hover-fine:bg-sunken',
        className,
      )}
    >
      {selectable ? (
        <Checkbox checked={checked} onChange={(e) => onCheckedChange?.(e.target.checked)} aria-label={`Include ${description}`} />
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn('truncate type-body-mobile md:type-body', ink)}>{description}</span>
        <span className={cn('flex min-w-0 items-center gap-1 type-label md:hidden', muted)}>
          {billed ? <Icon name="lock" size={12} /> : null}
          <span className="truncate">
            {[billed ? `On ${billedOn}` : null, showMeta ? meta : project, range].filter(Boolean).join(' · ')}
          </span>
        </span>
      </span>

      {showMeta ? (
        <span className={cn('hidden w-55 flex-none truncate type-label md:block', muted)}>{meta}</span>
      ) : null}
      <span className={cn('hidden w-24 flex-none text-right type-figure md:block', muted)}>{range}</span>
      <span className={cn('w-14 flex-none text-right type-figure-mobile md:type-figure', ink)}>{duration}</span>

      {selectable ? null : (
        <span className="flex flex-none justify-end md:w-28">
          {billed ? (
            <span className="hidden items-center gap-1 type-label text-faint md:inline-flex">
              <Icon name="lock" size={14} />
              On {billedOn}
            </span>
          ) : (
            <>
              <IconButton label={`Resume ${description}`} size="touch" onClick={onResume} className="-mr-2 text-ink md:hidden">
                <Icon name="play" />
              </IconButton>
              <span className="hidden md:contents">
                <Button kind="ghost" onClick={onResume} aria-label={`Resume ${description}`}>
                  Resume
                </Button>
              </span>
            </>
          )}
          {billed ? <span className="sr-only">Billed on {billedOn}. Locked.</span> : null}
        </span>
      )}
    </Row>
  )
}

/** Plain ledger row container for lists (clients, invoices). Hairline below, tabular figures right. */
export function LedgerRow({ as: As = 'div', className, children, ...rest }) {
  return (
    <As
      className={cn(
        'flex min-h-(--size-row-touch) items-center gap-3 border-b border-rule bg-surface px-4 py-2 md:min-h-(--size-row) md:py-0',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  )
}

/** Column heads for a ledger list. Use the same widths as the rows below. */
export function LedgerHead({ className, children }) {
  return (
    <div className={cn('hidden h-9 items-center gap-3 border-b border-rule-strong px-4 type-column-head text-muted md:flex', className)}>
      {children}
    </div>
  )
}
