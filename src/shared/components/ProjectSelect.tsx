import { ChevronDown } from "lucide-react";
import "./ProjectSelect.css";

// Dashboard and Clients share these options. The IDs stay stable when labels change.
const projects = [
  { id: "reyes-brand-refresh", label: "Reyes · Brand refresh" },
  { id: "reyes-website-build", label: "Reyes · Website build" },
  { id: "kalye-menu-copy", label: "Kalye · Menu copy" },
  { id: "kalye-social-captions", label: "Kalye · Social captions" },
  { id: "northwind-va-retainer", label: "Northwind · VA retainer" },
  { id: "northwind-inbox-calendar", label: "Northwind · Inbox & calendar" },
];

export function ProjectSelect() {
  return (
    <div className="relative col-span-2 md:w-64">
      {/* The browser owns selection, keyboard navigation, and the popup's open state. */}
      <select
        aria-label="Project"
        name="project"
        className="project-select h-(--size-control-touch) w-full cursor-pointer rounded-pill border border-border-strong bg-raised pr-10 pl-4 text-body-mobile md:h-(--size-control) md:text-body"
        onPointerDown={(event) => {
          event.currentTarget.dataset.pickerMotion = "pointer";
        }}
        onKeyDown={(event) => {
          // Keep keyboard opening and navigation immediate.
          delete event.currentTarget.dataset.pickerMotion;
        }}
      >
        {projects.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
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
