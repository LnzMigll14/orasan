import { cn } from './cn'
import { Icon } from './Icon'

/** Status is never color alone: every badge carries a marker glyph and the word. */
const STATUS = {
  draft: { label: 'Draft', icon: 'draft', cls: 'bg-draft-bg text-draft' },
  sent: { label: 'Sent', icon: 'sent', cls: 'bg-sent-bg text-sent' },
  paid: { label: 'Paid', icon: 'paid', cls: 'bg-paid-bg text-paid' },
  overdue: { label: 'Overdue', icon: 'overdue', cls: 'bg-overdue-bg text-overdue' },
}

export function Badge({ status, className }) {
  const s = STATUS[status]
  return (
    <span
      className={cn(
        'inline-flex h-7 flex-none items-center gap-1.5 rounded-pill pr-3 pl-2 type-label-strong transition-colors duration-150',
        s.cls,
        className,
      )}
    >
      <Icon name={s.icon} size={14} />
      {s.label}
    </span>
  )
}
