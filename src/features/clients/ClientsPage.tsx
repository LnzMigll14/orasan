import { Plus } from "lucide-react";
import { ProjectSelect } from "../../shared/components/ProjectSelect";
import { StartTimerLink } from "../../shared/components/StartTimerLink";
import { formatMoney } from "../../shared/formatMoney";
import { clientsPageData } from "./clientsData";

const { clients, projectCount } = clientsPageData;

export function ClientsPage() {
  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display">Clients</h1>
          <p className="mt-1 text-body text-text-secondary">
            {clients.length} clients - {projectCount} projects
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:items-center md:gap-3">
          <ProjectSelect />

          <StartTimerLink />

          <button
            type="button"
            disabled
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-amber rounded-pill px-4 text-body text-on-amber disabled: cursor-not-allowed font-bold"
          >
            <Plus size={16} aria-hidden="true" />
            Add client
          </button>
        </div>
      </header>

      {/* Keep each row readable on narrow screens by scrolling the table horizontally. */}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[42rem] text-left text-body">
          <thead className="text-label text-text-muted">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Client
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Rate
              </th>
              <th scope="col" className="px-5 py-3 font-medium text-right">
                Unbilled
              </th>
              <th scope="col" className="px-5 py-3 font-medium text-right">
                Outstanding
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                <span className="sr-only">Contact</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t border-border">
                <th scope="row" className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border grid size-9 shrink-0 place-items-center bg-raised border-border">
                      {client.initials}
                    </span>

                    <div>
                      <div className="font-semibold">{client.name}</div>
                      <div className="text-label font-normal text-text-muted">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </th>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className="rounded-full bg-raised px-3 py-1 text-label font-semibold">
                    {formatMoney(client.hourlyRateMinor, client.currency)}
                    /h
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums ">
                  {formatMoney(client.unbilledMinor, client.currency)}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums text-overdue">
                  {client.outstandingMinor === 0
                    ? "-"
                    : formatMoney(client.outstandingMinor, client.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
