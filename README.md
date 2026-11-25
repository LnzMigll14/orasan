# Orasan

Orasan is a time tracking and invoicing app in development for Filipino freelancers and virtual assistants. The planned workflow connects tracked hours, PHP or USD invoices, and manual payment records.

The current frontend uses React, Vite, TypeScript, Tailwind CSS v4, and React Router. It covers the full loop: first-time setup, the timer, clients and projects, invoices (build, send, mark as paid, public page, print to PDF), settings, and JSON export and import. A design token reference lives at `/styleguide`.

## Deploy

The build is a static site in `dist/`, so any static host works. Connect the GitHub repository and use build command `npm run build` and output directory `dist`.

- **Vercel** reads `vercel.json`.
- **Netlify** and **Cloudflare Pages** read `public/_redirects` and `public/_headers`, which the build copies into `dist/`.

These files send every path to `index.html`, so links such as `/invoices/…` work on reload. They also set strict security headers, including a content security policy that only allows the app's own files. If you change the headers, update both `vercel.json` and `public/_headers`. Run `npm run build` then `npm run preview` to test locally with the same headers.

While data lives in the browser, client invoice links are switched off in `src/app/features.ts`, and the copied message tells the client the invoice is attached as a PDF. Turn `publicInvoiceLinks` on once a backend stores invoices.

## Data

All data is stored in the browser's localStorage for now, under the key `orasan:data`. Everything that reads or writes it lives in `src/data/`:

- `types.ts`: the data shape and `DATA_VERSION`.
- `storage.ts`: the storage adapter. To move to Supabase or another backend, write an adapter with the same methods and pass it to the store.
- `store.ts`: the single store, its `useAppData()` hook, and every action that changes data (add client, stop timer, create invoice, and so on). Components never touch storage directly.
- `migrations.ts`: when the shape changes, bump `DATA_VERSION` and add a migration. Saved data and imported files both run through it.
- `validate.ts`: checks saved and imported data, including the links between records.
- `selectors.ts` and `invoicing.ts`: pure functions for totals, statuses and invoice lines.
- `backup.ts`: export and import files (`{ app, version, exportedAt, data }`).

If saved data can't be read, the app shows a recovery screen instead of overwriting it.

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
