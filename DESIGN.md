---
name: Orasan
description: Time tracking and invoicing for Filipino freelancers. A calm, soft dashboard where money owed comes first.
colors:
  paper: "#EFEFF5"
  surface: "#FFFFFF"
  sunken: "#F5F5FA"
  rule: "#E6E6EF"
  rule-strong: "#7C7C94"
  ink: "#1B1B29"
  ink-muted: "#5A5A6F"
  ink-faint: "#6B6B80"
  cta: "#1B1B29"
  on-cta: "#FFFFFF"
  accent: "#5357C4"
  accent-tint: "#E8E9FA"
  rose: "#C0285F"
  tint-rose: "#FBE5ED"
  tint-lavender: "#ECEAFB"
  chart-bar: "#F1F1F7"
  chart-active: "#8E92E6"
  status-draft-fg: "#5A5A6F"
  status-draft-bg: "#EFEFF5"
  status-sent-fg: "#4A4EBE"
  status-sent-bg: "#E8E9FA"
  status-paid-fg: "#1D7553"
  status-paid-bg: "#E1F3EA"
  status-overdue-fg: "#C0285F"
  status-overdue-bg: "#FBE5ED"
  dark-paper: "#121219"
  dark-surface: "#1B1B26"
  dark-ink: "#ECECF4"
  dark-cta: "#ECECF4"
  dark-accent: "#A3A6F4"
typography:
  display:
    fontFamily: "Mulish Variable, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: "-0.015em"
  stat:
    fontFamily: "Mulish Variable, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
    fontFeature: "tnum"
  timer:
    fontFamily: "Mulish Variable, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: "52px"
    fontFeature: "tnum"
  headline:
    fontFamily: "Mulish Variable, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
  title:
    fontFamily: "Mulish Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "24px"
  body:
    fontFamily: "Mulish Variable, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  figure:
    fontFamily: "Mulish Variable, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
    fontFeature: "tnum"
  label:
    fontFamily: "Mulish Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "999px"
spacing:
  base: "4px"
components:
  button-primary:
    backgroundColor: "{colors.cta}"
    textColor: "{colors.on-cta}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "40px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  status-chip:
    rounded: "{rounded.pill}"
    height: "28px"
---

# Design System: Orasan

## Overview

**Creative North Star: "The Calm Clinic Desk"**

Orasan looks like a calm, well-kept dashboard: a soft lavender-grey page, white rounded panels that float slightly above it, pastel tints for the numbers that matter, and one dark pill for the main action. The direction came from a reference the user supplied (a health dashboard) and replaced the earlier "paper ledger" look on 18 Nov 2026. That earlier system lives on the `main` branch at commit `14e704f`.

Numbers still lead. The Dashboard opens with three pastel stat cards that answer "how much am I owed?" before anything else: unbilled time, money waiting on sent invoices, and money overdue. Currencies are never added together.

**Key characteristics:**
- Lavender-grey page (`paper`), white panels (`surface`) with a soft two-layer shadow. Dark mode swaps shadows for hairline borders.
- One dark pill call to action per view (`cta`). Periwinkle (`accent`) marks today, the running timer, links and selection.
- Pastel tints (lavender, rose, and a lavender-to-rose blend) only on stat cards.
- Mulish throughout, bold headings, tabular figures for every amount and duration.
- Pills everywhere you click: buttons, chips, the timer's inputs, segmented controls.
- Icons from one set (Lucide, 1.75 stroke) for navigation, stat cards, status chips and actions.

## Colors

### Semantic tokens (Light and Dark)

Source of truth for code: `src/styles/tokens.css`. Every text pair passes WCAG AA (4.5:1) in both modes, and control borders pass 3:1. The Figma file still shows the earlier ledger system and needs rebuilding once Figma is unpaused.

