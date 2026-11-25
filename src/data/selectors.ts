import { addDays, billableMinutes, daysBetween, dateKey, entrySeconds } from "../shared/time";
import { amountFor, projectRate } from "./invoicing";
import type { AppData, Client, Currency, Invoice, InvoiceStatus, Project, TimeEntry } from "./types";

// Pure functions that derive what the screens show. Components call them with useMemo.

export function invoiceStatus(invoice: Invoice, today: string): InvoiceStatus {
  return invoice.status === "sent" && invoice.dueOn < today ? "overdue" : invoice.status;
}

export function indexById<T extends { id: string }>(items: readonly T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

export function projectLabel(project: Project | undefined, client: Client | undefined) {
  if (!project) return "Deleted project";
  return client ? `${client.name} · ${project.name}` : project.name;
}

/** Projects grouped under their client, sorted by name, for pickers. */
export function projectOptions(data: AppData) {
  const clients = [...data.clients].sort((a, b) => a.name.localeCompare(b.name));
  return clients
    .map((client) => ({
      client,
      projects: data.projects
        .filter((project) => project.clientId === client.id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.projects.length > 0);
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0] ?? "")
      .join("")
      .toUpperCase() || "?"
  );
}

export type Unbilled = { seconds: number; minutes: number; entries: number; amountMinor: number };

/** Unbilled time and its value for each client, using the rounding setting and project rates. */
export function unbilledByClient(data: AppData) {
  const projects = indexById(data.projects);
  const clients = indexById(data.clients);
  const result = new Map<string, Unbilled>();

  for (const entry of data.entries) {
    if (entry.invoiceId) continue;
    const project = projects.get(entry.projectId);
    const client = project && clients.get(project.clientId);
    if (!project || !client) continue;

    const seconds = entrySeconds(entry);
    const minutes = billableMinutes(seconds, data.settings.roundingMinutes);
    const totals = result.get(client.id) ?? { seconds: 0, minutes: 0, entries: 0, amountMinor: 0 };
    totals.seconds += seconds;
    totals.minutes += minutes;
    totals.entries += 1;
    totals.amountMinor += amountFor(minutes, projectRate(project, client));
    result.set(client.id, totals);
  }
  return result;
}

/** Unbilled seconds for each project. */
export function unbilledSecondsByProject(entries: readonly TimeEntry[]) {
  const result = new Map<string, number>();
  for (const entry of entries) {
    if (entry.invoiceId) continue;
    result.set(entry.projectId, (result.get(entry.projectId) ?? 0) + entrySeconds(entry));
  }
  return result;
}

/** Sent and overdue invoice totals for each client. */
export function outstandingByClient(data: AppData, today: string) {
  const result = new Map<string, { amountMinor: number; overdueMinor: number }>();
  for (const invoice of data.invoices) {
    if (invoice.status !== "sent") continue;
    const totals = result.get(invoice.clientId) ?? { amountMinor: 0, overdueMinor: 0 };
    totals.amountMinor += invoice.totalMinor;
    if (invoiceStatus(invoice, today) === "overdue") totals.overdueMinor += invoice.totalMinor;
    result.set(invoice.clientId, totals);
  }
  return result;
}

export function overdueCount(data: AppData, today: string) {
  return data.invoices.filter((invoice) => invoiceStatus(invoice, today) === "overdue").length;
}

/** Sums amounts per currency. PHP and USD are never added together. */
export function sumByCurrency(items: Iterable<{ currency: Currency; amountMinor: number }>) {
  const totals: Partial<Record<Currency, number>> = {};
  for (const { currency, amountMinor } of items) totals[currency] = (totals[currency] ?? 0) + amountMinor;
  return totals;
}

/** Tracked minutes for each of the last seven Manila days, oldest first. */
export function lastSevenDays(entries: readonly TimeEntry[], today: string, runningSeconds = 0) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
  const minutes = new Map(days.map((day) => [day, 0]));
  for (const entry of entries) {
    const day = dateKey(entry.startedAt);
    if (minutes.has(day)) minutes.set(day, (minutes.get(day) ?? 0) + entrySeconds(entry) / 60);
  }
  minutes.set(today, (minutes.get(today) ?? 0) + runningSeconds / 60);
  return days.map((day) => ({ day, minutes: Math.round(minutes.get(day) ?? 0), isToday: day === today }));
}

/** A short "6 days left" / "11 days late" label and progress for a sent invoice's payment term. */
export function paymentTerm(invoice: Invoice, today: string) {
  if (invoice.status !== "sent") return null;
  const total = Math.max(1, daysBetween(invoice.issuedOn, invoice.dueOn));
  const left = daysBetween(today, invoice.dueOn);
  if (left < 0) {
    const late = -left;
    return { label: `${late} ${late === 1 ? "day" : "days"} late`, progress: 100, overdue: true };
  }
  const progress = Math.min(100, Math.round(((total - left) / total) * 100));
  const label = left === 0 ? "Due today" : `${left} ${left === 1 ? "day" : "days"} left`;
  return { label, progress, overdue: false };
}
