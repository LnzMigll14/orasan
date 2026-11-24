import { Plus } from "lucide-react";
import { formatMoney } from "../../shared/formatMoney";

// Sample invoice totals use integer centavos for PHP and cents for USD.
const clients = [
  {
    id: "reyes",
    name: "Reyes Studio",
    initials: "RS",
    minutes: 1770,
    entries: 10,
    amountMinor: 3_892_500,
    currency: "PHP",
  },
  {
    id: "kalye",
    name: "Kalye Coffee Co.",
    initials: "KC",
    minutes: 210,
    entries: 2,
    amountMinor: 315_000,
    currency: "PHP",
  },
  {
    id: "northwind",
    name: "Northwind Remote LLC",
    initials: "NR",
    minutes: 708,
    entries: 7,
    amountMinor: 14_100,
    currency: "USD",
  },
] as const;

type ReadyToInvoiceProps = {
  onSeeAll?: () => void;
  onInvoice?: (clientId: string) => void;
  onAddClient?: () => void;
};

export function ReadyToInvoice({
  onSeeAll,
  onInvoice,
  onAddClient,
}: ReadyToInvoiceProps) {
  return (
    <section className="flex min-w-0 flex-col rounded-lg border border-border bg-surface p-4 md:p-6">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-headline">Ready to invoice</h2>
        <button
          type="button"
          onClick={onSeeAll}
          disabled={!onSeeAll}
          className="min-h-11 shrink-0 text-label font-bold text-text-secondary enabled:hover:text-text md:min-h-10"
        >
          See all
        </button>
      </header>

      <ul className="mt-2 divide-y divide-border">
        {clients.map((client) => {
          const amount = formatMoney(
            client.amountMinor,
            client.currency,
            "narrow",
          );

          return (
            <li key={client.id} className="flex items-center gap-3 py-3">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-raised text-label font-bold text-text-secondary"
              >
                {client.initials}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-body font-bold text-text">{client.name}</p>
                <p className="text-label text-text-muted mt-1">
                  {(client.minutes / 60).toFixed(1)} h · {client.entries}{" "}
                  entries
                </p>
              </div>

              {/* Include the client and amount in the accessible name to identify each row action. */}
              <button
                type="button"
                aria-label={`Invoice ${client.name} for ${amount}`}
                onClick={() => onInvoice?.(client.id)}
                disabled={!onInvoice}
                className="flex min-h-11 flex-col text-right justify-center enabled:hover:underline"
              >
                <span className="font-bold tabular-nums text-text whitespace-nowrap">
                  {amount}
                </span>
                <span className="text-amber font-bold text-label">Invoice</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onAddClient}
          disabled={!onAddClient}
          className="flex h-(--size-control-touch) w-full justify-center items-center bg-raised border border-border gap-2 rounded-pill font-bold enabled:hover:border-border-strong md:h-(--size-control)"
        >
          {" "}
          <Plus aria-hidden="true" size={16} />
          Add client
        </button>
      </div>
    </section>
  );
}
