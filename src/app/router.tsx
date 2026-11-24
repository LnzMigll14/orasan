import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { ClientsPage } from '../features/clients/ClientsPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { InvoicesPage } from '../features/invoices/InvoicesPage'
import { StyleGuidePage } from '../features/style-guide/StyleGuidePage'
import { AppLayout } from './layout/AppLayout'

function TimerPlaceholder() {
  return (
    <section>
      <h1 className="text-display">Timer</h1>
      <p className="mt-1 text-body text-text-secondary">The Timer page is in development.</p>
    </section>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    // An index route fills the layout's Outlet at the parent URL, here `/`.
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'timer',
        // Render a placeholder while the timer route loads on an initial visit.
        HydrateFallback: TimerPlaceholder,
        lazy: async () => {
          // Keep timer code out of the initial bundle and allow a placeholder-only module.
          const page = (await import('../features/timer/TimerPage')) as {
            TimerPage?: ComponentType
          }
          return { Component: page.TimerPage ?? TimerPlaceholder }
        },
      },
      { path: 'clients', element: <ClientsPage /> },
      { path: 'invoices', element: <InvoicesPage /> },
    ],
  },
  // A top-level route renders the style guide as a standalone page.
  { path: '/styleguide', element: <StyleGuidePage /> },
])
