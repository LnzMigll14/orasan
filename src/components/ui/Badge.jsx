import { cn } from './cn'
import { Icon } from './Icon'

/** Status is never color alone: every badge carries a marker glyph and the word. */
const STATUS = {
  draft: { label: 'Draft', icon: 'square-hollow', cls: 'bg-draft-bg text-draft' },
  sent: { label: 'Sent', icon: 'arrow', cls: 'bg-sent-bg text-sent' },
  paid: { label: 'Paid', icon: 'check', cls: 'bg-paid-bg text-paid' },
  overdue: { label: 'Overdue', icon: 'square-filled', cls: 'bg-overdue-bg text-overdue' },
}

export function Badge({ status, className }) {
  const s = STATUS[status]
  return (
    <span
      className={cn(
        'inline-flex h-5 flex-none items-center gap-0.5 rounded-xs pr-2 pl-1 type-label-strong transition-colors duration-150',
        s.cls,
        className,
      )}
    >
      <Icon name={s.icon} size={12} />
      {s.label}
    </span>
  )
}
