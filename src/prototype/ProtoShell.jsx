import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { AppShell, Button, TimerControl } from '../components/ui'
import { byId, projectOptions } from './model'
import { useElapsed, useStore } from './store'
import { useTimer } from './useTimer'

export const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/timer', label: 'Timer' },
  { to: '/clients', label: 'Clients' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/settings', label: 'Settings' },
]

/** Timer props shared by the top bar, the dock and the Timer screen hero. */
export function useTimerProps() {
  const { state, dispatch } = useStore()
  const elapsed = useElapsed()
  const { start, stop } = useTimer()
  const options = projectOptions(state)
  const current = byId(options, state.timer.projectId)
  return {
    running: state.timer.running,
    elapsed,
    projects: options,
    projectId: state.timer.projectId,
    onProjectChange: (projectId) => dispatch({ type: 'timer/project', projectId }),
    description: state.timer.description,
    onDescriptionChange: (description) => dispatch({ type: 'timer/description', description }),
    runningLabel: [current?.label, state.timer.description].filter(Boolean).join(' · '),
    onStart: start,
    onStop: stop,
    emptyAction: (
      <Button as={Link} to="/clients?new=1" kind="secondary">
        Add a client
      </Button>
    ),
  }
}

/** The Timer screen reports whether its large timer is on screen. */
const HeroContext = createContext(() => {})

/** Attach to the Timer screen's hero: while it is visible, the bar and dock step aside. */
export function useHeroRef() {
  const setVisible = useContext(HeroContext)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '-56px 0px 0px 0px' })
    io.observe(el)
    return () => {
      io.disconnect()
      setVisible(false)
    }
  }, [setVisible])
  return ref
}

export function ProtoShell() {
  const timer = useTimerProps()
  const { pathname } = useLocation()
  const [heroVisible, setHeroVisible] = useState(false)
  // On the Timer screen the large control is the timer; once it scrolls away,
  // the bar and dock come back so Stop is always one tap away.
  const hide = pathname === '/timer' && heroVisible
  useEffect(() => {
    const seg = pathname.split('/')[1]
    const page = { '': 'Dashboard', timer: 'Timer', clients: 'Clients', invoices: 'Invoices', settings: 'Settings' }[seg]
    document.title = page ? `${page} · Orasan` : 'Orasan'
  }, [pathname])
  return (
    <HeroContext.Provider value={setHeroVisible}>
      <AppShell
        items={NAV}
        timerBar={hide ? <span className="w-105" /> : <TimerControl layout="bar" {...timer} />}
        timerDock={hide ? null : <TimerControl layout="dock" {...timer} />}
      >
        <Outlet />
      </AppShell>
    </HeroContext.Provider>
  )
}
