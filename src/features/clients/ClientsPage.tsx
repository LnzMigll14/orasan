import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus } from "lucide-react";
import { initials, outstandingByClient, unbilledByClient } from "../../data/selectors";
import { useAppData } from "../../data/store";
import { EmptyState } from "../../shared/components/EmptyState";
import { PageHeader } from "../../shared/components/PageHeader";
import { formatMoney } from "../../shared/formatMoney";
import { todayKey } from "../../shared/time";
import { button } from "../../shared/ui";
import { ClientDrawer } from "./ClientDrawer";

export function ClientsPage() {
  const data = useAppData();
  const [params, setParams] = useSearchParams();
  // ?new=1 opens the drawer, so other pages can link straight to "Add client".
  const adding = params.get("new") === "1";
  const today = todayKey();

  const rows = useMemo(() => {
    const unbilled = unbilledByClient(data);
    const outstanding = outstandingByClient(data, today);
    return [...data.clients]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((client) => ({
        client,
        projectCount: data.projects.filter((project) => project.clientId === client.id).length,
        unbilledMinor: unbilled.get(client.id)?.amountMinor ?? 0,
        outstanding: outstanding.get(client.id) ?? { amountMinor: 0, overdueMinor: 0 },
      }));
  }, [data, today]);

  const setAdding = (open: boolean) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (open) next.set("new", "1");
        else next.delete("new");
        return next;
      },
      { replace: true },
    );

  const count = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <PageHeader
        title="Clients"
        subtitle={`${count(data.clients.length, "client")} · ${count(data.projects.length, "project")}`}
        action={
          <button type="button" onClick={() => setAdding(true)} className={button.primary}>
            <Plus aria-hidden="true" size={16} />
            Add client
          </button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No clients yet"
          action={
            <button type="button" onClick={() => setAdding(true)} className={button.primary}>
              <Plus aria-hidden="true" size={16} />
              Add client
            </button>
          }
        >
          Add a client with their currency and hourly rate, then track time against their projects.
        </EmptyState>
      ) : (
        <>
        {/* Phones get stacked rows so what's owed stays visible without sideways scrolling. */}
        <ul aria-label="Clients" className="divide-y divide-border rounded-lg border border-border bg-surface md:hidden">
          {rows.map(({ client, unbilledMinor, outstanding }) => (
            <li key={client.id}>
              <Link to={`/clients/${client.id}`} className="flex items-center gap-3 px-4 py-3">
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-raised text-label font-bold text-text-secondary">
                  {initials(client.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{client.name}</span>
                  <span className="block text-label text-text-muted">{formatMoney(client.rateMinor, client.currency)}/h</span>
                </span>
                <span className="text-right text-label tabular-nums">
                  <span className="block">
                    <span className="text-text-muted">Unbilled </span>
                    <span className="font-bold">{formatMoney(unbilledMinor, client.currency, "narrow")}</span>
                  </span>
                  {outstanding.amountMinor > 0 && (
                    <span className={`block font-bold ${outstanding.overdueMinor ? "text-overdue" : ""}`}>
                      {formatMoney(outstanding.amountMinor, client.currency, "narrow")} {outstanding.overdueMinor ? "overdue" : "owed"}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div role="region" aria-label="Clients" tabIndex={0} className="hidden overflow-x-auto rounded-lg border border-border bg-surface focus-visible:-outline-offset-2 md:block">
          <table className="w-full min-w-[42rem] text-left text-body">
            <thead className="text-label text-text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Client</th>
                <th scope="col" className="px-5 py-3 font-medium">Rate</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Unbilled</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ client, projectCount, unbilledMinor, outstanding }) => (
                <tr key={client.id} className="relative border-t border-border hover-fine:bg-raised">
                  <th scope="row" className="px-5 py-4 font-normal">
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-raised text-label font-bold text-text-secondary">
                        {initials(client.name)}
                      </span>
                      <div className="min-w-0">
                        {/* The link stretches over the row so the whole row opens the client. */}
                        <Link to={`/clients/${client.id}`} className="block font-semibold text-text after:absolute after:inset-0">
                          {client.name}
                        </Link>
                        <div className="text-label text-text-muted">
                          {client.email || "No email"} · {count(projectCount, "project")}
                        </div>
                      </div>
                    </div>
                  </th>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="rounded-full bg-raised px-3 py-1 text-label font-semibold">
                      {formatMoney(client.rateMinor, client.currency)}/h
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums">
                    {unbilledMinor ? formatMoney(unbilledMinor, client.currency) : <span className="text-text-muted">–</span>}
                  </td>
                  <td
                    className={`whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums ${outstanding.overdueMinor ? "text-overdue" : ""}`}
                  >
                    {outstanding.amountMinor ? (
                      <>
                        {formatMoney(outstanding.amountMinor, client.currency)}
                        {outstanding.overdueMinor > 0 && <span className="block text-label font-bold">Overdue</span>}
                      </>
                    ) : (
                      <span className="text-text-muted">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      <ClientDrawer open={adding} client={null} onClose={() => setAdding(false)} />
    </div>
  );
}
