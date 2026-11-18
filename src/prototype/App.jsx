import { Outlet, createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router'
import { ToastProvider } from '../components/ui'
import { DevSwitcher } from './DevSwitcher'
import { ProtoShell } from './ProtoShell'
import { StoreProvider } from './store'
import { ClientDetail, Clients } from './screens/Clients'
import { Dashboard } from './screens/Dashboard'
import { Onboarding } from './screens/Onboarding'
import { Timer } from './screens/Timer'

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
      {
        element: <ProtoShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'timer', element: <Timer /> },
          { path: 'clients', element: <Clients /> },
          { path: 'clients/:id', element: <ClientDetail /> },
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
