import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { control } from "../ui";
import "./ProjectSelect.css";

type FieldChrome = {
  label: string;
  help?: ReactNode;
  error?: string | null;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
  className?: string;
};

function FieldFrame({
  id,
  label,
  help,
  error,
  hideLabel,
  className = "",
  children,
}: FieldChrome & { id: string; children: ReactNode }) {
  return (
    <div className={`grid content-start gap-2 ${className}`}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : "text-label font-bold"}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-label text-overdue">
          {error}
        </p>
      ) : (
        help && (
          <p id={`${id}-help`} className="text-label text-text-muted">
            {help}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, help: unknown, error: unknown) {
  if (error) return `${id}-error`;
  return help ? `${id}-help` : undefined;
}

export function Field({
  label,
  help,
  error,
  hideLabel,
  className,
  prefix,
  ...inputProps
}: ComponentPropsWithoutRef<"input"> & FieldChrome & { prefix?: string }) {
  const id = useId();
  const input = (
    <input
      {...inputProps}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, help, error)}
      className={`${control} ${prefix ? "pl-9 text-right tabular-nums" : ""}`}
    />
  );

  return (
    <FieldFrame id={id} label={label} help={help} error={error} hideLabel={hideLabel} className={className}>
      {prefix ? (
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary"
          >
            {prefix}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
    </FieldFrame>
  );
}

export function SelectField({
  label,
  help,
  error,
  hideLabel,
  className,
  children,
  ...selectProps
}: ComponentPropsWithoutRef<"select"> & FieldChrome) {
  const id = useId();

  return (
    <FieldFrame id={id} label={label} help={help} error={error} hideLabel={hideLabel} className={className}>
      <div className="relative">
        <select
          {...selectProps}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, help, error)}
          className={`project-select ${control} cursor-pointer appearance-none pr-10`}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          size={16}
          className="project-select-chevron pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-secondary"
        />
      </div>
    </FieldFrame>
  );
}

/** A labelled on/off switch with a 44px hit area. */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group grid size-11 shrink-0 cursor-pointer place-items-center rounded-pill"
    >
      <span
        aria-hidden="true"
        className="flex h-[26px] w-11 items-center rounded-pill border border-border-strong bg-[#3a4052] p-[3px] group-aria-checked:border-amber group-aria-checked:bg-amber"
      >
        <span className="size-[18px] rounded-pill bg-text motion-safe:transition-transform group-aria-checked:translate-x-[18px] group-aria-checked:bg-on-amber" />
      </span>
    </button>
  );
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isEmail(value: string) {
  return emailPattern.test(value.trim());
}
