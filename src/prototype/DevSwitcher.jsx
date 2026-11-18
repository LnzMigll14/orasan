import { useState } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '../components/ui'
import { useStore } from './store'

/** Dev-only panel: jump to screens, switch filled/empty data, switch theme, run the three flows. */
const SCREENS = [
  ['Onboarding', '/onboarding/1'],
  ['Dashboard', '/'],
  ['Timer', '/timer'],
  ['Clients', '/clients'],
  ['Client detail', '/clients/reyes'],
  ['Invoices', '/invoices'],
  ['Invoice builder', '/invoices/new?client=reyes'],
  ['Invoice sent', '/invoices/inv11/sent'],
  ['Invoice detail (overdue)', '/invoices/inv09'],
  ['Public invoice', '/i/r9x2kq'],
  ['Settings', '/settings'],
]

function Seg({ value, options, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="flex rounded-sm border border-rule-strong">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            'h-8 flex-1 cursor-pointer px-2 type-label',
            value === v ? 'bg-ink text-paper' : 'text-ink hover-fine:bg-sunken',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export function DevSwitcher() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const go = (to) => {
    navigate(to)
    setOpen(false)
  }
  const flow = (data, to) => {
    dispatch({ type: 'reset', data })
    go(to)
  }
  return (
    <div className="fixed right-2 bottom-[calc(var(--size-bar)+var(--size-tabbar)+8px)] z-[35] flex flex-col-reverse items-end gap-2 md:right-4 md:bottom-4 print:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="h-8 cursor-pointer rounded-sm border border-dashed border-rule-strong bg-surface px-2 type-label text-muted"
      >
        Prototype
      </button>
      {open ? (
        <div className="flex w-64 flex-col gap-3 rounded-sm border border-rule-strong bg-raised p-3 shadow-overlay">
          <p className="type-column-head text-muted">Dev only · not part of the product</p>
          <Seg label="Data" value={state.data} options={[['filled', 'Filled'], ['empty', 'Empty']]} onChange={(d) => dispatch({ type: 'reset', data: d })} />
          <Seg
            label="Theme"
            value={state.settings.theme}
            options={[['light', 'Light'], ['dark', 'Dark'], ['system', 'System']]}
            onChange={(t) => dispatch({ type: 'theme', theme: t })}
          />
          <div className="flex flex-col">
            <p className="type-label-strong text-ink">Flows</p>
            <button type="button" className="h-8 cursor-pointer text-left type-label text-ink underline" onClick={() => flow('empty', '/onboarding/1')}>
              A · Onboarding → timer
            </button>
            <button type="button" className="h-8 cursor-pointer text-left type-label text-ink underline" onClick={() => flow('filled', '/')}>
              B · Dashboard → invoice → public
            </button>
            <button type="button" className="h-8 cursor-pointer text-left type-label text-ink underline" onClick={() => flow('filled', '/invoices')}>
              C · Invoices → mark as paid
            </button>
          </div>
          <div className="flex flex-col">
            <p className="type-label-strong text-ink">Screens</p>
            {SCREENS.map(([l, to]) => (
              <button key={to} type="button" className="h-7 cursor-pointer text-left type-label text-ink hover-fine:underline" onClick={() => go(to)}>
                {l}
              </button>
            ))}
          </div>
          <button type="button" className="h-8 cursor-pointer rounded-sm border border-rule-strong type-label text-ink" onClick={() => dispatch({ type: 'reset' })}>
            Reset data
          </button>
        </div>
      ) : null}
    </div>
  )
}
