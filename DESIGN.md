---
name: Orasan
description: Time tracking and invoicing for Filipino freelancers. A stopwatch crossed with a paper ledger.
colors:
  # Light mode
  paper: "#F6F4EF"
  surface: "#FCFBF8"
  sunken: "#EFECE5"
  rule: "#DDD8CE"
  rule-strong: "#8F887B"
  ink: "#1C1B18"
  ink-muted: "#5E5A52"
  ink-faint: "#6B665C"
  ledger-green: "#1E6B4E"
  ledger-green-deep: "#17573F"
  ledger-green-tint: "#E3EFE8"
  on-ledger-green: "#FFFFFF"
  focus: "#2B5A8A"
  status-draft-fg: "#57534B"
  status-draft-bg: "#ECE9E2"
  status-sent-fg: "#2B5A8A"
  status-sent-bg: "#E4ECF5"
  status-paid-fg: "#1E6B4E"
  status-paid-bg: "#E1EFE7"
  status-overdue-fg: "#A8352A"
  status-overdue-bg: "#F7E5E1"
  danger: "#A8352A"
  danger-deep: "#8C2A21"
  on-danger: "#FFFFFF"
  # Dark mode
  dark-paper: "#151412"
  dark-surface: "#1D1C19"
  dark-sunken: "#11100E"
  dark-raised: "#25231F"
  dark-rule: "#34322D"
  dark-rule-strong: "#6E695F"
  dark-ink: "#EDEAE3"
  dark-ink-muted: "#A9A399"
  dark-ink-faint: "#8C867B"
  dark-ledger-green: "#5DBB91"
  dark-ledger-green-deep: "#74C9A2"
  dark-ledger-green-tint: "#1B2E25"
  dark-on-ledger-green: "#0E1F17"
  dark-focus: "#8DB4E0"
  dark-status-draft-fg: "#B5AFA4"
  dark-status-draft-bg: "#2A2824"
  dark-status-sent-fg: "#8DB4E0"
  dark-status-sent-bg: "#1C2633"
  dark-status-paid-fg: "#6CC59C"
  dark-status-paid-bg: "#17291F"
  dark-status-overdue-fg: "#F08A7C"
  dark-status-overdue-bg: "#3A1D19"
  dark-danger: "#F08A7C"
  dark-on-danger: "#1F0D0A"
typography:
  statement:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "40px"
    letterSpacing: "-0.01em"
    fontFeature: "tnum, ss02"
  timer:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "0em"
    fontFeature: "tnum, zero"
  timer-compact:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "24px"
    fontFeature: "tnum, zero"
  headline:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "-0.005em"
  title:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  body:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  body-mobile:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  figure:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
    fontFeature: "tnum"
  figure-strong:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
    fontFeature: "tnum"
  label:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.01em"
  column-head:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.06em"
  doc-title:
    fontFamily: "IBM Plex Serif, serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: "36px"
  doc-body:
    fontFamily: "IBM Plex Serif, serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
    fontFeature: "tnum"
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "6px"
  pill: "999px"
spacing:
  "0": "0px"
  "2xs": "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ledger-green}"
    textColor: "{colors.on-ledger-green}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.ledger-green-deep}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.sunken}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  button-ghost-hover:
    backgroundColor: "{colors.sunken}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "36px"
  button-danger-hover:
    backgroundColor: "{colors.danger-deep}"
  button-disabled:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.ink-faint}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  badge-status:
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "2px 6px"
    height: "20px"
  entry-row:
    backgroundColor: "{colors.surface}"
    typography: "{typography.body}"
    padding: "0 16px"
    height: "44px"
  entry-row-billed:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
  timer-control-running:
    backgroundColor: "{colors.ledger-green-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.timer-compact}"
  slide-over:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    width: "480px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  nav-item:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    height: "36px"
  nav-item-active:
    textColor: "{colors.ink}"
---

# Design System: Orasan

## Overview

**Creative North Star: "The Pocket Ledger"**

