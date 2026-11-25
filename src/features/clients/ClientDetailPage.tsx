import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { outstandingByClient, unbilledByClient, unbilledSecondsByProject } from "../../data/selectors";
import { deleteClient, useAppData } from "../../data/store";
import type { Project, TimeEntry } from "../../data/types";
import { EmptyState } from "../../shared/components/EmptyState";
import { ConfirmDialog } from "../../shared/components/Modal";
import { PageHeader } from "../../shared/components/PageHeader";
import { toast } from "../../shared/components/Toast";
import { formatMoney } from "../../shared/formatMoney";
import { formatHours, todayKey } from "../../shared/time";
import { button } from "../../shared/ui";
import { NotFoundPage } from "../../app/gates";
import { InvoiceTable } from "../invoices/InvoiceTable";
import { EntryDialog } from "../timer/EntryDialog";
import { TimeLog } from "../timer/TimeLog";
import { ClientDrawer } from "./ClientDrawer";
import { ProjectDialog } from "./ProjectDialog";

export function ClientDetailPage() {
  const { clientId } = useParams();
  const data = useAppData();
  const navigate = useNavigate();
  const today = todayKey();
  const [editingClient, setEditingClient] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [projectDialog, setProjectDialog] = useState<{ project: Project | null } | null>(null);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const client = data.clients.find((item) => item.id === clientId);

  const details = useMemo(() => {
    if (!client) return null;
    const projects = data.projects
      .filter((project) => project.clientId === client.id)
      .sort((a, b) => a.name.localeCompare(b.name));
    const projectIds = new Set(projects.map((project) => project.id));
    const entries = data.entries.filter((entry) => projectIds.has(entry.projectId) && !entry.invoiceId);
    return {
      projects,
      entries,
      unbilledSeconds: unbilledSecondsByProject(entries),
      unbilled: unbilledByClient(data).get(client.id),
      outstanding: outstandingByClient(data, today).get(client.id),
      invoices: data.invoices
        .filter((invoice) => invoice.clientId === client.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  }, [client, data, today]);

  if (!client || !details) return <NotFoundPage />;

  const { projects, entries, unbilledSeconds, unbilled, outstanding, invoices } = details;
  const owed = outstanding?.amountMinor ?? 0;
  const overdue = outstanding?.overdueMinor ?? 0;

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-6">
      <PageHeader
        back={{ to: "/clients", label: "Clients" }}
        title={client.name}
        action={
          unbilled ? (
            <Link to={`/invoices/new?client=${client.id}`} className={button.primary}>
              <Plus aria-hidden="true" size={16} />
              Create invoice
            </Link>
          ) : undefined
        }
      />

      <section aria-label="Client details" className="flex flex-wrap items-start justify-between gap-4">
        <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-5">
          <Detail label="Contact" value={client.contact || "—"} />
          <Detail label="Email" value={client.email || "—"} />
          <Detail label="Rate" value={`${formatMoney(client.rateMinor, client.currency)}/h · ${client.currency}`} />
          <Detail label="Unbilled" value={formatMoney(unbilled?.amountMinor ?? 0, client.currency)} />
          <Detail
            label="Owed on invoices"
            value={
              owed === 0
                ? "Nothing owed"
                : `${formatMoney(owed, client.currency)}${overdue === owed ? ", all overdue" : overdue ? `, ${formatMoney(overdue, client.currency)} overdue` : ""}`
            }
            tone={overdue ? "overdue" : undefined}
          />
        </dl>
        <div className="flex gap-2">
          <button type="button" onClick={() => setEditingClient(true)} className={button.secondary}>
            <Pencil aria-hidden="true" size={15} />
            Edit
          </button>
          <button
            type="button"
            onClick={() =>
              invoices.length
                ? toast(`${client.name} has invoices, so they can't be deleted. Delete their invoices first.`, "error")
                : setConfirmingDelete(true)
            }
            aria-label={`Delete ${client.name}`}
            className={button.secondary}
          >
            <Trash2 aria-hidden="true" size={15} />
            Delete
          </button>
        </div>
      </section>

      <section aria-labelledby="projects-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="projects-heading" className="text-headline">
            Projects
          </h2>
          <button type="button" onClick={() => setProjectDialog({ project: null })} className={button.link}>
            <Plus aria-hidden="true" size={14} />
            Add project
          </button>
        </div>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet">Add a project to track time for {client.name}.</EmptyState>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-body">
              <thead className="text-label text-text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Project</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Rate</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Unbilled</th>
                  <th scope="col" className="w-14 px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-t border-border">
                    <th scope="row" className="px-5 py-3 font-normal">
                      <span className="block font-semibold">{project.name}</span>
                      <span className="text-label text-text-muted">{project.rateMinor === null ? "Client rate" : "Own rate"}</span>
                    </th>
                    <td className="whitespace-nowrap px-3 py-3 text-right">
                      <span className="rounded-pill bg-raised px-3 py-1 text-label font-bold">
                        {formatMoney(project.rateMinor ?? client.rateMinor, client.currency)}/h
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-bold tabular-nums">
                      {formatHours(unbilledSeconds.get(project.id) ?? 0)}
                    </td>
                    <td className="px-2 py-1 text-right">
                      <button
                        type="button"
                        aria-label={`Edit ${project.name}`}
                        onClick={() => setProjectDialog({ project })}
                        className={button.icon}
                      >
                        <Pencil aria-hidden="true" size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="invoices-heading" className="space-y-3">
        <h2 id="invoices-heading" className="text-headline">
          Invoices
        </h2>
        {invoices.length === 0 ? (
          <p className="text-body text-text-secondary">No invoices for {client.name} yet.</p>
        ) : (
          <InvoiceTable invoices={invoices} today={today} label={`Invoices for ${client.name}`} />
        )}
      </section>

      <section aria-labelledby="unbilled-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="unbilled-heading" className="text-headline">
            Unbilled time
          </h2>
          {unbilled && (
            <span className="rounded-pill bg-raised px-3 py-1 text-label font-bold tabular-nums">
              {formatMoney(unbilled.amountMinor, client.currency)}
            </span>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="text-body text-text-secondary">
            {data.entries.some((entry) => projects.some((project) => project.id === entry.projectId))
              ? `All tracked time for ${client.name} is on an invoice.`
              : `No time tracked for ${client.name} yet. Pick one of their projects in the timer to start.`}
          </p>
        ) : (
          <TimeLog data={data} entries={entries} today={today} onEdit={setEditingEntry} showClient={false} />
        )}
      </section>

      <ClientDrawer open={editingClient} client={client} onClose={() => setEditingClient(false)} />
      <ProjectDialog
        open={projectDialog !== null}
        client={client}
        project={projectDialog?.project ?? null}
        onClose={() => setProjectDialog(null)}
      />
      <EntryDialog open={editingEntry !== null} entry={editingEntry} onClose={() => setEditingEntry(null)} />
      <ConfirmDialog
        open={confirmingDelete}
        title={`Delete ${client.name}?`}
        description={`This deletes the client, ${projects.length} ${projects.length === 1 ? "project" : "projects"} and all of their tracked time. This can't be undone.`}
        confirmLabel="Delete client"
        onConfirm={() => {
          const result = deleteClient(client.id);
          if (!result.ok) return toast(result.error, "error");
          toast(`${client.name} deleted`);
          navigate("/clients");
        }}
        onClose={() => setConfirmingDelete(false)}
      />
    </div>
  );
}

function Detail({ label, value, tone }: { label: string; value: string; tone?: "overdue" }) {
  return (
    <div className="min-w-0">
      <dt className="text-label text-text-muted">{label}</dt>
      <dd className={`truncate text-body font-bold ${tone === "overdue" ? "text-overdue" : ""}`} title={value}>
        {value}
      </dd>
    </div>
  );
}
