---
name: Orasan
description: Time tracking and invoicing for Filipino freelancers. "Midnight amber": a dark, quiet dashboard where money owed comes first and amber marks the one thing to do next.
colors:
  canvas: "#0B0D12"
  surface: "#12151C"
  raised: "#191D27"
  border: "#262B38"
  border-strong: "#646B80"
  text: "#ECEEF3"
  text-secondary: "#9BA2B3"
  text-muted: "#858CA0"
  muted-decorative: "#6B7286"
  amber: "#F2B256"
  amber-hover: "#F6C47A"
  on-amber: "#1A1206"
  amber-tint: "#312B24"
  overdue: "#F2667A"
  overdue-tint: "#312029"
  sent: "#6CA6F7"
  sent-tint: "#1F293B"
  paid: "#4BD394"
  paid-tint: "#1A302D"
  draft: "#9BA2B3"
  draft-tint: "#252931"
  bar: "#1E2330"
  bar-hatch: "#2A3040"
  toggle-off: "#3A4052"
  paper: "#F4F2EC"
  paper-ink: "#1A1C22"
  paper-muted: "#5E6270"
  paper-rule: "#DEDAD0"
  paper-accent: "#8A5A12"
  paper-overdue: "#A61E35"
  paper-overdue-tint: "#F9E1E4"
  paper-paid: "#17694A"
  paper-paid-tint: "#DCEFE5"
  paper-draft-tint: "#E7E5DE"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: "36px"
    letterSpacing: "-0.02em"
  stat:
    fontFamily: "Manrope, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: "34px"
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  timer:
    fontFamily: "Manrope, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "56px"
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "26px"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: "22px"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  body-mobile:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "24px"
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  micro:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: "14px"
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.on-amber}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 20px"
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    height: "40px"
  input:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    height: "40px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  status-chip:
    rounded: "{rounded.pill}"
    height: "28px"
  invoice-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.lg}"
---

# Design System: Orasan

## Overview

**Creative North Star: "Midnight amber"**

Orasan is a dark, quiet working surface, the kind you keep open all day beside chat and email. Near-black layers do the structure; one warm amber marks the single thing to do next (start the timer on its own screen, send the invoice, mark it paid) and today's bar on the chart. Status colors (overdue rose, sent blue, paid green) only ever appear with an icon and a word. The invoice is the exception to the dark: it stays a light paper sheet, because clients read, print and forward it as a document.

The user supplied this palette on 19 Nov 2026. It replaces the earlier "soft dashboard" (lavender, light).

Where things live:
- **`src/`** contains the React, Vite, TypeScript, and Tailwind CSS v4 frontend. The tokens in `src/shared/styles/tokens.css` use Tailwind's `@theme` and map to utilities such as `bg-surface`, `text-text-secondary`, `rounded-lg`, and `text-display`. The brand mark lives in `src/shared/components/brand/Logo.tsx` (`Logo`, `LogoMark`) and `public/favicon.svg`. The `/styleguide` route shows the tokens and classes, including `figure` for bold tabular numbers and `caps-label` for invoice labels.
- **`design/screenshots/`**: full-page 2× screenshots of every screen at 1440 and 375, the visual reference for building.
- **Tag `prototype-v1`**: the finished prototypes this system was proven on: the static HTML/CSS pages for Figma (`static/`) and the React prototype (`src/`), both in Midnight amber.
- Earlier directions: tag `ledger-v1` (paper ledger), tag `soft-dashboard-v1` (soft lavender dashboard).

The layout keeps what the user liked about the soft dashboard: a desktop sidebar with icon navigation, a greeting header, three money cards, an hours chart with values on the bars, an avatar list, and tables with progress rings and status chips.

**Key characteristics:**
- Four dark layers: canvas → surface (cards) → raised (inputs, pills, overlays) → border.
- One amber call to action per view. Amber also marks today and the running timer's clock.
- Text in three steps: text, secondary, muted. Small text never uses the decorative muted value.
- Cards are flat: a 1px inset border, no drop shadow. Only overlays cast a shadow.
- Manrope throughout, with tabular figures for every amount and duration.
- Lucide icons, 1.75 stroke, for navigation, stat cards, status and actions.

## Colors

All text pairs below pass WCAG AA (4.5:1) on every dark layer; control outlines pass 3:1.

