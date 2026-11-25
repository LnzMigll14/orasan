// Shared class strings so buttons and fields look the same on every screen.

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-pill px-5 text-body font-bold " +
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 md:min-h-10";

export const button = {
  primary: `${buttonBase} bg-amber text-on-amber hover-fine:bg-amber-hover`,
  secondary: `${buttonBase} border border-border bg-raised text-text hover-fine:border-border-strong`,
  danger: `${buttonBase} border border-overdue/40 bg-overdue-tint text-overdue hover-fine:border-overdue`,
  ghost: `${buttonBase} px-3 text-text-secondary hover-fine:text-text`,
  /** Small text actions inside lists and cards. */
  link:
    "inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap text-label font-bold text-text-secondary " +
    "cursor-pointer hover-fine:text-text disabled:cursor-not-allowed disabled:opacity-60 md:min-h-10",
  icon:
    "grid size-11 shrink-0 place-items-center rounded-pill text-text-secondary cursor-pointer " +
    "hover-fine:bg-raised hover-fine:text-text disabled:cursor-not-allowed disabled:opacity-60 md:size-10",
};

export const control =
  "h-(--size-control-touch) w-full min-w-0 rounded-md border border-border-strong bg-raised px-4 " +
  "text-body-mobile text-text placeholder:text-text-muted aria-invalid:border-overdue " +
  "disabled:cursor-not-allowed disabled:opacity-60 md:h-(--size-control) md:text-body";

export const card = "rounded-lg border border-border bg-surface";
