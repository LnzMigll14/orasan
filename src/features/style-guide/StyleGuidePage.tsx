import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Logo, LogoMark } from '../../shared/components/brand/Logo'

/**
 * The style guide shows samples of Orasan's design tokens and their Tailwind classes.
 * Keep the listed samples in sync with src/shared/styles/tokens.css. DESIGN.md explains their intended use.
 */

const COLOR_GROUPS = [
  {
    title: 'Layers',
    note: 'Canvas is the page; cards sit on surface; inputs, pills and overlays on raised.',
    colors: [
      ['canvas', '#0B0D12', 'Page background'],
      ['surface', '#12151C', 'Cards, lists'],
      ['raised', '#191D27', 'Inputs, pills, dialogs'],
      ['border', '#262B38', 'Card outlines, dividers'],
      ['border-strong', '#646B80', 'Input outlines (3:1)'],
    ],
  },
  {
    title: 'Text',
    note: 'Small muted text uses text-muted. The decorative muted value is never used for small text.',
    colors: [
      ['text', '#ECEEF3', 'Primary text'],
      ['text-secondary', '#9BA2B3', 'Secondary text'],
      ['text-muted', '#858CA0', 'Small muted text (4.5:1+)'],
      ['muted', '#6B7286', 'Decorative only'],
    ],
  },
  {
    title: 'Brand accent',
    note: 'One amber call to action per view. Amber also marks today and the running timer.',
    colors: [
      ['amber', '#F2B256', 'Primary action, today'],
      ['amber-hover', '#F6C47A', 'Primary hover'],
      ['on-amber', '#1A1206', 'Text on amber'],
      ['amber-tint', '#312B24', 'Running band, icon circle'],
    ],
  },
  {
    title: 'Status',
    note: 'Always paired with an icon and a word, never color alone.',
    colors: [
      ['overdue', '#F2667A', 'Overdue'],
      ['overdue-tint', '#312029', 'Overdue chip'],
      ['sent', '#6CA6F7', 'Sent'],
      ['sent-tint', '#1F293B', 'Sent chip'],
      ['paid', '#4BD394', 'Paid'],
      ['paid-tint', '#1A302D', 'Paid chip'],
      ['draft', '#9BA2B3', 'Draft'],
      ['draft-tint', '#252931', 'Draft chip'],
    ],
  },
  {
    title: 'Paper',
    note: 'The invoice is drawn on paper, because clients read and print it as a document.',
    colors: [
      ['paper', '#F4F2EC', 'Invoice sheet'],
      ['paper-ink', '#1A1C22', 'Invoice text'],
      ['paper-muted', '#5E6270', 'Invoice labels'],
      ['paper-rule', '#DEDAD0', 'Line dividers'],
      ['paper-overdue', '#A61E35', 'Overdue on paper'],
      ['paper-paid', '#17694A', 'Paid on paper'],
    ],
  },
] as const

// Each typography sample pairs a utility class with its specification and preview text.
const TYPE = [
  ['text-display', '28 / 36 · 800', 'Welcome back, Mika'],
  ['text-stat', '26 / 34 · 800', '₱42,075.00'],
  ['text-timer', '48 / 56 · 800', '01:24:07'],
  ['text-headline', '18 / 26 · 700', 'Ready to invoice'],
  ['text-title', '15 / 22 · 700', 'Tue 17 Nov'],
  ['text-body', '14 / 20 · 500', 'Inbox triage and client replies'],
  ['text-body-mobile', '16 / 24 · 500', 'Inputs on phones use 16px'],
  ['text-label', '12 / 16 · 500', 'VA retainer · Northwind Remote LLC'],
  ['text-micro', '11 / 14 · 500', 'Tab labels, chart ticks'],
] as const

const RADII = [
  ['rounded-xs', '4px', 'Checkbox'],
  ['rounded-sm', '8px', 'Brand mark'],
  ['rounded-md', '12px', 'Inputs'],
  ['rounded-lg', '16px', 'Cards, invoice'],
  ['rounded-xl', '20px', 'Dialog'],
  ['rounded-pill', '999px', 'Buttons, chips'],
] as const

type SectionProps = {
  title: string
  note?: string
  children: ReactNode
}

function Section({ title, note, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-headline text-text">{title}</h2>
        {note ? <p className="max-w-[60ch] text-label text-text-muted">{note}</p> : null}
      </div>
      {children}
    </section>
  )
}

type SwatchProps = {
  name: string
  hex: string
  use: string
}

function Swatch({ name, hex, use }: SwatchProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface p-3 shadow-card">
      <span className="size-12 flex-none rounded-md shadow-card" style={{ background: hex }} />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-label font-bold text-text">{name}</span>
        <code className="text-label text-text-secondary">{hex}</code>
        <span className="truncate text-label text-text-muted">{use}</span>
      </span>
    </div>
  )
}