Orasan should feel like a well-made stopwatch tucked into a bound ledger. There are three materials: warm paper, black ink and one green, the green you'd see in a bookkeeper's ledger. Ruled lines do the work that cards and shadows do in other apps. Numbers are the loudest thing on every screen. Amounts and durations are set in tabular figures and aligned on the right, so they read like a column in a ledger. Everything else (labels, navigation, metadata) stays quiet and sits back.

Density is **medium-high**, as you'd expect from a tool people open every day. Rows are tight, lines are thin, and there's very little empty space for its own sake. Variance is **low**: every list is built the same way, and every screen uses the same header and the same primary action. When the user's eye goes to the same place each time, they can find what they need in under two seconds. Motion is **low**. It only shows that something changed, never to show off.

Rejected (the user's anti-references): the sidebar + stat-card row + chart dashboard; Inter, Roboto, Arial and system defaults; gradients, glassmorphism, glows and blobs; shadowed rounded cards; decorative icons and emoji; centered empty states with large padding.

**Key Characteristics:**
- Paper and ink neutrals with a slight warm tint. No pure white or pure black.
- One accent, Ledger Green, used for money actions and the running timer. Nothing else.
- Hairline rules and tonal steps instead of shadows.
- Tabular, right-aligned figures. Currency symbols are always shown, and currencies are never mixed in one total.
- Small radii (2–6px). Edges look cut, not puffy.
- A single type family (IBM Plex) in three cuts: Sans for the interface, Mono for the clock, Serif for the invoice document.

## Colors

The palette is two warm neutrals in a range of steps, one green that stands for money, and four status colors that always come with a text label.

### Semantic tokens (Light and Dark)

This table is the source of truth for both Figma and code. The Figma file's `Color` collection currently has **Light only**, because the Starter plan allows one mode per collection. When modes become available, add **Dark** as a second mode on the same `Color` collection and alias each token to the Dark value below. The `Primitives` collection already holds every Dark value. In code, define each token as a CSS custom property on `:root` with the Light value, and redefine it under `[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`.

| Figma variable | CSS variable | Light | Dark |
|---|---|---|---|
| color/bg/paper | `--color-bg-paper` | #F6F4EF | #151412 |
| color/bg/surface | `--color-bg-surface` | #FCFBF8 | #1D1C19 |
| color/bg/sunken | `--color-bg-sunken` | #EFECE5 | #11100E |
| color/bg/raised | `--color-bg-raised` | #FCFBF8 | #25231F |
| color/bg/scrim | `--color-bg-scrim` | #1C1B18 @ 40% | #000000 @ 60% |
| color/border/rule | `--color-border-rule` | #DDD8CE | #34322D |
| color/border/strong | `--color-border-strong` | #8F887B | #6E695F |
| color/text/ink | `--color-text-ink` | #1C1B18 | #EDEAE3 |
| color/text/muted | `--color-text-muted` | #5E5A52 | #A9A399 |
| color/text/faint | `--color-text-faint` | #6B665C | #8C867B |
| color/accent/default | `--color-accent-default` | #1E6B4E | #5DBB91 |
| color/accent/hover | `--color-accent-hover` | #17573F | #74C9A2 |
| color/accent/tint | `--color-accent-tint` | #E3EFE8 | #1B2E25 |
| color/accent/on | `--color-accent-on` | #FFFFFF | #0E1F17 |
| color/focus | `--color-focus` | #2B5A8A | #8DB4E0 |
| color/danger/default | `--color-danger-default` | #A8352A | #F08A7C |
| color/danger/hover | `--color-danger-hover` | #8C2A21 | #F5A397 |
| color/danger/on | `--color-danger-on` | #FFFFFF | #1F0D0A |
| color/status/draft/fg | `--color-status-draft-fg` | #57534B | #B5AFA4 |
| color/status/draft/bg | `--color-status-draft-bg` | #ECE9E2 | #2A2824 |
| color/status/sent/fg | `--color-status-sent-fg` | #2B5A8A | #8DB4E0 |
| color/status/sent/bg | `--color-status-sent-bg` | #E4ECF5 | #1C2633 |
| color/status/paid/fg | `--color-status-paid-fg` | #1E6B4E | #6CC59C |
| color/status/paid/bg | `--color-status-paid-bg` | #E1EFE7 | #17291F |
| color/status/overdue/fg | `--color-status-overdue-fg` | #A8352A | #F08A7C |
| color/status/overdue/bg | `--color-status-overdue-bg` | #F7E5E1 | #3A1D19 |
| color/inverse/bg | `--color-inverse-bg` | #1C1B18 | #EDEAE3 |
| color/inverse/text | `--color-inverse-text` | #F6F4EF | #151412 |

### Primary
- **Ledger Green** (#1E6B4E light / #5DBB91 dark): used for the main money action on each screen ("Send invoice", "Start timer", "Mark as paid"), the running-timer state, and links. Hover is **Ledger Green Deep** (#17573F / #74C9A2). **Ledger Green Tint** (#E3EFE8 / #1B2E25) fills the running-timer bar and the selected rows in the invoice builder.

### Neutral
- **Paper** (#F6F4EF / #151412): the app background.
- **Surface** (#FCFBF8 / #1D1C19): list bodies, inputs, slide-overs, and the invoice sheet.
- **Sunken** (#EFECE5 / #11100E): day headers, disabled fills, and table header bands. In dark mode, **Raised** (#25231F) is used for menus and the slide-over so they read above the surface without a shadow.
- **Rule** (#DDD8CE / #34322D): hairline dividers between rows and sections.
- **Rule Strong** (#8F887B / #6E695F): input borders and checkbox outlines. These meet 3:1 against the background, as WCAG requires for UI components.
- **Ink** (#1C1B18 / #EDEAE3): primary text and figures (15.7:1 / 15.3:1).
- **Ink Muted** (#5E5A52 / #A9A399): secondary text and metadata (6.2:1 / 6.8:1).
- **Ink Faint** (#6B665C / #8C867B): placeholders, billed/locked rows and timestamps. It still passes AA at 4.8:1 or better on every surface.

### Status (always shown with a text label)
| Status | Light fg / bg | Dark fg / bg | Marker |
|---|---|---|---|
| Draft | #57534B / #ECE9E2 | #B5AFA4 / #2A2824 | hollow square |
| Sent | #2B5A8A / #E4ECF5 | #8DB4E0 / #1C2633 | right arrow |
| Paid | #1E6B4E / #E1EFE7 | #6CC59C / #17291F | check |
| Overdue | #A8352A / #F7E5E1 | #F08A7C / #3A1D19 | filled square |

In both modes, every pair of label text on its badge background is at least 5.4:1. **Danger** reuses the overdue red (#A8352A / #F08A7C) for destructive buttons. **Focus** (#2B5A8A / #8DB4E0) is a 2px ring with a 2px offset. It is kept separate from the green, so the focus ring is never mistaken for a selection.

### Named Rules
**The One Green Rule.** Ledger Green appears on at most one primary action per view, plus the running timer. If two things on a screen are green, one of them is wrong.

**The Label Rule.** Status color always comes with its word and its marker. A badge without text is a bug.

**The Separate Currencies Rule.** PHP and USD are never added together. Mixed totals are shown as separate lines ("₱48,200.00 · $1,250.00"), never converted.

## Typography

**Interface Font:** IBM Plex Sans (fallback: "Helvetica Neue", sans-serif)
**Clock Font:** IBM Plex Mono (fallback: ui-monospace)
**Document Font:** IBM Plex Serif (fallback: Georgia, serif)

**Character:** Plex was designed with engineering instruments in mind. It has open counters, true tabular figures and a slashed zero. Using all three cuts of one family keeps the clock, the ledger and the printed invoice clearly related, without taking on a second visual personality. Mono is used only for the running clock and durations, because those are measurements. It is never used as a "tech" costume.

### Hierarchy
- **Statement** (600, 32px/40px; 28px/36px on mobile, tnum): the one sentence about money owed on the Dashboard ("₱48,200 unbilled across 3 clients"). It is the largest text in the app and appears once.
- **Timer** (Mono 500, 40px/48px, tnum + slashed zero): the running clock on the Timer screen. **Timer Compact** (Mono 500, 16px) is used in the persistent timer bar.
- **Headline** (600, 20px/28px): page titles.
- **Title** (600, 16px/24px): section and group heads, slide-over titles.
- **Body** (400, 14px/20px desktop; 16px/24px mobile): rows and descriptions. Mobile inputs are always 16px so the browser doesn't zoom in.
- **Figure** (500, 14px/20px, tnum) and **Figure Strong** (600, 16px/24px, tnum): amounts and durations in rows, and the totals beneath them.
- **Label** (500, 12px/16px): buttons, badges, field labels and nav.
- **Column Head** (600, 11px/16px, +0.06em, uppercase): column headers in the ledger, and nowhere else.
- **Doc Title / Doc Body** (Serif 500 28px; Serif 400 14px/22px): only on the invoice preview and the public invoice.

### Named Rules
**The Tabular Rule.** Every number that can change or sit in a column uses `tnum`: amounts, hours, dates in rows, invoice numbers. Figures align to the right, and decimal points line up.

**The Format Rule.** Amounts are written `₱48,200.00` or `$1,250.00`, with the symbol first and no space. The Dashboard statement may drop centavos. Durations are written `2:45` in rows and `02:45:12` on the running clock. Totals are written `38.5 h`.

## Layout

**Grid.** Desktop (1440px) uses a 12-column grid with 24px gutters and 32px outer margins. Content is capped at 1120px and aligned to the left under a top bar, not centered in empty space. Mobile (375px) uses a single column with 16px side margins.

**Persistent timer (priority 1).**
- On desktop, a 56px top bar holds the wordmark and nav items on the left, and the timer control on the far right: project picker, running clock, and a Start/Stop button.
- On mobile, a 56px timer dock sits directly above a 64px bottom tab bar (Dashboard, Timer, Clients, Invoices, Settings), so the timer is always one tap away.
- There is no sidebar.

**Rhythm.** Spacing follows a 4px base: 2, 4, 8, 12, 16, 24, 32, 48, 64.
- Rows are 44px on desktop and 52px on mobile, with 16px horizontal padding.
- Sections are 32px apart on desktop and 24px apart on mobile.
- A group (for example, one day's entries) is a Sunken header band with a right-aligned total, followed by rows separated by hairlines.

**Ledger columns.** The description column takes the remaining width. Meta columns (project, client) are fixed width. Figures sit in a right-aligned column at least 96px wide. On mobile, the meta columns stack under the description and the figure stays on the right.

**Slide-over.** On desktop, a slide-over is 480px wide, enters from the right and covers a 40% Ink scrim. On mobile it becomes a full-height sheet.

**Empty states.** Empty states are left-aligned and sit inside the normal content column at normal density. Each one has a single sentence (Taglish allowed), one primary action, and the real list structure (headers and rules) shown faintly, so the user can see what will fill in.

## Elevation & Depth

Orasan is flat. Depth comes from tone and lines, not shadows:
- Paper is below Surface, and Surface is below Raised (in dark mode).
- 1px Rule lines divide sections.

Only two elements that float use a shadow, and only to separate them from content scrolling beneath:
- **Overlay** (`0 8px 24px rgba(28,27,24,0.16)`, in light mode only): slide-over and dialog.
- **Toast** (`0 4px 12px rgba(28,27,24,0.20)`).

Dark mode uses Raised plus a Rule Strong border instead of a shadow.

**The No Card Rule.** Lists are never wrapped in shadowed, rounded cards. A group is a header band and ruled rows.

## Shapes

- Corners are small: 2px for badges, 4px for buttons, inputs and toasts, 6px for dialogs and the invoice sheet. Slide-overs and bars are square.
- Pill (999px) is used only for the running-timer dot and the toggle track.
- Borders are 1px.
- Checkboxes are square with a 2px radius, like the tick boxes on a form.
- The public invoice sheet sits on Paper as a Surface rectangle with a 1px Rule border and 48px inner padding (24px on mobile), like a printed page.

## Components

- **Button.** Four kinds: primary (green), secondary (Surface with a Rule Strong border), ghost (no fill), and danger (red).
  - Each kind has four states: default, hover (one tone deeper), focus (2px Focus ring, 2px offset) and disabled (Sunken fill, Ink Faint text, no border).
  - Height is 36px on desktop and 44px on mobile.
  - Labels start with a verb.
- **Input / Select.**
  - Surface fill, a 1px Rule Strong border and a 4px radius.
  - The label sits above in Label style. Help or error text sits below; error text is Danger and starts with "Error:", so the error isn't shown by color alone.
  - Money inputs show the currency symbol inside the field, and the figure aligns to the right.
  - Select uses a chevron, which is the only icon in the component.
- **Badge (status).** A 20px-high status badge holding the marker glyph and the status word in sentence case ("Overdue"). It is never shown as a dot alone.
- **Timer control.**
  - *Idle:* a project select and a primary "Start timer" button.
  - *Running:* a Ledger Green Tint band with a pulsing 8px green dot, the project name, a Mono clock and a secondary "Stop" button.
  - Start and Stop occupy the same position, so they can be toggled with one tap without moving.
- **Entry row.**
  - *Normal:* a checkbox in builder contexts, then description, project · client, time range, and duration on the right. It has a resume action on hover (always visible on mobile).
  - *Billed/locked:* a Paper fill, Ink Faint text, a lock glyph plus the invoice number ("On INV-0012"), no actions, and a cursor that shows it can't be edited.
- **SlideOver.** A title bar with a close button, a body that scrolls, and a footer that stays fixed with actions aligned right (primary last).
- **Toast.** An Ink fill with Paper text, placed at the bottom left on desktop and above the dock on mobile. It is one line with an optional "Undo" action. It disappears after 5 seconds and pauses while hovered.
- **EmptyState.** See Layout. It contains one sentence, one action and the faint list structure.
- **Nav item.** Label text in Ink Muted; the active item is Ink with a 2px Ink underline (top bar) or a top rule (bottom tab bar). Mobile tab items are 44px or larger, with a text label always shown.
- **Invoice line item.** Description and date range on the left; quantity (hours), rate and amount in right-aligned tabular columns; a Rule line below. Subtotal and total are stacked to the right, and the total uses Figure Strong.

## Motion

Motion is low. Animation is used only to explain a change of state.

| Moment | Animate? | Duration | Easing |
|---|---|---|---|
| Hover, press, focus | color only | 100ms | linear |
| Timer start/stop | Start crossfades to Stop in place; the tint band fades in; the clock begins ticking at once (no counting up) | 150ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Running dot | opacity pulse, 1 → 0.4 | 2s loop | ease-in-out |
| Slide-over | slides in from 16px plus a fade; scrim fades | 200ms in / 150ms out | `cubic-bezier(0.2, 0, 0, 1)` in, `cubic-bezier(0.4, 0, 1, 1)` out |
| Toast | rises 8px plus a fade | 160ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Invoice sent | the status badge changes to "Sent" in place with a 150ms crossfade; no confetti | 150ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Totals in the builder | update instantly; numbers never tween | 0ms | none |

With `prefers-reduced-motion`, every movement becomes a crossfade of 100ms or less, and the running dot stops pulsing and stays solid.

## Do's and Don'ts

**Do:**
- Lead the Dashboard with one plain sentence about money owed.
- Right-align tabular figures and always show the currency symbol.
- Use hairlines and Sunken bands to group content.
- Keep the timer in the same place on every screen.
- Lock billed entries visibly, with the invoice number.
- Keep the public invoice in English, laid out like a paper document, with a copy button beside each payment detail.

**Don't:**
- Use a stat-card row, a chart on the dashboard, or a sidebar plus cards.
- Use Inter, Roboto, Arial or system UI fonts.
- Use gradients, glass, glows, blobs or decorative shadows.
- Use decorative icons or emoji. The only glyphs allowed are status markers, lock, copy, chevron, close and checkbox.
- Show status by color alone.
- Add PHP and USD together.
- Use Taglish in labels or anything the client sees.
- Write marketing copy in the product.