| Token (CSS) | Light | Dark | Use |
|---|---|---|---|
| `--color-bg-paper` | #EFEFF5 | #121219 | Page background |
| `--color-bg-surface` | #FFFFFF | #1B1B26 | Cards, inputs, invoice sheet |
| `--color-bg-sunken` | #F5F5FA | #16161F | Hover rows, total pills, message box |
| `--color-bg-raised` | #FFFFFF | #242432 | Slide-over, dialog |
| `--color-border-rule` | #E6E6EF | #2E2E3E | Row dividers, secondary button outline |
| `--color-border-strong` | #7C7C94 | #77778F | Input and checkbox borders (3:1) |
| `--color-text-ink` | #1B1B29 | #ECECF4 | Primary text and figures |
| `--color-text-muted` | #5A5A6F | #A7A7BD | Secondary text |
| `--color-text-faint` | #6B6B80 | #9090A7 | Placeholders, axis labels, billed rows |
| `--color-cta` / `-on` | #1B1B29 / #FFFFFF | #ECECF4 / #16161F | The one dark pill per view |
| `--color-accent-default` | #5357C4 | #A3A6F4 | Today, links, focus, running timer, toggles |
| `--color-accent-tint` | #E8E9FA | #262848 | Running timer band, sent chip |
| `--color-tint-lavender` | #ECEAFB | #25233B | Stat card |
| `--color-tint-rose` | #FBE5ED | #3B1F2C | Stat card (overdue) |
| `--color-tint-blend-from/to` | #ECEAFB → #F8E7F0 | #25233B → #33202D | Stat card (waiting) |
| `--color-rose` | #C0285F | #F38DB0 | Goal line, overdue |
| `--color-chart-bar` / `-hatch` | #F1F1F7 / #E4E4EE | #22222F / #2C2C3C | Chart bars (hatched) |
| `--color-chart-active` | #8E92E6 | #7D81DC | Today's bar |
| Status draft fg / bg | #5A5A6F / #EFEFF5 | #B5B5C9 / #25252F | Draft chip |
| Status sent fg / bg | #4A4EBE / #E8E9FA | #AEB1F6 / #252849 | Sent chip |
| Status paid fg / bg | #1D7553 / #E1F3EA | #74D4AB / #16302A | Paid chip |
| Status overdue fg / bg | #C0285F / #FBE5ED | #F38DB0 / #3B1F2C | Overdue chip |

### Named rules

**The One Dark Pill Rule.** Each view has at most one `cta` button. Everything else is secondary (white pill with a light outline) or ghost. The idle timer's Start is secondary in the header and dock; only the Timer screen's large timer uses the dark pill.

**The Pastel Is for Numbers Rule.** Lavender, rose and the blend appear only on stat cards. Panels are white; the page is lavender-grey.

**The Label Rule.** Status is never color alone: every chip carries an icon and its word.

**The Disjoint Cards Rule.** The three money cards never overlap: sent-and-not-due excludes overdue, so no amount is counted twice.

**The Separate Currencies Rule.** PHP and USD are never added together. A stat card shows the default currency large and the other below ("and $141").

## Typography

**Font:** Mulish (variable, self-hosted via `@fontsource-variable/mulish`), fallback Avenir Next. Its figures are tabular by default; `font-variant-numeric: tabular-nums` is set anyway on every figure style.

| Style | Weight · size/line | Use |
|---|---|---|
| `type-display` | 700 · 28/36 | Page titles, "Welcome back, Mika!" |
| `type-stat` | 700 · 24/32, tnum | Stat card values, chart average |
| `type-timer` | 700 · 44/52, tnum | Clock on the Timer screen |
| `type-headline` | 700 · 20/28 | Card titles |
| `type-title` | 700 · 16/24 | Day headers, project groups |
| `type-body` / `-mobile` | 500 · 14/20 and 16/24 | Rows and descriptions; inputs are 16px on mobile |
| `type-figure` / `-strong` | 600 · 14/20, 700 · 16/24, tnum | Amounts and durations |
| `type-label` / `-strong` | 500 / 700 · 12/16 | Meta lines, chips, nav |
| `type-column-head` | 600 · 12/16 | Table headers (sentence case) |

**The Format Rule.** Amounts are `₱48,200.00` / `$1,250.00`; stat cards may drop centavos. Durations are `2:45` in rows and `00:01:12` on the clock. Totals (day, week, chart, client, builder summary) are `38.5 h`. The invoice document's Hours column is a billing quantity, written `18.50`.

## Layout