### Dark layers
| Token | Hex | Use |
|---|---|---|
| `--color-canvas` | #0B0D12 | Page background, sidebar, billed (locked) rows |
| `--color-surface` | #12151C | Cards, lists, mobile chrome |
| `--color-raised` | #191D27 | Inputs, secondary buttons, pills, dialog, slide-over, toast |
| `--color-border` | #262B38 | Card outlines, row dividers (decorative, not a control boundary) |
| `--color-border-strong` | #646B80 | Input, select and checkbox outlines (3.2–3.7:1) |

### Text
| Token | Hex | Contrast on surface | Use |
|---|---|---|---|
| `--color-text` | #ECEEF3 | 15.7:1 | Primary text and figures |
| `--color-text-secondary` | #9BA2B3 | 7.1:1 | Secondary text, subtitles |
| `--color-text-muted` | #858CA0 | 5.4:1 | Small muted text: meta lines, labels, axis ticks |
| `--color-muted` | #6B7286 | 3.8:1 | **Decorative only**: disabled fills, inactive icons. Never small text. |

The user's palette named #6B7286 as "Muted"; at 3.8:1 it fails AA for small text, so small muted text uses #858CA0 and #6B7286 stays for decoration.

### Accent and status
| Token | Hex | Tint (on surface) | Use |
|---|---|---|---|
| `--color-amber` / `--color-on-amber` | #F2B256 / #1A1206 | #312B24 | Primary action (10:1), today's bar, running clock, active nav icon |
| `--color-overdue` | #F2667A | #312029 | Overdue chip and figures, goal line |
| `--color-sent` | #6CA6F7 | #1F293B | Sent chip |
| `--color-paid` | #4BD394 | #1A302D | Paid chip |
| `--color-draft` | #9BA2B3 | #252931 | Draft chip |

Tints are solid hex values (the color at 14% over surface), so Figma imports exact fills. Chip text on its tint is 5.1:1 or higher.

### Paper (the invoice document)
| Token | Hex | Use |
|---|---|---|
| `--color-paper` | #F4F2EC | Invoice sheet background |
| `--color-paper-ink` | #1A1C22 | Invoice text (15.2:1) |
| `--color-paper-muted` | #5E6270 | Labels and secondary lines (5.4:1) |
| `--color-paper-rule` | #DEDAD0 | Line-item dividers |
| `--color-paper-overdue` / `-tint` | #A61E35 / #F9E1E4 | Overdue chip on paper |
| `--color-paper-paid` / `-tint` | #17694A / #DCEFE5 | Paid chip on paper |
| `--color-paper-draft-tint` | #E7E5DE | Draft chip on paper |

### Named rules
**The One Amber Rule.** At most one amber button per view. Everything else is secondary (raised pill with a border) or ghost. The idle timer's Start is secondary in the header and dock; only the Timer screen's large Start is amber.

**The Label Rule.** Status is never color alone: every chip carries an icon and its word (Draft · file-pen, Sent · send, Paid · circle-check, Overdue · triangle-alert).

**The Separate Currencies Rule.** PHP and USD are never added together. A money card shows the default currency large and the other below ("and $141").

**The Paper Rule.** Anything the client sees as a document (builder preview, invoice detail, public invoice) is drawn on paper, not on the dark layers.

## Typography

**Font:** Manrope (Google Fonts, weights 500/600/700/800), fallback Avenir Next. `font-variant-numeric: tabular-nums` on the body, so every figure lines up.

| Role | Weight · size/line | Use |
|---|---|---|
| Display | 800 · 28/36, −0.02em | Page titles |
| Stat | 800 · 26/34, tnum | Money card values, builder total, chart average |
| Timer | 800 · 48/56, tnum | Clock on the Timer screen |
| Headline | 700 · 18/26 | Card and section titles |
| Title | 700 · 15/22 | Running-clock pill, invoice business name |
| Body / Body mobile | 500 · 14/20 and 16/24 | Rows; inputs are 16px on mobile so the browser doesn't zoom |
| Label | 500 · 12/16 | Meta lines, chips, links |
| Micro | 700 · 11/14 | Tab labels, chart ticks, invoice column heads (uppercase, +0.04em on paper) |

**The Format Rule.** Amounts `₱48,200.00` / `$1,250.00`; money cards may drop centavos. Durations `2:45` in rows, `00:01:12` on the clock; totals `38.5 h`. The invoice Hours column is a billing quantity, written `18.50`.

## Layout

