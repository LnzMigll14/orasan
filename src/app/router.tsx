import { createBrowserRouter } from "react-router";
import { ClientDetailPage } from "../features/clients/ClientDetailPage";
import { ClientsPage } from "../features/clients/ClientsPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { InvoiceBuilderPage } from "../features/invoices/InvoiceBuilderPage";
import { InvoiceDetailPage } from "../features/invoices/InvoiceDetailPage";
import { InvoicesPage } from "../features/invoices/InvoicesPage";
import { PublicInvoicePage } from "../features/invoices/PublicInvoicePage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { StyleGuidePage } from "../features/style-guide/StyleGuidePage";
import { TimerPage } from "../features/timer/TimerPage";
import { AppLayout } from "./layout/AppLayout";
import { NotFoundPage, OnboardingRoute, PublicRoute, RouteErrorPage } from "./gates";

export const router = createBrowserRouter([
  {
    path: "/",
    // The layout redirects to /welcome until onboarding is finished.
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "timer", element: <TimerPage /> },
      { path: "clients", element: <ClientsPage /> },
      { path: "clients/:clientId", element: <ClientDetailPage /> },
      { path: "invoices", element: <InvoicesPage /> },
      { path: "invoices/new", element: <InvoiceBuilderPage /> },
      { path: "invoices/:invoiceId/edit", element: <InvoiceBuilderPage /> },
      { path: "invoices/:invoiceId", element: <InvoiceDetailPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/welcome", element: <OnboardingRoute />, errorElement: <RouteErrorPage /> },
  // The client-facing invoice page has no app chrome.
  { path: "/i/:invoiceId", element: <PublicRoute><PublicInvoicePage /></PublicRoute>, errorElement: <RouteErrorPage /> },
  { path: "/styleguide", element: <StyleGuidePage /> },
]);
