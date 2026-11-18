import { Outlet, createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router'
import { ToastProvider } from '../components/ui'
import { DevSwitcher } from './DevSwitcher'
import { ProtoShell } from './ProtoShell'
import { StoreProvider } from './store'
import { ClientDetail, Clients } from './screens/Clients'
import { Dashboard } from './screens/Dashboard'
import { Onboarding } from './screens/Onboarding'
import { Timer } from './screens/Timer'
import { InvoiceBuilder, InvoiceDetail, InvoiceSent, Invoices } from './screens/Invoices'
import { PublicInvoice } from './screens/PublicInvoice'
import { Settings } from './screens/Settings'

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
      {import.meta.env.DEV ? <DevSwitcher /> : null}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/onboarding/:step', element: <Onboarding /> },
      { path: '/i/:token', element: <PublicInvoice /> },
      {
        element: <ProtoShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'timer', element: <Timer /> },
          { path: 'clients', element: <Clients /> },
          { path: 'clients/:id', element: <ClientDetail /> },
          { path: 'invoices', element: <Invoices /> },
          { path: 'invoices/new', element: <InvoiceBuilder /> },
          { path: 'invoices/:id', element: <InvoiceDetail /> },
          { path: 'invoices/:id/sent', element: <InvoiceSent /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
])

export function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </StoreProvider>
  )
}
