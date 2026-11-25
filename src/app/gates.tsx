import type { ReactNode } from "react";
import { useState } from "react";
import { Link, Navigate, isRouteErrorResponse, useRouteError } from "react-router";
import { Download } from "lucide-react";
import { readRawSavedData, resetAllData, useStoreState } from "../data/store";
import { OnboardingPage } from "../features/onboarding/OnboardingPage";
import { ImportBackupButton } from "../features/settings/ImportBackupButton";
import { Logo } from "../shared/components/brand/Logo";
import { ConfirmDialog } from "../shared/components/Modal";
import { Toaster } from "../shared/components/Toast";
import { usePageMeta } from "../shared/seo";
import { button, card } from "../shared/ui";

/** Shows onboarding on first visit and sends returning users to the app. */
export function OnboardingRoute() {
  const { data, loadError } = useStoreState();
  if (loadError) return <RecoveryScreen errors={loadError} />;
  if (data) return <Navigate to="/" replace />;
  return (
    <>
      <PageMeta title="Get started" />
      <OnboardingPage />
      <Toaster />
    </>
  );
}

/** Pages outside the app shell still need data and the recovery screen. */
export function PublicRoute({ children }: { children: ReactNode }) {
  const { data, loadError } = useStoreState();
  if (loadError) return <RecoveryScreen errors={loadError} />;
  if (!data) return <Navigate to="/welcome" replace />;
  return (
    <>
      <PageMeta title="Invoice" />
      {children}
    </>
  );
}

function PageMeta({ title }: { title: string }) {
  usePageMeta(title);
  return null;
}

/**
 * Saved data exists but can't be read (corrupted, or written by a newer version).
 * Orasan never overwrites it silently: the user can download it, restore a backup, or start over.
 */
export function RecoveryScreen({ errors }: { errors: string[] }) {
  const [confirming, setConfirming] = useState(false);
  const raw = readRawSavedData();

  return (
    <div className="min-h-dvh bg-canvas px-4 py-6 text-text md:px-10 md:py-8">
      <Logo size={32} />
      <section className={`${card} mt-6 max-w-xl p-5 md:mt-8 md:p-8`} aria-labelledby="recovery-title">
        <h1 id="recovery-title" className="text-display">
          Your saved data can't be opened
        </h1>
        <p className="mt-2 text-body text-text-secondary">
          Orasan found data in this browser but couldn't read it. Nothing has been deleted. Download a copy before you
          start over or restore a backup.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-label text-overdue">
          {errors.slice(0, 5).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {raw && (
            <button
              type="button"
              className={button.secondary}
              onClick={() => {
                const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
                const link = document.createElement("a");
                link.href = url;
                link.download = "orasan-unreadable-data.json";
                link.click();
                window.setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              <Download aria-hidden="true" size={16} />
              Download saved data
            </button>
          )}
          <ImportBackupButton label="Restore a backup" />
          <button type="button" className={button.danger} onClick={() => setConfirming(true)}>
            Start over
          </button>
        </div>
      </section>
      <ConfirmDialog
        open={confirming}
        title="Delete the saved data and start over?"
        description="The unreadable data is removed from this browser. This can't be undone."
        confirmLabel="Delete and start over"
        onConfirm={resetAllData}
        onClose={() => setConfirming(false)}
      />
      <Toaster />
    </div>
  );
}

/** Shown instead of a blank screen or the router's developer error page if a screen crashes. */
export function RouteErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="min-h-dvh bg-canvas px-4 py-8 text-text md:px-10">
        <NotFoundPage />
      </div>
    );
  }
  return (
    <div className="min-h-dvh bg-canvas px-4 py-6 text-text md:px-10 md:py-8">
      <Logo size={32} />
      <section className={`${card} mt-6 max-w-xl p-5 md:mt-8 md:p-8`}>
        <h1 className="text-display">Something went wrong</h1>
        <p className="mt-2 text-body text-text-secondary">
          This screen hit an error. Your saved data is safe. Reload the page, or go back to the Dashboard.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => window.location.reload()} className={button.primary}>
            Reload
          </button>
          <a href="/" className={button.secondary}>
            Go to Dashboard
          </a>
        </div>
      </section>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <section className="mx-auto w-full max-w-(--size-content)">
      <h1 className="text-display">Page not found</h1>
      <p className="mt-1 text-body text-text-secondary">This page doesn't exist, or the record it showed was deleted.</p>
      <Link to="/" className={`${button.secondary} mt-5`}>
        Go to Dashboard
      </Link>
    </section>
  );
}
