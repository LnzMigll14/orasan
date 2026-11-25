import { useMemo } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { initials, unbilledByClient } from "../../data/selectors";
import type { AppData } from "../../data/types";
import { formatMoney } from "../../shared/formatMoney";
import { button } from "../../shared/ui";

/** Clients with unbilled time, largest first, each one tap away from an invoice. */
export function ReadyToInvoice({ data }: { data: AppData }) {
  const rows = useMemo(() => {
    const unbilled = unbilledByClient(data);
    return data.clients
      .filter((client) => unbilled.has(client.id))
      .map((client) => ({ client, ...unbilled.get(client.id)! }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [data]);

  return (
    <section aria-labelledby="ready-to-invoice" className="flex min-w-0 flex-col rounded-lg border border-border bg-surface p-4 md:p-6">
      <header className="flex items-center justify-between gap-3">
        <h2 id="ready-to-invoice" className="text-headline">
          Ready to invoice
        </h2>
        <Link to="/clients" className={button.link}>
          See all
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="mt-3 text-body text-text-secondary">
          {data.clients.length === 0
            ? "Add your first client to start tracking billable time."
            : "No unbilled time yet. Start the timer and it shows up here."}
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {rows.map(({ client, minutes, entries, amountMinor }) => {
            const amount = formatMoney(amountMinor, client.currency, "narrow");
            return (
              <li key={client.id} className="flex items-center gap-3 py-3">
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-raised text-label font-bold text-text-secondary"
                >
                  {initials(client.name)}
                </span>

                <div className="min-w-0 flex-1">
                  <Link to={`/clients/${client.id}`} className="block truncate text-body font-bold text-text hover-fine:underline">
                    {client.name}
                  </Link>
                  <p className="mt-1 text-label text-text-muted">
                    {(minutes / 60).toFixed(1)} h · {entries} {entries === 1 ? "entry" : "entries"}
                  </p>
                </div>

                {/* Include the client and amount in the accessible name to identify each row action. */}
                <Link
                  to={`/invoices/new?client=${client.id}`}
                  aria-label={`Invoice ${client.name} for ${amount}`}
                  className="flex min-h-11 flex-col justify-center text-right hover-fine:underline"
                >
                  <span className="whitespace-nowrap font-bold text-text tabular-nums">{amount}</span>
                  <span className="text-label font-bold text-amber">Invoice</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-auto pt-6">
        <Link to="/clients?new=1" className={`${button.secondary} w-full`}>
          <Plus aria-hidden="true" size={16} />
          Add client
        </Link>
      </div>
    </section>
  );
}
