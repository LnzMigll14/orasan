import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { Check, Minus } from "lucide-react";
import { buildInvoiceLines, formatInvoiceNumber, sumLines } from "../../data/invoicing";
import { indexById, unbilledByClient } from "../../data/selectors";
import { createInvoice, nextInvoiceNumber, updateDraftInvoice, useAppData } from "../../data/store";
import type { Client, TimeEntry } from "../../data/types";
import { EmptyState } from "../../shared/components/EmptyState";
import { PageHeader } from "../../shared/components/PageHeader";
import { toast } from "../../shared/components/Toast";
import { formatMoney } from "../../shared/formatMoney";
import { addDays, dateKey, entrySeconds, formatDuration, formatHours, formatShortDay, todayKey } from "../../shared/time";
import { button, card } from "../../shared/ui";
import { NotFoundPage } from "../../app/gates";
import { InvoiceDocument } from "./InvoiceDocument";

/** /invoices/new picks a client; /invoices/new?client=… and /invoices/:id/edit build the invoice. */
export function InvoiceBuilderPage() {
  const data = useAppData();
  const { invoiceId } = useParams();
  const [params] = useSearchParams();

  const editing = invoiceId ? data.invoices.find((invoice) => invoice.id === invoiceId) : undefined;
  if (invoiceId && (!editing || editing.status !== "draft")) return <NotFoundPage />;

  const clientId = editing?.clientId ?? params.get("client");
  const client = clientId ? data.clients.find((item) => item.id === clientId) : undefined;

  if (!client) return <ClientPicker />;
  // Remount when the client changes so the selection starts fresh.
  return <Builder key={client.id} client={client} draftId={editing?.id ?? null} />;
}

