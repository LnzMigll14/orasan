# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

The design is Figma-first. The frontend uses React, Vite, TypeScript, Tailwind CSS v4, and React Router. It targets 375px to 1440px, with PWA installation planned. The backend will use Supabase for Postgres, Auth, Storage, and Edge Functions. Frontend hosting is still open.

## Users

- **Solo virtual assistants** who bill foreign clients by the hour in USD. They usually have one to three long-running clients, and they track time all day between tasks.
- **Local freelancers** (designers, developers, writers) who bill Philippine clients in PHP, either hourly or by project.

Both groups use Orasan every day, often on a phone, in short bursts between other work. What they want from it is speed and certainty about money. They do not want delight.

A second audience is **the freelancer's client**, who only ever sees the public invoice page. That person may be abroad and has never heard of Orasan.

## Product Purpose

Orasan is a time tracker and invoicing tool for Filipino freelancers and VAs. The core loop is:

1. Start a timer.
2. Turn the tracked hours into an invoice.
3. Send the client a link.
4. Mark the invoice as paid, with the payment method and a reference number.

Success means a user always knows how much they are owed, can bill for all of their tracked time without having to rebuild it by hand, and sends invoices that a client trusts enough to pay quickly.

## Positioning

Orasan is built around how Filipino freelancers actually get paid. Each user sets their own list of local and international payment methods. An invoice shows only the methods that match its currency. Peso and dollar billing work side by side in one ledger. Most global time trackers assume a card-payment processor, and most local tools skip time tracking entirely.

## Operating Context

- Phone first, in between tasks: the user opens the app, starts or stops the timer and leaves. Desktop is used for longer sessions like building invoices and reviewing clients.
- One user can have USD clients and PHP clients at the same time. Every amount belongs to one currency, and USD and PHP are never added together.
- An invoice is sent as a link, usually pasted into chat (Messenger, Viber, Slack, email). The user also needs a PDF and a ready-to-paste message.
- Clients pay outside the app. The user confirms the payment by hand, often after checking GCash or a bank app.

## Capabilities and Constraints

- **Timer:** one running timer at a time. It can be started and stopped in one action from any screen. Entries are grouped by day and show totals. A past entry can be resumed. Entries that have been billed are locked.
- **Clients and projects:** each client has a default currency and rate, and a project can override the rate.
- **Invoices:** built from unbilled entries, which come pre-selected by project. Statuses are draft, sent, paid and overdue. Invoice numbers follow a numbering setting. Time is rounded according to a rounding setting.
- **Payment methods:** the user turns methods on in Settings: GCash, Maya, Bank transfer, Wise, PayPal, Payoneer. Each method that is on stores its own details (name, number or email, account). An invoice shows only the methods that are on for its currency. "Mark as paid" lets the user pick the method and enter a reference number. All payments are recorded by hand in v1, with no payment integrations.
- **Tax:** the user can add an optional TIN, which prints on the invoice. Orasan makes no claim of BIR compliance, and v1 has no VAT or percentage-tax lines. Whether to support BIR-ready invoices later is still an open decision.
- **Public invoice page:** no app chrome. It shows the payment details, and each detail has a copy button.
- **Settings:** business info, payment methods, invoice numbering, time rounding, dark mode.
- **Currency formatting:** PHP is written as ₱48,200.00 and USD as $1,250.00. Both always use two decimal places in documents, with thousands separators.

## Brand Commitments

- **Name:** Orasan (Tagalog for "clock").
- **Voice:** plain, short and friendly, with verb-first labels: "Start timer", "Send invoice", "Mark as paid".
- **Taglish** is used only in success and empty states (for example "Bayad na!"). It never appears in labels, errors or anything the client sees.
- **Everything a client sees is in English.**
- **No marketing copy inside the product.**
- **Visual constraints the user made binding** (DESIGN.md turns these into specifics):
  - **Direction (changed 19 Nov 2026 by the user): "Midnight amber".** The user supplied the palette: canvas #0B0D12, surface #12151C, raised #191D27, border #262B38, text #ECEEF3, secondary #9BA2B3, muted #6B7286, amber #F2B256 (text on amber #1A1206), overdue #F2667A, sent #6CA6F7, paid #4BD394. It is dark only. The reference build is the static HTML/CSS in `static/`, made for import into Figma with html.to.design.
  - The layout keeps what the user liked in the earlier soft dashboard (18 Nov 2026, tag `soft-dashboard-v1`), which was modelled on a health-dashboard reference they supplied:
    - the chart: bars with values on them, today highlighted, a dashed reference line;
    - layout and nav: a desktop sidebar with grouped, icon-labelled sections, a greeting header, one call to action;
    - lists and tables: people rows with avatars and quick actions, tables with progress rings and status chips.
  - Numbers still lead. The answer to "how much am I owed?" is the first thing on the Dashboard.
  - Still ruled out: Inter, Roboto, Arial or system-font defaults; glassmorphism, glows or blurred blobs; emoji; marketing copy inside the product; centered empty states with huge padding. Icons are allowed for navigation, stat cards and actions, from one consistent icon set.
  - On mobile, the desktop sidebar becomes a menu in the top bar. The planned timer dock keeps start and stop one tap away.
  - The earlier "precise instrument / paper ledger" direction is tagged `ledger-v1` (commit 14e704f).

## Evidence on Hand

There are no real users, testimonials, metrics, logos or customer data yet. The prototype uses invented mock data, labeled as mock data: 3 clients (1 USD VA client, 2 PHP clients), 6 projects, about 25 time entries over 2 weeks, and 4 invoices, one in each status. Future work must not present invented numbers as real.

## Product Principles

1. **Answer "how much am I owed?" in under two seconds.** Money owed comes first, stated plainly in one currency at a time, before any other information.
2. **The timer is one action away, everywhere.** No screen hides or delays starting or stopping the timer.
3. **Billed time is settled.** Once an entry is on an invoice, it is locked and clearly marked. The ledger never quietly changes amounts that have already been billed.
4. **Every invoice should look like a real document a client trusts:** a clear sender, line items, totals and payment instructions, in English.
5. **Record, don't integrate (v1).** Payments are confirmed by the user with a method and a reference number. The app never implies it moved any money.

## Accessibility & Inclusion

- WCAG 2.1 AA contrast in light and dark modes.
- Status is never shown by color alone. Every status has a text label.
- Touch targets are at least 44×44px on mobile.
- Respect reduced-motion settings.
- Amounts and durations use tabular figures so columns line up and stay readable.
