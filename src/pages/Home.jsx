import { Navbar } from './Navbar'

const dashboardDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'Asia/Manila',
})

export function Home() {
  const today = new Date()

  return (
    <div className="min-h-dvh bg-canvas text-text lg:flex">
      <Navbar
        name="Lanz Miguel"
        email="lanzmiguel@example.com"
        overdueCount={1}
      />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:p-8">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome back, Lanz
          </h1>
          <time
            dateTime={today.toISOString()}
            className="mt-1 block text-sm text-[#9ca7ba]"
          >
            {dashboardDate.format(today)}
          </time>
        </header>

        {/* Dashboard cards, hours chart, and invoice tracker go here. */}
      </main>
    </div>
  )
}
