import { useMemo } from "react";
import { Link } from "react-router";
import { Lock, Pencil, Play } from "lucide-react";
import { indexById } from "../../data/selectors";
import { startTimer } from "../../data/store";
import type { AppData, TimeEntry } from "../../data/types";
import { toast } from "../../shared/components/Toast";
import { dateKey, entrySeconds, formatClockTime, formatDayLabel, formatDuration, formatHours } from "../../shared/time";
import { button } from "../../shared/ui";

export function groupEntriesByDay(entries: readonly TimeEntry[]) {
  const groups = new Map<string, { entries: TimeEntry[]; totalSeconds: number }>();
  for (const entry of entries) {
    // Entries belong to the Manila calendar day on which they started.
    const day = dateKey(entry.startedAt);
    const group = groups.get(day) ?? { entries: [], totalSeconds: 0 };
    group.entries.push(entry);
    group.totalSeconds += entrySeconds(entry);
    groups.set(day, group);
  }
  return Array.from(groups, ([day, group]) => ({
    day,
    ...group,
    entries: group.entries.sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
  })).sort((a, b) => b.day.localeCompare(a.day));
}

type Props = {
  data: AppData;
  entries: readonly TimeEntry[];
  today: string;
  onEdit: (entry: TimeEntry) => void;
  /** Show the client name next to each project (the Timer page does; a client's page doesn't). */
  showClient?: boolean;
};

/** Entries grouped by day with totals. Billed entries are locked and link to their invoice. */
export function TimeLog({ data, entries, today, onEdit, showClient = true }: Props) {
  const days = useMemo(() => groupEntriesByDay(entries), [entries]);
  const projects = useMemo(() => indexById(data.projects), [data.projects]);
  const clients = useMemo(() => indexById(data.clients), [data.clients]);
  const invoices = useMemo(() => indexById(data.invoices), [data.invoices]);
  const runningId = data.runningTimer;

  return (
    <div className="space-y-3">
      {days.map((day) => (
        <section key={day.day} aria-labelledby={`log-${day.day}`} className="overflow-hidden rounded-lg border border-border bg-surface">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
            <h2 id={`log-${day.day}`} className="text-headline">
              {formatDayLabel(day.day, today)}
            </h2>
            <span className="shrink-0 rounded-pill bg-raised px-3 py-1 text-label font-bold tabular-nums">
              {formatHours(day.totalSeconds)}
            </span>
          </header>

          <ul className="divide-y divide-border">
            {day.entries.map((entry) => {
              const project = projects.get(entry.projectId);
              const client = project && clients.get(project.clientId);
              const invoice = entry.invoiceId ? invoices.get(entry.invoiceId) : undefined;
              const name = entry.description || "No description";

              return (
                <li
                  key={entry.id}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3 md:px-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_10rem_11rem] ${
                    entry.invoiceId ? "bg-canvas text-text-muted" : ""
                  }`}
                >
                  <p className={`col-span-2 min-w-0 text-body font-semibold xl:col-span-1 ${entry.description ? "" : "text-text-muted"}`}>
                    {name}
                  </p>
                  <p className="col-span-2 min-w-0 truncate text-label text-text-muted xl:col-span-1">
                    {project?.name ?? "Deleted project"}
                    {showClient && client ? ` · ${client.name}` : ""}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums xl:grid xl:grid-cols-[5.25rem_auto]">
                    <span className="text-label text-text-muted">
                      <time dateTime={entry.startedAt}>{formatClockTime(entry.startedAt)}</time>–
                      <time dateTime={entry.endedAt}>{formatClockTime(entry.endedAt)}</time>
                    </span>
                    <span className="text-body font-bold">{formatDuration(entrySeconds(entry))}</span>
                  </div>

                  {entry.invoiceId ? (
                    <Link
                      to={`/invoices/${entry.invoiceId}`}
                      className="inline-flex min-h-11 items-center justify-end gap-2 whitespace-nowrap text-label hover-fine:text-text md:min-h-10"
                    >
                      <Lock aria-hidden="true" size={14} />
                      On {invoice?.number ?? "an invoice"}
                    </Link>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          startTimer(entry.projectId, entry.description);
                          toast(runningId ? "Switched the timer to this task" : "Timer started");
                        }}
                        aria-label={`Resume ${name}`}
                        className={`${button.link} px-2`}
                      >
                        <Play aria-hidden="true" size={14} />
                        Resume
                      </button>
                      <button type="button" onClick={() => onEdit(entry)} aria-label={`Edit ${name}`} className={button.icon}>
                        <Pencil aria-hidden="true" size={15} />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
