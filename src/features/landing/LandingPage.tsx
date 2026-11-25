import { Link } from "react-router";
import { ArrowRight, Clock3, Coins, FileText, Wallet } from "lucide-react";
import { Logo, LogoMark } from "../../shared/components/brand/Logo";
import { usePageMeta } from "../../shared/seo";
import { button, card } from "../../shared/ui";

const features = [
  {
    icon: Clock3,
    title: "One-tap timer",
    body: "Start or stop the timer from any screen, even on your phone between tasks. Add time you forgot by hand.",
  },
  {
    icon: Coins,
    title: "Pesos and dollars, side by side",
    body: "Bill foreign clients in USD and local clients in PHP. Every amount keeps its currency, so totals never mix.",
  },
  {
    icon: FileText,
    title: "Invoices from tracked time",
    body: "Unbilled hours come pre-selected by project, with your rates and rounding applied. Print or save the invoice as a PDF.",
  },
  {
    icon: Wallet,
    title: "Your payment details, built in",
    body: "Turn on GCash, Maya, bank transfer, Wise, PayPal or Payoneer once. Each invoice shows the methods that match its currency.",
  },
];

const steps = [
  { title: "Track", body: "Start the timer for a client's project." },
  { title: "Invoice", body: "Turn unbilled hours into a PHP or USD invoice." },
  { title: "Send", body: "Save the PDF and copy a ready-made message for your client." },
  { title: "Mark as paid", body: "Record the payment method and reference number." },
];

const faqs = [
  {
    q: "Is Orasan free?",
    a: "Yes. Orasan is free while it's in beta.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. Enter your name and email for your invoices and start tracking. There's no password and no sign-up.",
  },
  {
    q: "Where is my data stored?",
    a: "In your browser, on your device. Nothing is sent to a server. Use Settings › Export JSON to keep a backup or move to another device.",
  },
  {
    q: "Does Orasan collect payments from my clients?",
    a: "No. Clients pay you directly through GCash, Maya, your bank, Wise, PayPal or Payoneer. You record each payment in Orasan with its reference number.",
  },
  {
    q: "Can I use Orasan invoices for the BIR?",
    a: "No. Orasan invoices are billing statements for your clients, not BIR-registered invoices. If you're registered with the BIR, you may still need to issue your own registered invoice. Ask your accountant.",
  },
];

/** The public front page for visitors with no saved data. It's the only page search engines index. */
export function LandingPage() {
  usePageMeta(null, { index: true });

  const start = (
    <Link to="/welcome" className={`${button.primary} min-h-12 px-6 text-title`}>
      Start tracking free
      <ArrowRight aria-hidden="true" size={18} />
    </Link>
  );

  return (
    <div className="min-h-dvh bg-canvas text-text">
      <header className="mx-auto flex w-full max-w-(--size-content) items-center justify-between gap-4 px-4 py-5 md:px-8">
        <Link to="/" aria-label="Orasan home" className="rounded-lg">
          <Logo size={36} />
        </Link>
        <Link to="/welcome" className={button.secondary}>
          Get started
        </Link>
      </header>

      <main className="mx-auto w-full max-w-(--size-content) px-4 md:px-8">
        <section aria-labelledby="hero-title" className="grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <p className="text-label font-bold tracking-wide text-amber uppercase">For Filipino freelancers and VAs</p>
            <h1 id="hero-title" className="text-[2.5rem] leading-[1.1] font-extrabold tracking-tight md:text-[3.5rem]">
              Time tracking and invoicing that knows how you get paid
            </h1>
            <p className="max-w-xl text-title font-medium text-text-secondary md:text-headline md:font-medium">
              Track your hours, turn them into PHP or USD invoices with your GCash, Maya, bank, Wise or PayPal details, and
              always know how much you're owed.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {start}
              <p className="text-label text-text-muted">Free in beta · No sign-up · Your data stays on your device</p>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <LogoMark size={240} className="max-w-[60vw]" />
          </div>
        </section>

        <section aria-labelledby="features-title" className="py-10 md:py-14">
          <h2 id="features-title" className="text-display">
            Everything between the timer and getting paid
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {features.map(({ icon: Icon, title, body }) => (
              <li key={title} className={`${card} flex gap-4 p-5 md:p-6`}>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-tint text-amber">
                  <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-title">{title}</h3>
                  <p className="mt-1 text-body text-text-secondary">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-title" className="py-10 md:py-14">
          <h2 id="how-title" className="text-display">
            How it works
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {steps.map(({ title, body }, index) => (
              <li key={title} className={`${card} p-5`}>
                <span className="grid size-8 place-items-center rounded-full bg-amber text-label font-extrabold text-on-amber">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-title">{title}</h3>
                <p className="mt-1 text-body text-text-secondary">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-title" className="py-10 md:py-14">
          <h2 id="faq-title" className="text-display">
            Questions
          </h2>
          <div className={`${card} mt-6 divide-y divide-border`}>
            {faqs.map(({ q, a }) => (
              <details key={q} className="group px-5 py-4 md:px-6">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-title [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden="true" className="text-text-secondary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 max-w-prose text-body text-text-secondary">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="cta-title" className={`${card} my-10 flex flex-col items-start gap-5 p-6 md:my-14 md:flex-row md:items-center md:justify-between md:p-8`}>
          <div>
            <h2 id="cta-title" className="text-headline">
              Know how much you're owed, in pesos and dollars
            </h2>
            <p className="mt-1 text-body text-text-secondary">Set up takes about a minute: your details, how you get paid, your first client.</p>
          </div>
          {start}
        </section>
      </main>

      <footer className="border-t border-border px-4 py-6 text-center text-body text-text-secondary">
        © {new Date().getFullYear()} <span className="font-semibold text-text">Orasan</span> · Time tracking and invoicing for
        Filipino freelancers and VAs
      </footer>
    </div>
  );
}
