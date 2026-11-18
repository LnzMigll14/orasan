import {
  AlarmClock,
  ArrowRight,
  Ban,
  Bell,
  Check,
  ChevronDown,
  CircleCheck,
  Clock,
  Copy,
  Ellipsis,
  FilePen,
  FileText,
  Hourglass,
  LayoutGrid,
  Lock,
  LogOut,
  Mail,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Square,
  Timer,
  TriangleAlert,
  Users,
  Wallet,
  X,
} from 'lucide-react'

/**
 * One icon set (Lucide), one stroke. Icons label navigation, stat cards, status and actions.
 * Old glyph names map onto Lucide so existing screens keep working.
 */
const ICONS = {
  // status
  draft: FilePen,
  sent: Send,
  paid: CircleCheck,
  overdue: TriangleAlert,
  missed: Ban,
  // actions and glyphs
  check: Check,
  arrow: ArrowRight,
  'square-hollow': FilePen,
  'square-filled': TriangleAlert,
  lock: Lock,
  copy: Copy,
  chevron: ChevronDown,
  close: X,
  play: Play,
  stop: Square,
  plus: Plus,
  mail: Mail,
  more: Ellipsis,
  search: Search,
  bell: Bell,
  logout: LogOut,
  // navigation and stats
  dashboard: LayoutGrid,
  timer: Timer,
  clients: Users,
  invoices: FileText,
  settings: Settings,
  wallet: Wallet,
  clock: Clock,
  hourglass: Hourglass,
  alarm: AlarmClock,
}

export function Icon({ name, size = 16, className, title, strokeWidth = 1.75 }) {
  const C = ICONS[name]
  if (!C) return null
  return (
    <C
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? 'img' : undefined}
      focusable="false"
      style={{ flex: 'none' }}
    />
  )
}
