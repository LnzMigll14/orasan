import { ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import type { AppData } from "../../data/types";
import { projectOptions } from "../../data/selectors";
import "./ProjectSelect.css";

type ProjectPickerProps = Omit<ComponentPropsWithoutRef<"select">, "children"> & {
  data: AppData;
  className?: string;
  /** Pills in page headers, field-shaped inside forms. */
  shape?: "pill" | "field";
};

/** A project select grouped by client. Uses the customizable select popup where supported. */
export function ProjectPicker({ data, className = "", shape = "pill", ...selectProps }: ProjectPickerProps) {
  const groups = projectOptions(data);

  return (
    <div className={`relative ${className}`}>
      <select
        {...selectProps}
        className={`project-select h-(--size-control-touch) w-full cursor-pointer border border-border-strong bg-raised pr-10 pl-4 text-body-mobile disabled:cursor-not-allowed disabled:opacity-60 md:h-(--size-control) md:text-body ${shape === "pill" ? "rounded-pill" : "rounded-md"}`}
        onPointerDown={(event) => {
          event.currentTarget.dataset.pickerMotion = "pointer";
        }}
        onKeyDown={(event) => {
          // Keep keyboard opening and navigation immediate.
          delete event.currentTarget.dataset.pickerMotion;
        }}
      >
        {groups.map(({ client, projects }) => (
          <optgroup key={client.id} label={client.name}>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {client.name} · {project.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={16}
        strokeWidth={1.75}
        className="project-select-chevron pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-secondary"
      />
    </div>
  );
}

/** The project to preselect: the running timer's, else the most recently tracked, else the first. */
export function defaultProjectId(data: AppData) {
  if (data.runningTimer) return data.runningTimer.projectId;
  const latest = data.entries.reduce<AppData["entries"][number] | null>(
    (best, entry) => (!best || entry.startedAt > best.startedAt ? entry : best),
    null,
  );
  if (latest && data.projects.some((project) => project.id === latest.projectId)) return latest.projectId;
  return projectOptions(data)[0]?.projects[0]?.id ?? "";
}
