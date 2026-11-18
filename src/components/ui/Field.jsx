import { useId } from 'react'
import { cn } from './cn'
import { Icon } from './Icon'

/**
 * Field shell: label above, help or error below. Errors start with "Error:"
 * so the state is never carried by color alone.
 */
function FieldShell({ id, label, help, error, className, children }) {
  const hintId = `${id}-hint`
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label ? (
        <label htmlFor={id} className="type-label text-ink">
          {label}
        </label>
      ) : null}
      {children(hintId)}
      {error ? (
        <p id={hintId} className="type-label text-danger">
          Error: {error}
        </p>
      ) : help ? (
        <p id={hintId} className="type-label text-muted">
          {help}
        </p>
      ) : null}
    </div>
  )
}

const BOX =
  'flex items-center gap-2 rounded-sm border bg-surface px-3 h-(--size-control-touch) md:h-(--size-control) transition-[border-color] duration-100'

function boxState({ error, disabled }) {
  if (disabled) return 'border-rule bg-sunken text-faint'
  if (error) return 'border-danger'
  return 'border-rule-strong focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring'
}

/**
 * Input. `currency` shows the symbol inside and right-aligns the figure (money fields).
 * Mobile uses 16px text so the browser does not zoom on focus.
 */
export function Input({ label, help, error, currency, className, inputClassName, disabled, id: idProp, ...rest }) {
  const auto = useId()
  const id = idProp ?? auto
  const money = Boolean(currency)
  return (
    <FieldShell id={id} label={label} help={help} error={error} className={className}>
      {(hintId) => (
        <div className={cn(BOX, boxState({ error, disabled }))}>
          {money ? <span className="type-figure-mobile text-muted md:type-figure">{currency}</span> : null}
          <input
            id={id}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || help ? hintId : undefined}
            inputMode={money ? 'decimal' : undefined}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none focus-visible:outline-none disabled:cursor-not-allowed',
              money ? 'text-right type-figure-mobile md:type-figure' : 'type-body-mobile md:type-body',
              inputClassName,
            )}
            {...rest}
          />
        </div>
      )}
    </FieldShell>
  )
}

/** Native select, styled. The chevron is the only glyph. */
export function Select({ label, help, error, className, disabled, id: idProp, children, ...rest }) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <FieldShell id={id} label={label} help={help} error={error} className={className}>
      {(hintId) => (
        <div className={cn(BOX, 'relative px-0', boxState({ error, disabled }))}>
          <select
            id={id}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || help ? hintId : undefined}
            className="h-full w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pr-9 pl-3 outline-none type-body-mobile focus-visible:outline-none disabled:cursor-not-allowed md:type-body"
            {...rest}
          >
            {children}
          </select>
          <Icon name="chevron" className="pointer-events-none absolute right-3 text-muted" />
        </div>
      )}
    </FieldShell>
  )
}

/** Square tick box (2px radius). Wrap it in a label row for a 44px target on mobile. */
export function Checkbox({ className, ...rest }) {
  return (
    <span className={cn('relative inline-flex size-4 flex-none', className)}>
      <input
        type="checkbox"
        className="peer absolute inset-0 m-0 cursor-pointer appearance-none rounded-xs border border-rule-strong bg-surface checked:border-accent checked:bg-accent"
        {...rest}
      />
      <Icon
        name="check"
        size={14}
        className="pointer-events-none absolute top-px left-px text-on-accent opacity-0 peer-checked:opacity-100"
      />
    </span>
  )
}

/** On/off switch (role="switch"). The pill track is one of two pill shapes allowed. */
export function Toggle({ checked, onChange, label, id, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 flex-none cursor-pointer items-center rounded-pill px-0.5 transition-colors duration-150',
        checked ? 'bg-accent' : 'bg-rule-strong',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'size-4 rounded-pill bg-surface transition-transform duration-150 ease-(--ease-out)',
          checked && 'translate-x-4',
        )}
      />
    </button>
  )
}
