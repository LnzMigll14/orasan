import { useState } from "react";
import { Link } from "react-router";
import { Play, Square } from "lucide-react";
import { indexById, projectLabel } from "../../data/selectors";
import { startTimer, stopTimer, useAppData } from "../../data/store";
import { useNow } from "../hooks";
import { entrySeconds, formatClock, formatDuration, secondsBetween } from "../time";
import { button } from "../ui";
import { ProjectPicker, defaultProjectId } from "./ProjectPicker";
import { toast } from "./Toast";

/**
 * Start or stop the timer from any page header in one tap. The running timer lives in the
 * store, so it keeps going across pages and page refreshes.
 */
export function QuickTimer() {
  const data = useAppData();
  const running = data.runningTimer;
  const now = useNow(running !== null);
  const [picked, setPicked] = useState<string | null>(null);
  const projectId = picked && data.projects.some((p) => p.id === picked) ? picked : defaultProjectId(data);

  if (data.projects.length === 0) {
    return (
      <Link to="/clients?new=1" className={`${button.secondary} col-span-2`}>
        Add a client to start tracking
      </Link>
    );
  }

  if (running) {
    const project = data.projects.find((p) => p.id === running.projectId);
    const client = project && indexById(data.clients).get(project.clientId);
    const elapsed = secondsBetween(Date.parse(running.startedAt), now);

    return (
      <>
        <Link
          to="/timer"
          className="col-span-2 flex h-(--size-control-touch) min-w-0 items-center gap-2 rounded-pill border border-amber/50 bg-amber-tint px-4 text-body md:h-(--size-control) md:w-64"
        >
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-amber motion-safe:animate-pulse" />
          <span className="min-w-0 flex-1 truncate">{projectLabel(project, client)}</span>
          <span className="font-bold text-amber tabular-nums" aria-label="Elapsed time">
            {formatClock(elapsed)}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => {
            const entry = stopTimer();
            toast(entry ? `Saved ${formatDuration(entrySeconds(entry))} to the log` : "Timer stopped");
          }}
          className={button.secondary}
        >
          <Square aria-hidden="true" size={14} />
          Stop timer
        </button>
      </>
    );
  }

  return (
    <>
      <ProjectPicker
        data={data}
        aria-label="Project to track"
        value={projectId}
        onChange={(event) => setPicked(event.currentTarget.value)}
        className="col-span-2 md:w-64"
      />
      <button
        type="button"
        onClick={() => {
          startTimer(projectId, "");
          toast("Timer started");
        }}
        className={button.secondary}
      >
        <Play aria-hidden="true" size={14} />
        Start timer
      </button>
    </>
  );
}
