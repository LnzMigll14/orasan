import { useId, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { discardTimer, startTimer, stopTimer, updateRunningTimer, useAppData } from "../../data/store";
import type { TimeEntry } from "../../data/types";
import { EmptyState } from "../../shared/components/EmptyState";
import { PageHeader } from "../../shared/components/PageHeader";
import { ProjectPicker, defaultProjectId } from "../../shared/components/ProjectPicker";
import { toast } from "../../shared/components/Toast";
import { useNow } from "../../shared/hooks";
import { dateKey, entrySeconds, formatClock, formatDuration, formatHours, mondayOf, secondsBetween, todayKey } from "../../shared/time";
import { button, control } from "../../shared/ui";
import { EntryDialog } from "./EntryDialog";
import { TimeLog } from "./TimeLog";

export function TimerPage() {
  const data = useAppData();
  const running = data.runningTimer;
  const now = useNow(running !== null);
  const today = todayKey(now);
  const descriptionId = useId();
  const projectId = useId();

  // While stopped, the form holds what the next timer will track. While running it edits the timer.
  const [description, setDescription] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ entry: TimeEntry | null } | null>(null);

  const selectedProject = running?.projectId ?? (picked && data.projects.some((p) => p.id === picked) ? picked : defaultProjectId(data));
  const elapsed = running ? secondsBetween(Date.parse(running.startedAt), now) : 0;

  const weeklySeconds = useMemo(() => {
    const weekStart = mondayOf(today);
    return data.entries
      .filter((entry) => {
        const day = dateKey(entry.startedAt);
        return day >= weekStart && day <= today;
      })
      .reduce((total, entry) => total + entrySeconds(entry), 0);
  }, [data.entries, today]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (running) {
      const entry = stopTimer();
      toast(entry ? `Saved ${formatDuration(entrySeconds(entry))} to the log` : "Timer stopped");
      return;
    }
    if (!selectedProject) return;
    startTimer(selectedProject, description);
    setDescription("");
  }

  if (data.projects.length === 0) {
    return (
      <div className="mx-auto w-full max-w-(--size-content) space-y-5">
        <PageHeader title="Timer" timer={false} />
        <EmptyState
          title="Add a client first"
          action={
            <Link to="/clients?new=1" className={button.primary}>
              <Plus aria-hidden="true" size={16} />
              Add client
            </Link>
          }
        >
          Time is tracked against a client's project, so the rate is always known.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-(--size-content) space-y-5">
      <PageHeader
        title="Timer"
        subtitle={`This week ${formatHours(weeklySeconds + elapsed)}`}
        timer={false}
        action={
          <button type="button" onClick={() => setEditing({ entry: null })} className={button.secondary}>
            <Plus aria-hidden="true" size={16} />
            Add entry
          </button>
        }
      />

      <section aria-label="Time tracking" className="space-y-5 rounded-lg border border-border bg-surface p-4 md:p-6">
        <div
          role="timer"
          aria-live="off"
          aria-label="Elapsed time"
          className={`text-timer tabular-nums ${running ? "text-amber" : "text-text-muted"}`}
        >
          {formatClock(elapsed)}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_21rem_auto]">
          <div className="min-w-0">
            <label htmlFor={descriptionId} className="sr-only">
              Task description
            </label>
            <input
              id={descriptionId}
              value={running ? running.description : description}
              maxLength={200}
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (running) updateRunningTimer({ description: value });
                else setDescription(value);
              }}
              placeholder="What are you working on?"
              className={control}
            />
          </div>

          <div className="min-w-0">
            <label htmlFor={projectId} className="sr-only">
              Project
            </label>
            <ProjectPicker
              id={projectId}
              data={data}
              shape="field"
              value={selectedProject}
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (running) updateRunningTimer({ projectId: value });
                else setPicked(value);
              }}
            />
          </div>

          <button type="submit" className={button.primary}>
            {running ? "Stop timer" : "Start timer"}
          </button>
        </form>

        {running && (
          <button
            type="button"
            onClick={() => {
              discardTimer();
              toast("Timer discarded");
            }}
            className={button.link}
          >
            Discard this timer
          </button>
        )}
      </section>

      {data.entries.length === 0 ? (
        <EmptyState title="No time tracked yet">
          Start the timer above, or add an entry by hand for work you've already done.
        </EmptyState>
      ) : (
        <TimeLog data={data} entries={data.entries} today={today} onEdit={(entry) => setEditing({ entry })} />
      )}

      <EntryDialog open={editing !== null} entry={editing?.entry ?? null} onClose={() => setEditing(null)} />
    </div>
  );
}
