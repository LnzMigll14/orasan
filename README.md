# Orasan

Orasan is a time tracking and invoicing app in development for Filipino freelancers and virtual assistants. The planned workflow connects tracked hours, PHP or USD invoices, and manual payment records.

The current React frontend includes a responsive dashboard shell at `/` and a design token reference at `/styleguide`. The timer, clients, invoices, and settings screens are planned.

## Run locally

Use Node.js 22.22.0 or later and npm. Run these commands from the repository root.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

Build the app, then preview the production bundle.

```sh
npm run build
npm run preview
```

## Project layout

- `src/pages/` contains the dashboard shell, navigation, and style guide.
- `src/components/` contains reusable components, including the Orasan logo.
- `src/styles/` holds Tailwind styles and shared design tokens.
- [Product brief](PRODUCT.md) and [design system](DESIGN.md) describe the intended experience.
- The [desktop](design/screenshots/desktop-1440) and [mobile](design/screenshots/mobile-375) screenshots document the design prototype.
