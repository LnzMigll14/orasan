import { billableMinutes, dateKey, entrySeconds } from "../shared/time";
import type { AppData, Client, InvoiceLine, Project, TimeEntry } from "./types";

export function projectRate(project: Project, client: Client) {
  return project.rateMinor ?? client.rateMinor;
}

/** Minutes × hourly rate, rounded to the nearest centavo or cent. */
export function amountFor(minutes: number, rateMinor: number) {
  return Math.round((minutes * rateMinor) / 60);
}

/**
 * Groups entries into one invoice line per project. Each entry is rounded on its own
 * (the rounding setting), then the line amount is billable minutes × the project's rate.
 */
export function buildInvoiceLines(
  data: Pick<AppData, "projects" | "clients" | "settings">,
  entries: readonly TimeEntry[],
): InvoiceLine[] {
  const projectById = new Map(data.projects.map((project) => [project.id, project]));
  const clientById = new Map(data.clients.map((client) => [client.id, client]));
  const lines = new Map<string, InvoiceLine>();

  for (const entry of entries) {
    const project = projectById.get(entry.projectId);
    const client = project && clientById.get(project.clientId);
    if (!project || !client) continue;

    const minutes = billableMinutes(entrySeconds(entry), data.settings.roundingMinutes);
    const day = dateKey(entry.startedAt);
    const line = lines.get(project.id) ?? {
      projectId: project.id,
      description: project.name,
      minutes: 0,
      rateMinor: projectRate(project, client),
      amountMinor: 0,
      firstDate: day,
      lastDate: day,
    };

    line.minutes += minutes;
    if (day < line.firstDate) line.firstDate = day;
    if (day > line.lastDate) line.lastDate = day;
    lines.set(project.id, line);
  }

  return Array.from(lines.values(), (line) => ({
    ...line,
    amountMinor: amountFor(line.minutes, line.rateMinor),
  })).sort((a, b) => a.description.localeCompare(b.description));
}

export function sumLines(lines: readonly InvoiceLine[]) {
  return lines.reduce((total, line) => total + line.amountMinor, 0);
}

export function formatInvoiceNumber(prefix: string, number: number) {
  return `${prefix}${String(number).padStart(4, "0")}`;
}
