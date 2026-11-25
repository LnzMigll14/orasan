import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { TriangleAlert } from "lucide-react";
import { overdueCount } from "../../data/selectors";
import { useStoreState } from "../../data/store";
import { LandingPage } from "../../features/landing/LandingPage";
import { Toaster } from "../../shared/components/Toast";
import { usePageMeta } from "../../shared/seo";
import { todayKey } from "../../shared/time";
import { RecoveryScreen } from "../gates";
import { Navbar } from "./Navbar";
import { Analytics } from "@vercel/analytics/react"

export function AppLayout() {
  const { data, loadError, saveFailed } = useStoreState();
  const { pathname } = useLocation();

  // Start each new page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (loadError) return <RecoveryScreen errors={loadError} />;
  // No saved data yet: visitors see the public landing page at "/", and setup everywhere else.
  if (!data) return pathname === "/" ? <LandingPage /> : <Navigate to="/welcome" replace />;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-text lg:flex-row">
      <AppPageMeta pathname={pathname} />
      <Navbar name={data.profile.name} email={data.profile.email} overdueCount={overdueCount(data, todayKey())} />

      <div className="flex min-w-0 flex-1 flex-col">
        {saveFailed && (
          <p role="alert" className="flex items-center gap-2 border-b border-overdue-tint bg-overdue-tint px-4 py-3 text-body text-overdue md:px-6 lg:px-8">
            <TriangleAlert aria-hidden="true" size={16} className="shrink-0" />
            Your last change couldn't be saved in this browser. It will be lost when you close the page. Export your data
            from Settings, then free up browser storage.
          </p>
        )}
        <main className="flex-1 px-4 py-6 md:px-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="grid min-h-15 place-items-center border-t border-border px-4 py-4 md:px-6 lg:px-8">
          <p className="max-w-(--size-content) text-center text-balance text-body text-text-secondary">
            © {new Date().getFullYear()} <span className="font-semibold text-text">Orasan</span> - All rights reserved
          </p>
        </footer>
      </div>
      <Toaster />
      <Analytics mode="production" />
    </div>
  );
}

/** Names each app screen in the tab title and keeps it out of search results. */
function AppPageMeta({ pathname }: { pathname: string }) {
  const [section = "", detail] = pathname.split("/").filter(Boolean);
  const titles: Record<string, string> = { timer: "Timer", clients: "Clients", invoices: "Invoices", settings: "Settings" };
  let title = titles[section] ?? "Dashboard";
  if (section === "clients" && detail) title = "Client";
  if (section === "invoices" && detail) title = detail === "new" ? "New invoice" : "Invoice";
  usePageMeta(title);
  return null;
}