- **Desktop (lg, 1024px+):** a 248px sidebar on the page background with the brand mark, grouped icon nav (Dashboard, Timer, Clients, Invoices; then Settings), an overdue count badge on Invoices, and the profile at the bottom. The content column (max 1180px, left-aligned, 32px side padding) has a header strip holding the timer pill on the right.
- **Mobile and tablet (below lg):** no sidebar. The timer dock (64px) sits directly above an icon-over-label tab bar (64px). Content uses 16px side padding and stacks.
- **Dashboard:** greeting and the dark "New invoice" pill (hidden on first run); three disjoint stat cards (Unbilled · Sent, not due yet · Overdue, which links to the overdue invoice); "Ready to invoice" beside an "Hours tracked" chart (Ready comes first below xl); the "Invoice tracker" table, whose rings read "6 days left" or "11 days late".
- **Spacing:** 4px base. Cards use 20px padding on mobile and 24px on desktop, with 12px gaps between cards.

## Elevation & Depth

Light mode floats white cards on the lavender-grey page with a soft two-layer shadow (`0 1px 2px` + `0 6px 20px` at 4% ink). Overlays and toasts use a deeper shadow. Dark mode is flat: a 1px border in `rule` replaces the card shadow, and overlays use `rule-strong`. No glass, blur or glow.

## Shapes

Radius scale: 4 (checkbox), 8 (brand mark), 12 (inputs, message box), 16 (cards, invoice sheet), 20 (slide-over, dialog, onboarding card), pill (buttons, chips, timer pill, segmented controls, avatars).

## Components

- **Button:** primary = dark pill (`cta`), secondary = white pill with a `rule` outline, ghost, danger, and danger-ghost (quiet delete). 44px on touch widths, 40px from md. Press scales to 0.97.
- **StatCard:** pastel tint, white circular icon, muted label, `type-stat` value, muted note.
- **BarChart:** hatched bars on `chart-bar`; today solid `chart-active` with an accent value pill; values printed on every bar; a dashed rose goal line set in Settings → Daily goal (off hides it); faint axis labels; a screen-reader table with the same data. 160px tall on mobile, 224px from md.
- **Card / CardHead:** white rounded-16 panel; headline title with optional controls on the right.
- **Avatar:** initials on a stable pastel tone. **ProgressRing:** a small ring, always followed by its percentage.
- **Badge (status chip):** pill with icon and word: Draft (file-pen), Sent (send), Paid (circle-check), Overdue (triangle-alert).
- **TimerControl:** header pill (desktop), dock (mobile) and hero card (Timer screen). Running header pill and dock use the accent tint with a pulsing dot; the running hero stays white with a periwinkle clock, a "Tracking" tag and a dark Stop pill (Start and Stop are never visible together).
- **EntryRow:** inside day cards; tap the description to edit; a play button (mobile) or "Resume" (desktop); billed rows are locked with the invoice number.
- **SlideOver / Dialog:** raised, radius 20, overlay shadow; the slide-over floats 8px from the right edge on desktop and is a full sheet on mobile.
- **Sidebar / TabBar / NavItem:** icon + label; the active sidebar item is a white pill.

## Motion

| Moment | What happens | Duration · easing |
|---|---|---|
| Press | scale 0.97 | 160ms · `cubic-bezier(0.23, 1, 0.32, 1)` |
| Timer start/stop | Start and Stop crossfade in place; the band tints | 150ms · same |
| Running dot | opacity pulse | 2s loop |
| Slide-over / dialog | 16px slide or 0.97 scale, with a fade | 220ms in / 160ms out |
| Toast | rises 8px with a fade | 160ms in / 120ms out |
| Status change | chip crossfade | 150ms |

Hover effects apply only on devices that hover. Under reduced motion, movement becomes short fades and the dot stops pulsing.

## Do's and Don'ts

**Do:** lead the Dashboard with the three money stat cards; print values on chart bars; keep one dark pill per view; give every status chip an icon and a word; keep the timer one tap away (header pill, dock).

**Don't:** use Inter, Roboto or system fonts; use glass, blur, glows or blobs; use emoji; add PHP and USD together; use pastel tints on anything but stat cards; write marketing copy in the product; put Taglish in labels or anything the client sees.
