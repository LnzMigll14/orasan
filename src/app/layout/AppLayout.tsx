import { Outlet } from 'react-router'
import { Navbar } from './Navbar'

// Enable navigation links for the screens registered under this layout.
const availableRoutes = ['/', '/timer', '/clients', '/invoices'] as const

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-text lg:flex-row">
      <Navbar
        name="Lanz Miguel"
        email="lanzmiguel@example.com"
        overdueCount={1}
        availableRoutes={availableRoutes}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-6 md:px-6 lg:p-8">
          {/* Child routes replace this outlet while the navigation and footer stay mounted. */}
          <Outlet />
        </main>

        <footer className="grid min-h-15 place-items-center border-t border-border px-4 py-4 md:px-6 lg:px-8">
          <p className="max-w-(--size-content) text-center text-balance text-body text-text-secondary">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-text">Orasan</span>
            {' - All rights reserved'}
          </p>
        </footer>
      </div>
    </div>
  )
}
