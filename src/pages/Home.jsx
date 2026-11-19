import { Link } from 'react-router'
import { Logo } from '../components/brand/Logo'

/** Placeholder route. Replace with the Dashboard when you start building. */
export function Home() {
  return (
    <main className="flex min-h-dvh flex-col justify-center gap-4 px-4 md:px-8">
      <Logo size={44} />
      <p className="text-text-secondary">React + Tailwind are set up. Start building in src/.</p>
      <Link to="/styleguide" className="inline-flex min-h-11 items-center self-start text-label font-bold text-amber hover-fine:text-amber-hover">
        Open the style guide
      </Link>
    </main>
  )
}