export function StyleGuidePage() {
  return (
    <main className="mx-auto flex w-full max-w-(--size-content) flex-col gap-12 px-4 py-8 md:px-8 md:py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display text-text">Style guide</h1>
          <p className="text-text-secondary">
            Midnight amber tokens and their Tailwind classes. See <code>src/shared/styles/tokens.css</code> and DESIGN.md.
          </p>
        </div>
        <Link to="/" className="inline-flex min-h-11 items-center text-label font-bold text-text-secondary hover-fine:text-text">
          Back to home
        </Link>
      </header>

      <Section title="Brand" note="Amber rounded square with a timer glyph, and the lowercase wordmark. Favicon: public/favicon.svg.">
        <div className="flex flex-wrap items-center gap-8 rounded-lg bg-surface p-6 shadow-card">
          <Logo />
          <Logo size={44} />
          <LogoMark size={56} />
          <LogoMark size={24} />
        </div>
      </Section>

      {COLOR_GROUPS.map(({ title, note, colors }) => (
        <Section key={title} title={title} note={note}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {colors.map(([name, hex, use]) => (
              <Swatch key={name} name={name} hex={hex} use={use} />
            ))}
          </div>
          {/* Use the first token in each group to demonstrate how Tailwind names its utilities. */}
          <p className="text-label text-text-muted">
            Use as <code className="text-text-secondary">bg-{colors[0][0]}</code>,{' '}
            <code className="text-text-secondary">text-{colors[0][0]}</code>,{' '}
            <code className="text-text-secondary">border-{colors[0][0]}</code>, and so on.
          </p>
        </Section>
      ))}

      <Section title="Typography" note="Manrope. Each text-* class sets size, line height and weight together; figures are tabular.">
        <div className="flex flex-col divide-y divide-border rounded-lg bg-surface shadow-card">
          {TYPE.map(([cls, spec, sample]) => (
            <div key={cls} className="flex flex-col gap-1 p-4 md:flex-row md:items-baseline md:gap-6">
              <span className="flex w-48 flex-none flex-col">
                <code className="text-label font-bold text-text">{cls}</code>
                <span className="text-label text-text-muted">{spec}</span>
              </span>
              <span className={`${cls} min-w-0 text-text`}>{sample}</span>
            </div>
          ))}
          <div className="flex flex-col gap-1 p-4 md:flex-row md:items-baseline md:gap-6">
            <span className="flex w-48 flex-none flex-col">
              <code className="text-label font-bold text-text">figure</code>
              <span className="text-label text-text-muted">bold, tabular</span>
            </span>
            <span className="figure text-text">₱38,925.00 · $141.00 · 29.5 h</span>
          </div>
          <div className="flex flex-col gap-1 bg-paper p-4 md:flex-row md:items-baseline md:gap-6">
            <span className="flex w-48 flex-none flex-col">
              <code className="text-label font-bold text-paper-ink">caps-label</code>
              <span className="text-label text-paper-muted">invoice labels</span>
            </span>
            <span className="caps-label text-paper-muted">Billed to · Amount due</span>
          </div>
        </div>
      </Section>

      <Section title="Radius" note="Small cuts for controls, larger for cards; pills for anything you press.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {RADII.map(([cls, px, use]) => (
            <div key={cls} className="flex flex-col gap-2">
              <span className={`h-16 bg-raised shadow-card ${cls}`} />
              <code className="text-label font-bold text-text">{cls}</code>
              <span className="text-label text-text-muted">
                {px} · {use}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons and chips (reference)" note="Built from tokens only, to show how they combine. Not components yet.">
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-surface p-6 shadow-card">
          <span className="inline-flex h-(--size-control) items-center rounded-pill bg-amber px-5 font-bold text-on-amber">
            New invoice
          </span>
          <span className="inline-flex h-(--size-control) items-center rounded-pill bg-raised px-5 font-bold text-text shadow-card">
            Start timer
          </span>
          <span className="inline-flex h-7 items-center rounded-pill bg-overdue-tint px-3 text-label font-bold text-overdue">Overdue</span>
          <span className="inline-flex h-7 items-center rounded-pill bg-sent-tint px-3 text-label font-bold text-sent">Sent</span>
          <span className="inline-flex h-7 items-center rounded-pill bg-paid-tint px-3 text-label font-bold text-paid">Paid</span>
          <span className="inline-flex h-7 items-center rounded-pill bg-draft-tint px-3 text-label font-bold text-draft">Draft</span>
        </div>
      </Section>
    </main>
  )
}
