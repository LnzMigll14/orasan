import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEventHandler,
} from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Logo } from "../../shared/components/brand/Logo";
import {
  FileText,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Timer,
  UsersRound,
} from "lucide-react";
import "./Navbar.css";

// Match the CSS lg breakpoint so a closed mobile menu remains interactive on desktop.
const desktopBreakpoint = "(min-width: 64rem)";

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(desktopBreakpoint);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readDesktopViewport() {
  return window.matchMedia(desktopBreakpoint).matches;
}

const navigation = [
  { label: "Dashboard", to: "/", icon: LayoutGrid },
  { label: "Timer", to: "/timer", icon: Timer },
  { label: "Clients", to: "/clients", icon: UsersRound },
  { label: "Invoices", to: "/invoices", icon: FileText },
  { label: "Settings", to: "/settings", icon: Settings, divider: true },
];

const itemClasses =
  "sidebar-item group relative flex min-h-11 items-center gap-3 rounded-full border border-transparent px-3 py-2 text-body font-medium text-[#9ca7ba] lg:min-h-12 lg:gap-0 lg:px-0 lg:text-sm";

type NavbarProps = {
  name?: string;
  email?: string;
  overdueCount?: number;
  availableRoutes?: readonly string[];
};

export function Navbar({
  // Demo values for the dashboard mockup.
  name = "Lanz Miguel",
  email = "LanzMiguel14@example.com",
  overdueCount = 1,
  // Add paths here or pass availableRoutes as pages are registered in the router.
  availableRoutes = ["/"],
}: NavbarProps = {}) {
  const [mobileMenu, setMobileMenu] = useState({ open: false, animate: false });
  const [sidebar, setSidebar] = useState({ collapsed: false, animate: false });
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    readDesktopViewport,
    () => false,
  );
  const navigationId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const navListRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLLIElement>(null);

  // Measure before paint so the indicator starts in the active link's position.
  useLayoutEffect(() => {
    const activeLink = navListRef.current?.querySelector<HTMLAnchorElement>(
      'a.sidebar-item[aria-current="page"]',
    );
    const indicator = indicatorRef.current;

    if (!indicator) return;

    indicator.hidden = !activeLink;
    if (!activeLink) return;

    indicator.style.blockSize = `${activeLink.offsetHeight}px`;
    indicator.style.transform = `translateY(${activeLink.offsetTop}px)`;
  }, [pathname, isDesktop]);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  function closeMobileMenu(animate = false) {
    if (!mobileMenu.open || isDesktop) return;

    setMobileMenu({ open: false, animate });
    // Restore focus when the active link disappears with the collapsed menu.
    menuButtonRef.current?.focus();
  }

  const handleNavigationClick: MouseEventHandler<HTMLAnchorElement> = (event) =>
    closeMobileMenu(event.detail > 0);

  return (
    <aside
      className="desktop-sidebar relative w-full border-b border-[#252a36] bg-canvas lg:sticky lg:top-0 lg:h-dvh lg:shrink-0 lg:border-r lg:border-b-0"
      data-sidebar-collapsed={sidebar.collapsed}
      data-sidebar-motion={sidebar.animate ? "pointer" : undefined}
      data-mobile-menu-open={mobileMenu.open}
      data-mobile-menu-motion={mobileMenu.animate ? "pointer" : undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileMenu.open && !isDesktop) {
          event.preventDefault();
          closeMobileMenu();
        }
      }}
    >
      {/* The toggle sits beside the scroll container so its hit area can cross the divider. */}
      <button
        type="button"
        aria-label={sidebar.collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={(event) => {
          const animate = event.detail > 0;
          setSidebar(({ collapsed }) => ({ collapsed: !collapsed, animate }));
        }}
        className="sidebar-toggle hidden size-10 cursor-pointer place-items-center rounded-pill border border-border bg-raised text-text-secondary hover-fine:border-border-strong hover-fine:text-text lg:grid"
      >
        <span aria-hidden="true" className="grid">
          <PanelLeftClose
            className="sidebar-close-icon col-start-1 row-start-1"
            size={18}
            strokeWidth={1.75}
          />
          <PanelLeftOpen
            className="sidebar-open-icon col-start-1 row-start-1"
            size={18}
            strokeWidth={1.75}
          />
        </span>
      </button>

      <div className="sidebar-scroll flex w-full flex-col px-4 py-2 lg:h-full lg:overflow-y-auto lg:px-3">
        <div className="flex items-center justify-between gap-3 lg:mb-9">
          <Link
            to="/"
            className="inline-flex min-h-11 min-w-0 w-fit items-center rounded-lg lg:min-h-0 lg:pl-3"
            aria-label="Orasan dashboard"
            onClick={handleNavigationClick}
          >
            <Logo
              size={32}
              className="min-w-0 lg:gap-0"
              wordmarkClassName="sidebar-label lg:ml-3"
            />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={
              mobileMenu.open ? "Close navigation" : "Open navigation"
            }
            aria-expanded={mobileMenu.open}
            aria-controls={navigationId}
            onClick={(event) => {
              // Keyboard-generated clicks have no click count and switch states immediately.
              const animate = event.detail > 0;
              setMobileMenu(({ open }) => ({ open: !open, animate }));
            }}
            className="grid size-(--size-control-touch) shrink-0 cursor-pointer place-items-center rounded-pill border border-border bg-raised text-text-secondary aria-expanded:text-text hover-fine:border-border-strong hover-fine:text-text lg:hidden"
          >
            <span aria-hidden="true" className="mobile-menu-icon">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        {/* Remove closed mobile links from keyboard navigation as soon as the menu starts closing. */}
        <nav
          id={navigationId}
          aria-label="Primary navigation"
          className="mobile-nav"
          inert={!isDesktop && !mobileMenu.open}
        >
          <div className="mobile-nav-content">
            <ul
              ref={navListRef}
              className="relative isolate mt-2 flex flex-col gap-1 border-t border-border pt-2 lg:mt-0 lg:border-0 lg:pt-0"
            >
              <li
                ref={indicatorRef}
                className="sidebar-indicator"
                aria-hidden="true"
                hidden
              />
              {navigation.map((item) => (
                <NavigationItem
                  key={item.to}
                  item={item}
                  available={availableRoutes.includes(item.to)}
                  title={isDesktop && sidebar.collapsed ? item.label : undefined}
                  overdueCount={overdueCount}
                  onClick={handleNavigationClick}
                />
              ))}
            </ul>
          </div>
        </nav>

        <div className="mt-auto hidden items-center border-t border-[#252a36] pt-5 pl-px lg:flex">
          <span aria-hidden="true" className="sidebar-icon-slot">
            <span className="grid size-9 place-items-center rounded-full border border-[#252a36] bg-raised text-xs font-bold text-[#9ca7ba]">
              {initials}
            </span>
          </span>
          <div className="sidebar-label min-w-0">
            <p className="truncate text-xs font-bold text-text">{name}</p>
            <p className="truncate text-xs text-[#9ca7ba]" title={email}>
              {email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

type NavigationItemProps = {
  item: (typeof navigation)[number];
  available: boolean;
  title: string | undefined;
  overdueCount: number;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};

function NavigationItem({
  item: { label, to, icon: Icon, divider },
  available,
  title,
  overdueCount,
  onClick,
}: NavigationItemProps) {
  const content = (
    <>
      <span className="sidebar-icon-slot shrink-0">
        <Icon
          aria-hidden="true"
          size={18}
          strokeWidth={1.75}
          className="group-aria-[current=page]:text-[#f5b252]"
        />
      </span>
      <span className="sidebar-label lg:truncate">{label}</span>
      {to === "/invoices" && overdueCount > 0 && (
        <>
          {/* The badge stays compact and the screen-reader label gives the exact count. */}
          <span
            aria-hidden="true"
            className="sidebar-overdue-badge ml-auto grid size-6 shrink-0 place-items-center rounded-full bg-[#33222d] text-xs font-bold text-[#ff677e]"
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
      className={
        divider
          ? "mt-2 border-t border-[#252a36] pt-2 lg:mt-5 lg:pt-5"
          : undefined
      }
    >
      {/* NavLink adds aria-current to the active route. Future routes appear as disabled labels. */}
      {available ? (
        <NavLink
          to={to}
          end={to === "/"}
          title={title}
          onClick={onClick}
          className={`${itemClasses} hover-fine:text-text aria-[current=page]:font-semibold aria-[current=page]:text-text`}
        >
          {content}
        </NavLink>
      ) : (
        <span role="link" aria-disabled="true" title={title} className={itemClasses}>
          {content}
        </span>
      )}
    </li>
  );
}
