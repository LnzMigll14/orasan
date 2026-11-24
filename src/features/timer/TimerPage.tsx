import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Lock, Play } from "lucide-react";
import { timerPageData } from "./timerData";

const { projects, timeZone } = timerPageData;

type ProjectId = keyof typeof projects;

type TimeEntry = {
  id: string;
  description: string;
  projectId: ProjectId;
  startedAt: string;
  endedAt: string;
  invoiceId: string | null;
};

type RunningTimer = {
  description: string;
  projectId: ProjectId;
  startedAt: number;
};

const dateKeyFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const dayLabelFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "short",
});

const monthLabelFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  month: "short",
});

const clockTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone,
  hour: "numeric",
  minute: "2-digit",
  hourCycle: "h23",
});

const fieldClass =
  "min-h-11 min-w-0 w-full rounded-md border border-border-strong bg-raised px-4 text-body-mobile text-text md:min-h-10 md:text-body";

function manilaDateKey(instant: string | number) {
  // Build a sortable date key from Manila's calendar fields, regardless of the browser's time zone.
  const parts = dateKeyFormat.formatToParts(new Date(instant));
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function mondayOf(dateKey: string) {
  // Use UTC for calendar arithmetic after the instant has been reduced to a Manila date.
  const date = new Date(`${dateKey}T00:00:00Z`);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}

function secondsBetween(startedAt: number, endedAt: number) {
  // A backward clock adjustment should never display a negative elapsed time.
  return Math.max(0, Math.floor((endedAt - startedAt) / 1000));
}

function entrySeconds({ startedAt, endedAt }: TimeEntry) {
  return secondsBetween(Date.parse(startedAt), Date.parse(endedAt));
}

function formatDayLabel(dateKey: string, today: string) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  if (dateKey !== today) return dayLabelFormat.format(date);

  return `Today, ${date.getUTCDate()} ${monthLabelFormat.format(date)}`;
}

function formatClock(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  return [hours, minutes, remainder]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function formatEntryDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
}

function formatHours(seconds: number) {
  return `${(seconds / 3600).toFixed(1)} h`;
}

