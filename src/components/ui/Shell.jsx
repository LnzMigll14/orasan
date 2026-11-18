import { useEffect } from 'react'
import { NavLink } from 'react-router'
import { cn } from './cn'

/**
 * Text-only navigation item. Top bar: active = ink + 2px ink underline.
 * Tab bar: 44px+ target, active = ink + 2px top rule. No icons.
 */
export function NavItem({ to, children, placement = 'top', end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center justify-center type-label-strong no-underline transition-colors duration-100',
          placement === 'top' && 'h-(--size-bar) border-b-2 px-3',
          placement === 'tab' && 'h-(--size-tabbar) min-w-0 flex-1 border-t-2 px-1',
          isActive ? 'border-ink text-ink' : 'border-transparent text-muted hover-fine:text-ink',
        )
      }
    >
      {children}
    </NavLink>
  )
}

/** Desktop chrome: wordmark, text nav, and the timer pinned right on every screen. */
export function TopBar({ items, timer, home = '/' }) {
  return (
    <header className="sticky top-0 z-30 hidden h-(--size-bar) items-center gap-6 border-b border-rule bg-surface px-8 md:flex">
      <NavLink to={home} className="type-title text-ink no-underline">
        Orasan
      </NavLink>
      <nav aria-label="Main" className="flex flex-1 items-center">
        {items.map((i) => (
          <NavItem key={i.to} to={i.to} end={i.end}>
            {i.label}
          </NavItem>
        ))}
      </nav>
      {timer}
    </header>
  )
}

/** Mobile chrome: the timer dock sits directly above five text tabs. */
export function TabBar({ items, timer }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      {timer}
      <nav aria-label="Main" className="flex border-t border-rule">
        {items.map((i) => (
          <NavItem key={i.to} to={i.to} end={i.end} placement="tab">
            {i.label}
          </NavItem>
        ))}
      </nav>
    </div>
  )
}

/** App shell: top bar (md+) or dock + tab bar (mobile). Content column is left-aligned, max 1120px. */
export function AppShell({ items, timerBar, timerDock, children }) {
  useEffect(() => {
    // Toasts sit above the dock and tab bar on mobile.
    document.documentElement.style.setProperty('--toast-offset', 'calc(var(--size-bar) + var(--size-tabbar) + 12px)')
    return () => document.documentElement.style.removeProperty('--toast-offset')
  }, [])
  return (
    <div className="min-h-dvh bg-paper">
      <a
        href="#main"
        className="sr-only z-50 bg-surface px-4 py-2 type-label-strong text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <TopBar items={items} timer={timerBar} />
      <main
        id="main"
        tabIndex={-1}
        className="px-4 pt-6 pb-[calc(var(--size-bar)+var(--size-tabbar)+32px)] outline-none md:px-8 md:pt-8 md:pb-16"
      >
        <div className="max-w-(--size-content)">{children}</div>
      </main>
      <TabBar items={items} timer={timerDock} />
    </div>
  )
}

/** Page title row: headline left, actions right. */
export function PageHeader({ title, children, flush = false, className }) {
  return (
    <div className={cn('flex min-h-11 flex-wrap items-center justify-between gap-3', !flush && 'mb-6 md:mb-8', className)}>
      <h1 className="m-0 type-headline text-ink">{title}</h1>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  )
}

/** Section heading inside a page: title + optional figure on the right, ink rule below. */
export function SectionHead({ title, aside, className, id }) {
  return (
    <div className={cn('flex items-end justify-between gap-3 border-b border-rule-strong pb-2', className)}>
      <h2 id={id} className="m-0 type-title text-ink">
        {title}
      </h2>
      {aside ? <span className="type-figure text-muted">{aside}</span> : null}
    </div>
  )
}

/**
 * EmptyState: left-aligned, normal density. One sentence (Taglish allowed), one action,
 * and the real list structure drawn faintly underneath.
 */
export function EmptyState({ headline, detail, action, rows = 3, band = true, className }) {
  const widths = ['w-48', 'w-64', 'w-36', 'w-56']
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-1">
        <p className="type-title text-ink">{headline}</p>
        {detail ? <p className="max-w-[60ch] type-body text-muted">{detail}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
      <div aria-hidden="true" className="opacity-60">
        {band ? <div className="h-9 bg-sunken" /> : null}
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="flex h-(--size-row-touch) items-center justify-between border-b border-rule bg-surface px-4 md:h-(--size-row)"
          >
            <span className={cn('h-2 max-w-[60%] rounded-xs bg-sunken', widths[i % widths.length])} />
            <span className="h-2 w-10 rounded-xs bg-sunken" />
          </div>
        ))}
      </div>
    </div>
  )
}
