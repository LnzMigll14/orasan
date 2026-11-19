import { Link, NavLink } from "react-router";
import { Logo } from "../components/brand/Logo";
import {
  FileText,
  LayoutGrid,
  Settings,
  Timer,
  UsersRound,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", to: "/", icon: LayoutGrid },
  { label: "Timer", to: "/timer", icon: Timer },
  { label: "Clients", to: "/clients", icon: UsersRound },
  { label: "Invoices", to: "/invoices", icon: FileText },
  { label: "Settings", to: "/settings", icon: Settings, divider: true },
];

const itemClasses =
  "group relative flex min-h-11 flex-col items-center justify-center gap-1 rounded-full border border-transparent px-1 py-1.5 text-[11px] font-medium text-[#9ca7ba] lg:min-h-12 lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-2 lg:text-sm";

export function Navbar({
  // Demo values for the dashboard mockup.
  name = "Lanz Miguel",
  email = "LanzMiguel14@example.com",
  overdueCount = 1,
  // Add paths here or pass availableRoutes as pages are registered in the router.
  availableRoutes = ["/"],
} = {}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <aside className="flex w-full flex-col border-b border-[#252a36] bg-canvas px-3 py-3 lg:sticky lg:top-0 lg:h-dvh lg:w-[248px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-4 lg:py-[30px]">
      <Link
        to="/"
        className="mb-3 w-fit rounded-lg px-2 lg:mb-9 lg:px-3"
        aria-label="Orasan dashboard"
      >
        <Logo size={32} />
      </Link>

      <nav aria-label="Primary navigation">
        <ul className="grid grid-cols-5 gap-1 lg:flex lg:flex-col">
          {navigation.map(({ label, to, icon: Icon, divider }) => {
            const content = (
              <>
                <Icon
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.75}
                  className="shrink-0 group-aria-[current=page]:text-[#f5b252]"
                />
                <span>{label}</span>
                {to === "/invoices" && overdueCount > 0 && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute top-0 right-0 grid size-4 place-items-center rounded-full bg-[#33222d] text-[9px] font-bold text-[#ff677e] lg:static lg:ml-auto lg:size-6 lg:text-xs"
                    >
                      {overdueCount > 99 ? "99+" : overdueCount}
                    </span>
                    <span className="sr-only">
                      {overdueCount} overdue{" "}
                      {overdueCount === 1 ? "invoice" : "invoices"}
                    </span>
                  </>
                )}
              </>
            );

            return (
              <li
                key={to}
                className={
                  divider
                    ? "lg:mt-5 lg:border-t lg:border-[#252a36] lg:pt-5"
                    : undefined
                }
              >
                {availableRoutes.includes(to) ? (
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={`${itemClasses} hover:bg-raised hover:text-text aria-[current=page]:border-[#252a36] aria-[current=page]:bg-raised aria-[current=page]:font-semibold aria-[current=page]:text-text`}
                  >
                    {content}
                  </NavLink>
                ) : (
                  <span
                    role="link"
                    aria-disabled="true"
                    className={itemClasses}
                  >
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto hidden items-center gap-3 border-t border-[#252a36] px-3 pt-5 lg:flex">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-[#252a36] bg-raised text-xs font-bold text-[#9ca7ba]"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-text">{name}</p>
          <p className="truncate text-xs text-[#9ca7ba]" title={email}>
            {email}
          </p>
        </div>
      </div>
    </aside>
  );
}