- **Desktop (1024px+):** a 248px sidebar on the canvas (brand mark, icon nav with an overdue badge, Settings, profile) and a main column (max 1144px, 32px gutters). The header holds the title on the left and the timer pill plus the page's amber action on the right.
- **Below 1024px**, a compact top bar shows the wordmark and a 44px menu button. The expanded menu lists the sidebar destinations. The planned timer dock keeps timer controls within easy reach.
- **Dashboard:** three money cards (3 columns from 768px), then "Ready to invoice" beside "Hours tracked" from 1280px (Ready comes first below that), then the invoice tracker.
- **Builder:** entries by project, with a 540px sticky column (total + actions, then the paper preview) from 1280px.
- **Spacing:** 4px base; 12px between cards, 16–24px between sections, 20–24px card padding.
- **Figma-friendly by construction:** flexbox and grid with `gap` only. Sidebar and mobile chrome are `position: sticky`; only toasts, the dialog and the slide-over are fixed overlays.

## Elevation & Depth

Flat. Depth comes from the four dark layers and 1px inset borders. Only overlays (dialog, slide-over, toast) cast a shadow (`0 16px 48px rgba(0,0,0,0.48)`) over a scrim of `rgba(5,6,9,0.72)`.

## Shapes

Radius: 4 (checkbox), 8 (brand mark), 12 (inputs, message box), 16 (cards, invoice sheet), 20 (dialog, slide-over, onboarding card), pill (buttons, chips, select pills, avatars, toggles).

## Components

- **Button:** primary amber pill; secondary raised pill with a 1px border; ghost. 44px tall below 768px, 40px from 768px.
- **Select pill:** raised pill with a strong border and a chevron (project picker).
- **Timer control:** header pill and mobile dock. Running = amber-tint band, breathing amber dot, amber clock; Start and Stop share one grid cell and crossfade.
- **Money card (stat card):** icon in a tinted circle, label, stat value, muted note. The Overdue card links to the invoice.
- **Hours chart:** hatched bars, today in solid amber with an amber value pill, values printed on every bar, a dashed goal line plus a legend, axis ticks in muted text, and a screen-reader table with the same data.
- **Status chip:** pill, icon + word, tinted background.
- **Entry row:** description, project · client, time range, duration, Resume (play icon on mobile). Billed rows sit on the canvas with a lock and the invoice number.
- **Lists:** avatar + name + email rows; rate pills; right-aligned tabular amounts.
- **Invoice sheet:** paper; sender, title + status, billed-to/issued/due/amount, line items (hours and rate columns collapse into the line below 520px container width), totals, How to pay with copy buttons.
- **Forms:** raised inputs and selects with strong outlines; toggles (amber when on, 44px hit area); amber checkboxes.
- **Overlays:** dialog (bottom sheet on mobile, centered from 768px) and slide-over (full screen on mobile, 480px floating panel from 768px). Both open with `:target` in the static build.
- **Toast:** raised, bottom-left (above the dock on mobile), 5s, pauses on hover, optional amber action.

## Motion

Transform and opacity only; Emil Kowalski's ease-out `cubic-bezier(0.23, 1, 0.32, 1)`; exits faster than entrances.

| Moment | What happens | Duration |
|---|---|---|
| Press | scale 0.97 (toggles and copy buttons 0.95) | 160ms |
| Hover | opacity 0.86, only on devices that hover | 160ms |
| Timer start/stop | Start and Stop crossfade in place | 180ms |
| Running dot | opacity breath 1 → 0.35 | 2s loop |
| Toast | rises 8px and fades in; leaves 4px down | 240ms in / 160ms out |
| Dialog | scales 0.97 → 1 with the scrim fade | 240ms in / 160ms out |
| Slide-over | moves in 24px with the scrim fade | 240ms in / 160ms out |
| Toggle knob | slides 18px | 180ms |

Under `prefers-reduced-motion`, everything becomes a 120ms opacity fade, the dot stops breathing, and nothing moves.

## Do's and Don'ts

**Do:** keep one amber action per view; give every status chip an icon and a word; keep the invoice on paper; use #858CA0 for small muted text; keep the timer one tap away (header pill, mobile dock).

**Don't:** use #6B7286 for small text; add drop shadows to cards; use Inter, Roboto or system fonts; use glass, blur, glows or blobs; use emoji; add PHP and USD together; put Taglish in labels or anything the client sees; write marketing copy in the product.
