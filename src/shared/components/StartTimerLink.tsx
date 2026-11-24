import { Link } from "react-router";

export function StartTimerLink() {
  return (
    <Link
      to="/timer"
      className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-pill border border-border bg-raised px-4 text-body font-bold"
    >
      Start Timer
    </Link>
  );
}
