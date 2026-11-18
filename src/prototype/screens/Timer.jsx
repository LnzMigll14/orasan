import { useState } from 'react'
import { DayHeader, EmptyState, EntryRow, PageHeader, TimerControl, formatHours } from '../../components/ui'
import { entryRowProps, entrySeconds, groupByDay } from '../model'
import { useHeroRef, useTimerProps } from '../ProtoShell'
import { useStore } from '../store'
import { EditEntry } from '../EditEntry'
import { useTimer } from '../useTimer'
import { TODAY } from '../mockData'

export function Timer() {
  const { state } = useStore()
  const timer = useTimerProps()
  const { resume } = useTimer()
  const heroRef = useHeroRef()
  const [editing, setEditing] = useState(null)
  const days = groupByDay(state, state.entries)

  const weekStart = new Date(TODAY)
  weekStart.setDate(TODAY.getDate() - ((TODAY.getDay() + 6) % 7))
  weekStart.setHours(0, 0, 0, 0)
  const week = state.entries.filter((e) => e.start >= weekStart).reduce((s, e) => s + entrySeconds(state, e), 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Timer" flush>
        {state.entries.length ? (
          <span className="type-figure text-muted">
            This week <span className="text-ink">{formatHours(week)}</span>
          </span>
        ) : null}
      </PageHeader>

      <div ref={heroRef}>
        <TimerControl layout="hero" {...timer} />
      </div>

      {days.length ? (
        <div className="flex flex-col gap-6">
          {days.map((d) => (
            <section key={d.key} aria-label={d.label}>
              <DayHeader label={d.label} total={d.total} />
              {d.entries.map((e) => (
                <EntryRow key={e.id} {...entryRowProps(state, e)} onResume={() => resume(e)} onEdit={() => setEditing(e)} />
              ))}
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          headline="Wala pang oras dito."
          detail={
            state.projects.length
              ? 'Pick a project and start the timer above. Your entries will be listed here, grouped by day.'
              : 'Your entries will be listed here, grouped by day.'
          }
        />
      )}
      <EditEntry entry={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
