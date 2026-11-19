import { useEffect } from 'react'
import { NavLink } from 'react-router'
import { Avatar } from './Cards'
import { Icon } from './Icon'
import { cn } from './cn'

/**
 * Navigation item. Sidebar (desktop): icon + label, active = white pill.
 * Tab bar (mobile): icon over label, 44px+ target, active = ink.
 */
export function NavItem({ to, icon, children, placement = 'side', end, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'relative flex items-center no-underline transition-colors duration-100',
          placement === 'side' && 'h-11 gap-3 rounded-pill px-4 type-body',
          placement === 'side' && (isActive ? 'bg-surface text-ink shadow-card type-label-strong' : 'text-muted hover-fine:bg-surface/60 hover-fine:text-ink'),
          placement === 'tab' && 'h-(--size-tabbar) min-w-0 flex-1 flex-col justify-center gap-1 px-1 type-label',
          placement === 'tab' && (isActive ? 'text-ink type-label-strong' : 'text-muted'),
        )
      }
    >
      {({ isActive }) => (
        <>
          {icon ? <Icon name={icon} size={placement === 'tab' ? 20 : 18} strokeWidth={isActive ? 2.25 : 1.75} className={isActive ? 'text-accent' : undefined} /> : null}
          <span className="truncate">{children}</span>
          {badge ? (
            <span className="ml-auto rounded-pill bg-rose-tint px-2 type-label-strong text-overdue">
              {badge}
              <span className="sr-only"> overdue</span>
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  )
}

/** Desktop sidebar: brand, grouped nav, profile at the bottom. */
export function Sidebar({ groups, profile, home = '/' }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-(--size-sidebar) flex-none flex-col border-r border-rule bg-paper px-4 py-6 lg:flex">
      <NavLink to={home} className="mb-8 flex items-center gap-2.5 px-2 no-underline">
        <span className="flex size-8 items-center justify-center rounded-sm bg-cta-fill text-on-cta">
          <Icon name="timer" size={18} strokeWidth={2.25} />
        </span>
        <span className="type-headline text-ink">orasan</span>
      </NavLink>
      <nav aria-label="Main" className="flex flex-1 flex-col gap-6">
        {groups.map((g, i) => (
          <div key={i} className={cn('flex flex-col gap-1', i > 0 && 'border-t border-rule pt-6')}>
            {g.map((item) => (
              <NavItem key={item.to} to={item.to} end={item.end} icon={item.icon} badge={item.badge}>
                {item.label}
              </NavItem>
            ))}
          </div>
        ))}
      </nav>
      {profile ? (
        <div className="flex items-center gap-3 border-t border-rule px-2 pt-5">
          <Avatar name={profile.name} size={40} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate type-label-strong text-ink">{profile.name}</span>
            <span className="truncate type-label text-muted">{profile.email}</span>
          </div>
        </div>
      ) : null}
    </aside>
  )
}

/** Mobile chrome: the timer dock sits directly above the icon tabs. */
export function TabBar({ items, timer }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-surface pb-[env(safe-area-inset-bottom)] shadow-overlay lg:hidden">
      {timer}
      <nav aria-label="Main" className="flex border-t border-rule">
        {items.map((i) => (
          <NavItem key={i.to} to={i.to} end={i.end} icon={i.icon} placement="tab">
            {i.label}
          </NavItem>
        ))}
      </nav>
    </div>
  )
}

/**
 * App shell. Desktop (lg+): sidebar + content with a header strip that holds the timer.
 * Mobile: content + timer dock + tab bar. Content is left-aligned, max 1180px.
 */
export function AppShell({ groups, items, profile, header, timerDock, children }) {
  useEffect(() => {
    document.documentElement.style.setProperty('--toast-offset', 'calc(var(--size-dock) + var(--size-tabbar) + 12px)')
    return () => document.documentElement.style.removeProperty('--toast-offset')
  }, [])
  return (
    <div className="flex min-h-dvh bg-paper">
      <a
        href="#main"
        className="sr-only z-50 rounded-pill bg-surface px-4 py-2 type-label-strong text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Sidebar groups={groups} profile={profile} />
      <div className="min-w-0 flex-1">
        {header ? (
          <header className="sticky top-0 z-20 hidden h-(--size-bar) items-center justify-end gap-3 bg-paper px-8 lg:flex">
            {header}
          </header>
        ) : null}
        <main
          id="main"
          tabIndex={-1}
          className="px-4 pt-6 pb-[calc(var(--size-dock)+var(--size-tabbar)+32px)] outline-none md:px-8 lg:pt-2 lg:pb-16"
        >
          <div className="max-w-(--size-content)">{children}</div>
        </main>
      </div>
      <TabBar items={items} timer={timerDock} />
    </div>
  )
}

/** Page title row: headline left, actions right. */
export function PageHeader({ title, sub, children, flush = false, className }) {
  return (
    <div className={cn('flex min-h-11 flex-wrap items-center justify-between gap-3', !flush && 'mb-6', className)}>
      <div className="flex min-w-0 flex-col">
        <h1 className="m-0 type-display text-ink">{title}</h1>
        {sub ? <p className="type-body text-muted">{sub}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  )
}

/** Section heading inside a page: title + optional figure on the right. */
export function SectionHead({ title, aside, className, id, children }) {
  return (
    <div className={cn('flex min-h-11 items-center justify-between gap-3 pb-2', className)}>
      <h2 id={id} className="m-0 flex items-center gap-2 type-headline text-ink">
        {title}
        {aside ? <span className="rounded-pill bg-surface px-2.5 py-0.5 type-label-strong text-muted shadow-card">{aside}</span> : null}
      </h2>
      {children}
    </div>
  )
}

/**
 * EmptyState: left-aligned, inside a card. One sentence (Taglish allowed), one action,
 * and the real list structure drawn faintly underneath.
 */
export function EmptyState({ headline, detail, action, rows = 3, band = true, className }) {
  const widths = ['w-48', 'w-64', 'w-36', 'w-56']
  return (
    <div className={cn('flex flex-col gap-6 rounded-lg bg-surface p-6 shadow-card', className)}>
      <div className="flex flex-col gap-1">
        <p className="type-title text-ink">{headline}</p>
        {detail ? <p className="max-w-[60ch] type-body text-muted">{detail}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
      {rows ? (
        <div aria-hidden="true" className="opacity-70">
          {band ? <div className="h-9 rounded-sm bg-sunken" /> : null}
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex h-(--size-row) items-center justify-between gap-3 border-b border-rule px-2">
              <span className="flex items-center gap-3">
                <span className="size-8 rounded-pill bg-sunken" />
                <span className={cn('h-2 max-w-[50vw] rounded-pill bg-sunken', widths[i % widths.length])} />
              </span>
              <span className="h-2 w-12 rounded-pill bg-sunken" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
