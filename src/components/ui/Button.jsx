import { forwardRef } from 'react'
import { cn } from './cn'

/**
 * Button: primary (Ledger Green, one per view), secondary, ghost, danger.
 * States: default, hover (one tone deeper), focus (2px focus ring, 2px offset, from base styles), disabled.
 * Size "auto" is 44px on touch widths and 36px from md up; "touch" and "compact" pin one height.
 * Pass `as={Link}` (or "a") to render a link that looks like a button.
 */
const KIND = {
  primary: 'bg-cta-fill text-on-cta hover-fine:bg-cta-deep',
  secondary: 'bg-surface text-ink border border-rule hover-fine:bg-sunken',
  ghost: 'bg-transparent text-ink hover-fine:bg-sunken',
  danger: 'bg-danger text-on-danger hover-fine:bg-danger-deep',
  // Quiet destructive action next to a primary (e.g. Delete entry in a footer).
  'danger-ghost': 'bg-transparent text-danger hover-fine:bg-sunken',
}
const SIZE = {
  auto: 'h-(--size-control-touch) md:h-(--size-control)',
  touch: 'h-(--size-control-touch)',
  compact: 'h-(--size-control)',
}

export const Button = forwardRef(function Button(
  { as: As = 'button', kind = 'primary', size = 'auto', block = false, className, disabled, children, ...rest },
  ref,
) {
  const isButton = As === 'button'
  return (
    <As
      ref={ref}
      type={isButton ? (rest.type ?? 'button') : undefined}
      disabled={isButton ? disabled : undefined}
      aria-disabled={!isButton && disabled ? true : undefined}
      className={cn(
        'pressable inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap type-button no-underline select-none',
        kind === 'ghost' || kind === 'danger-ghost' ? 'px-3' : 'px-5',
        SIZE[size],
        block && 'w-full',
        disabled
          ? cn('cursor-not-allowed text-faint', kind === 'ghost' || kind === 'danger-ghost' ? 'bg-transparent' : 'bg-sunken')
          : cn('cursor-pointer', KIND[kind]),
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  )
})

/** Square ghost button for close and copy. Always pass `label` (its accessible name). */
export function IconButton({ label, size = 'auto', className, children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'pressable inline-flex flex-none cursor-pointer items-center justify-center rounded-pill text-muted hover-fine:bg-sunken hover-fine:text-ink',
        size === 'auto' && 'size-(--size-control-touch) md:size-(--size-control)',
        size === 'touch' && 'size-(--size-control-touch)',
        size === 'compact' && 'size-(--size-control)',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