function groupEntriesByDay(entries: readonly TimeEntry[]) {
  const groups = new Map<
    string,
    { entries: TimeEntry[]; totalSeconds: number }
  >();

  for (const entry of entries) {
    // Entries belong to the Manila calendar day on which they started.
    const date = manilaDateKey(entry.startedAt);
    const group = groups.get(date) ?? { entries: [], totalSeconds: 0 };

    group.entries.push(entry);
    group.totalSeconds += entrySeconds(entry);
    groups.set(date, group);
  }

  return Array.from(groups, ([date, group]) => ({ date, ...group })).sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export function TimerPage() {
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<ProjectId>(
    timerPageData.defaultProjectId,
  );
  const [running, setRunning] = useState<RunningTimer | null>(null);
  const [now, setNow] = useState(Date.now);

  const [entries, setEntries] = useState<TimeEntry[]>(() =>
    timerPageData.days.flatMap<TimeEntry>((day) => day.entries),
  );

  const isRunning = running !== null;

  useEffect(() => {
    if (!isRunning) return;

    // Read the clock directly so delayed interval ticks don't lose elapsed time.
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [isRunning]);

  const today = manilaDateKey(now);
  const weekStart = mondayOf(today);

  const elapsedSeconds = running
    ? secondsBetween(running.startedAt, now)
    : 0;

  // Rebuild the log when entries change. Clock ticks only update elapsed time and the date range.
  const days = useMemo(() => groupEntriesByDay(entries), [entries]);

  const weeklySeconds = days
    .filter(({ date }) => date >= weekStart && date <= today)
    .reduce((total, { totalSeconds }) => total + totalSeconds, 0);

  function startTimer(task: string, selectedProjectId: ProjectId) {
    const title = task.trim();
    if (!title || running) return;

    const startedAt = Date.now();
    setDescription(title);
    setProjectId(selectedProjectId);
    setNow(startedAt);
    setRunning({ description: title, projectId: selectedProjectId, startedAt });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!running) {
      startTimer(description, projectId);
      return;
    }

    const stoppedAt = Date.now();

    // Save UTC timestamps. Formatting and day grouping use Manila time.
    const entry: TimeEntry = {
      id: crypto.randomUUID(),
      description: running.description,
      projectId: running.projectId,
      startedAt: new Date(running.startedAt).toISOString(),
      endedAt: new Date(stoppedAt).toISOString(),
      invoiceId: null,
    };

    setEntries((previous) => [entry, ...previous]);
    setNow(stoppedAt);
    setRunning(null);
    setDescription("");
  }

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <header>
        <h1 className="text-display">Timer</h1>
        <p className="mt-1 text-body text-text-secondary">
          This week {formatHours(weeklySeconds)}
        </p>
      </header>

      <section
        aria-label="Time tracking"
        className="space-y-5 rounded-lg border border-border bg-surface p-4 md:p-6"
      >
        <div
          role="timer"
          aria-live="off"
          aria-label="Elapsed time"
          className={`text-timer tabular-nums ${isRunning ? "text-amber" : "text-text-muted"}`}
        >
          {formatClock(elapsedSeconds)}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_21rem_auto]"
        >
          <label className="block min-w-0">
            <span className="sr-only">Task description</span>
            <input
              value={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
              placeholder="What are you working on?"
              required
              disabled={isRunning}
              className={`${fieldClass} placeholder:text-text-muted`}
            />
          </label>

          <label className="block min-w-0">
            <span className="sr-only">Project</span>
            <select
              value={projectId}
              onChange={(event) =>
                setProjectId(event.currentTarget.value as ProjectId)
              }
              disabled={isRunning}
              className={`${fieldClass} project-select`}
            >
              {Object.entries(projects).map(([id, project]) => (
                <option key={id} value={id}>
                  {project.client} · {project.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={!isRunning && !description.trim()}
            className="min-h-11 whitespace-nowrap rounded-pill bg-amber px-5 text-body font-bold text-on-amber enabled:cursor-pointer enabled:hover:bg-amber-hover disabled:opacity-60 md:min-h-10"
          >
            {isRunning ? "Stop timer" : "Start timer"}
          </button>
        </form>
      </section>

      <div className="space-y-3">
        {days.map((day) => (
          <TimeLogDay
            key={day.date}
            day={day}
            today={today}
            isRunning={isRunning}
            onResume={startTimer}
          />
        ))}
      </div>
    </div>
  );
}

type TimeLogDayProps = {
  day: ReturnType<typeof groupEntriesByDay>[number];
  today: string;
  isRunning: boolean;
  onResume: (task: string, projectId: ProjectId) => void;
};

function TimeLogDay({ day, today, isRunning, onResume }: TimeLogDayProps) {
  return (
    <section
      aria-labelledby={`timer-day-${day.date}`}
      className="overflow-hidden rounded-lg border border-border bg-surface"
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <h2 id={`timer-day-${day.date}`} className="text-headline">
          {formatDayLabel(day.date, today)}
        </h2>

        <span className="shrink-0 rounded-pill bg-raised px-3 py-1 text-label font-bold tabular-nums">
          {formatHours(day.totalSeconds)}
        </span>
      </header>

      <ul className="divide-y divide-border">
        {day.entries.map((entry) => {
          const project = projects[entry.projectId];
          const billed = Boolean(entry.invoiceId);

          return (
            <li
              key={entry.id}
              className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3 md:px-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_10rem_8rem] ${
                billed ? "bg-canvas text-text-muted" : ""
              }`}
            >
              <p className="col-span-2 min-w-0 text-body font-semibold xl:col-span-1">
                {entry.description}
              </p>

              <p className="col-span-2 min-w-0 text-label text-text-muted xl:col-span-1">
                {project.name} · {project.client}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums xl:grid xl:grid-cols-[5.25rem_auto]">
                <span className="text-label text-text-muted">
                  <time dateTime={entry.startedAt}>
                    {clockTimeFormat.format(new Date(entry.startedAt))}
                  </time>
                  {"–"}
                  <time dateTime={entry.endedAt}>
                    {clockTimeFormat.format(new Date(entry.endedAt))}
                  </time>
                </span>

                <span className="text-body font-bold">
                  {formatEntryDuration(entrySeconds(entry))}
                </span>
              </div>

              {entry.invoiceId ? (
                <span className="inline-flex min-h-11 items-center justify-end gap-2 whitespace-nowrap text-label md:min-h-10">
                  <Lock aria-hidden="true" size={14} />
                  On {entry.invoiceId}
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() =>
                    onResume(entry.description, entry.projectId)
                  }
                  aria-label={`Resume ${entry.description}`}
                  className="inline-flex min-h-11 items-center justify-end gap-2 whitespace-nowrap text-label font-bold text-text-secondary enabled:cursor-pointer enabled:hover:text-text disabled:opacity-60 md:min-h-10"
                >
                  <Play aria-hidden="true" size={14} />
                  Resume
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
