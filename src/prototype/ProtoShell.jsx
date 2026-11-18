import { Outlet, useLocation } from 'react-router'
import { AppShell, TimerControl } from '../components/ui'
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
  }
}

export function ProtoShell() {
  const timer = useTimerProps()
  const { pathname } = useLocation()
  // The Timer screen has its own large control; don't show a second one.
  const onTimer = pathname === '/timer'
  return (
    <AppShell
      items={NAV}
      timerBar={onTimer ? <span className="w-105" /> : <TimerControl layout="bar" {...timer} />}
      timerDock={onTimer ? null : <TimerControl layout="dock" {...timer} />}
    >
      <Outlet />
    </AppShell>
  )
}