function ClientPicker() {
  const data = useAppData();
  const unbilled = useMemo(() => unbilledByClient(data), [data]);
  const ready = data.clients.filter((client) => unbilled.has(client.id)).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <PageHeader back={{ to: "/invoices", label: "Invoices" }} title="New invoice" subtitle="Pick a client with unbilled time." />
      {ready.length === 0 ? (
        <EmptyState
          title="No unbilled time to invoice"
          action={
            <Link to={data.clients.length ? "/timer" : "/clients?new=1"} className={button.primary}>
              {data.clients.length ? "Go to Timer" : "Add client"}
            </Link>
          }
        >
          Invoices are built from tracked time. Track some time for a client, then come back.
        </EmptyState>
      ) : (
        <ul className={`${card} divide-y divide-border`}>
          {ready.map((client) => {
            const totals = unbilled.get(client.id)!;
            return (
              <li key={client.id}>
                <Link
                  to={`/invoices/new?client=${client.id}`}
                  className="flex min-h-14 items-center justify-between gap-4 px-5 py-3 hover-fine:bg-raised"
                >
                  <span>
                    <span className="block font-bold">{client.name}</span>
                    <span className="text-label text-text-muted">
                      {(totals.minutes / 60).toFixed(1)} h · {totals.entries} {totals.entries === 1 ? "entry" : "entries"}
                    </span>
                  </span>
                  <span className="font-bold tabular-nums">{formatMoney(totals.amountMinor, client.currency)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Builder({ client, draftId }: { client: Client; draftId: string | null }) {
  const data = useAppData();
  const navigate = useNavigate();
  const today = todayKey();
  const draft = draftId ? data.invoices.find((invoice) => invoice.id === draftId) : undefined;

  // Unbilled entries for this client, plus the ones already on the draft being edited.
  const groups = useMemo(() => {
    const projects = data.projects.filter((project) => project.clientId === client.id);
    const projectIds = new Set(projects.map((project) => project.id));
    const entries = data.entries.filter(
      (entry) => projectIds.has(entry.projectId) && (entry.invoiceId === null || entry.invoiceId === draftId),
    );
    return projects
      .map((project) => ({
        project,
        entries: entries.filter((entry) => entry.projectId === project.id).sort((a, b) => a.startedAt.localeCompare(b.startedAt)),
      }))
      .filter((group) => group.entries.length > 0)
      .sort((a, b) => a.project.name.localeCompare(b.project.name));
  }, [data.projects, data.entries, client.id, draftId]);

  const allEntries = useMemo(() => groups.flatMap((group) => group.entries), [groups]);
  // Entries come pre-selected: every unbilled entry for a new invoice, the draft's entries when editing.
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(draft ? draft.entryIds : allEntries.map((entry) => entry.id)),
  );
  const [error, setError] = useState<string | null>(null);

  const chosen = useMemo(() => allEntries.filter((entry) => selected.has(entry.id)), [allEntries, selected]);
  const lines = useMemo(() => buildInvoiceLines(data, chosen), [data, chosen]);
  const lineByProject = indexById(lines.map((line) => ({ ...line, id: line.projectId })));
  const total = sumLines(lines);
  const seconds = chosen.reduce((sum, entry) => sum + entrySeconds(entry), 0);
  const number = draft?.number ?? formatInvoiceNumber(data.settings.invoice.prefix, nextInvoiceNumber(data));

  function toggle(entries: TimeEntry[], on: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      for (const entry of entries) {
        if (on) next.add(entry.id);
        else next.delete(entry.id);
      }
      return next;
    });
  }

  function save(send: boolean) {
    const ids = chosen.map((entry) => entry.id);
    const result = draftId ? updateDraftInvoice(draftId, ids, send) : createInvoice({ clientId: client.id, entryIds: ids, send });
    if (!result.ok) return setError(result.error);
    toast(send ? "Invoice ready to send. Copy the link or message to your client." : "Draft saved");
    navigate(`/invoices/${result.value}`, { replace: true });
  }

  if (groups.length === 0) {
    return (
      <div className="mx-auto w-full max-w-(--size-content) space-y-5">
        <PageHeader back={{ to: `/clients/${client.id}`, label: client.name }} title={`New invoice for ${client.name}`} />
        <EmptyState title="No unbilled time for this client" action={<Link to="/timer" className={button.primary}>Go to Timer</Link>}>
          All of {client.name}'s tracked time is already on an invoice.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <PageHeader
        back={draft ? { to: `/invoices/${draft.id}`, label: draft.number } : { to: "/", label: "Dashboard" }}
        title={draft ? `Edit ${draft.number}` : `New invoice for ${client.name}`}
        subtitle={`${number} · entries are pre-selected by project`}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {groups.map(({ project, entries }) => {
            const picked = entries.filter((entry) => selected.has(entry.id)).length;
            const state = picked === entries.length ? "all" : picked === 0 ? "none" : "some";
            const line = lineByProject.get(project.id);
            return (
              <fieldset key={project.id} className={`${card} overflow-hidden`}>
                <legend className="sr-only">{project.name}</legend>
                <label className="flex min-h-14 cursor-pointer items-center gap-3 border-b border-border px-4 md:px-5">
                  <Checkbox
                    checked={state === "all"}
                    mixed={state === "some"}
                    onChange={(on) => toggle(entries, on)}
                    label={`All ${project.name} entries`}
                  />
                  <span className="flex-1 font-bold">{project.name}</span>
                  <span className="font-bold tabular-nums">{formatMoney(line?.amountMinor ?? 0, client.currency)}</span>
                </label>
                <ul className="divide-y divide-border">
                  {entries.map((entry) => (
                    <li key={entry.id}>
                      <label className="flex min-h-12 cursor-pointer items-center gap-3 px-4 py-2 md:px-5">
                        <Checkbox
                          checked={selected.has(entry.id)}
                          onChange={(on) => toggle([entry], on)}
                          label={entry.description || "No description"}
                        />
                        <span className={`min-w-0 flex-1 ${entry.description ? "" : "text-text-muted"}`} aria-hidden="true">
                          {entry.description || "No description"}
                        </span>
                        <span className="text-label text-text-muted">{formatShortDay(dateKey(entry.startedAt))}</span>
                        <span className="w-12 text-right font-bold tabular-nums">{formatDuration(entrySeconds(entry))}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            );
          })}
        </div>

        {/* Below xl the column dissolves so the total and actions sit above the entries and the preview below. */}
        <div className="contents xl:sticky xl:top-6 xl:block xl:space-y-4">
          <section aria-label="Invoice total" className={`${card} order-first flex flex-wrap items-center justify-between gap-4 p-5 xl:order-none`}>
            <div>
              <p className="text-label text-text-muted">
                {chosen.length} of {allEntries.length} entries · {formatHours(seconds)}
                {data.settings.roundingMinutes > 0 && `, rounded up to ${data.settings.roundingMinutes} min`}
              </p>
              <p className="text-stat tabular-nums">{formatMoney(total, client.currency)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={chosen.length === 0} onClick={() => save(false)} className={button.secondary}>
                Save draft
              </button>
              <button type="button" disabled={chosen.length === 0} onClick={() => save(true)} className={button.primary}>
                Send invoice
              </button>
            </div>
            {chosen.length === 0 && <p className="w-full text-label text-text-muted">Pick at least one entry.</p>}
            {error && (
              <p role="alert" className="w-full text-body text-overdue">
                {error}
              </p>
            )}
          </section>

          <InvoiceDocument
            profile={data.profile}
            number={number}
            status="draft"
            currency={client.currency}
            issuedOn={today}
            dueOn={addDays(today, data.settings.invoice.dueDays)}
            billedTo={{ name: client.name, email: client.email }}
            lines={lines}
            totalMinor={total}
            payment={null}
            paymentMethods={data.settings.payments}
          />
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, mixed, onChange, label }: { checked: boolean; mixed?: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <span className="relative grid size-5 shrink-0 place-items-center">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        ref={(node) => {
          if (node) node.indeterminate = Boolean(mixed);
        }}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className="peer size-5 cursor-pointer appearance-none rounded-xs border border-border-strong bg-raised checked:border-amber checked:bg-amber indeterminate:border-amber indeterminate:bg-amber"
      />
      {(checked || mixed) && (
        <span aria-hidden="true" className="pointer-events-none absolute text-on-amber">
          {mixed ? <Minus size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
        </span>
      )}
    </span>
  );
}
