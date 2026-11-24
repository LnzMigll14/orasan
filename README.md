# Orasan

Orasan is a time tracking and invoicing app in development for Filipino freelancers and virtual assistants. The planned workflow connects tracked hours, PHP or USD invoices, and manual payment records.

The current frontend uses React, Vite, TypeScript, Tailwind CSS v4, and React Router. It includes a responsive dashboard shell at `/` and a design token reference at `/styleguide`. The timer, clients, invoices, and settings screens are planned.

## Run locally

Use Node.js 22.22.0 or later and npm. Run these commands from the repository root.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

Run `npm run typecheck` to check types without building. The production build runs that check before bundling the app.

```sh
npm run build
npm run preview
```

## Project layout

- `src/app/` contains the router and shared app layout. Add the Redux Toolkit store and app-wide providers here.
- `src/features/` contains screens grouped by product area. Keep feature-specific RTK Query endpoints, Redux slices, React Hook Form forms, Zod schemas, and Vitest component tests alongside their feature as they are built.
- `src/shared/` contains reusable UI and design tokens. Put cross-feature modules here, such as money and date helpers or the browser Supabase client, once shared callers exist.
- [`supabase/`](supabase/README.md) documents where schema migrations, Row Level Security tests, and Edge Functions will live.
- [Product brief](PRODUCT.md) and [design system](DESIGN.md) describe the intended experience.
- The [desktop](design/screenshots/desktop-1440) and [mobile](design/screenshots/mobile-375) screenshots document the design prototype.

Put invoice PDF templates in `src/features/invoices/pdf/` when invoice generation is added. Playwright tests will live in `e2e/` for flows that cross features, such as tracking time, creating an invoice, and marking it paid. GitHub Actions workflows will live in `.github/workflows/`.
