import { useId } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { cn } from './cn'
import { formatClock } from './format'

/**
 * Start and Stop share one grid cell, so the timer toggles in place with one tap.
 * The inactive button fades out (150ms) and is inert, never just hidden by color.
 */
function StartStop({ running, onStart, onStop, startLabel, stopLabel, size, startDisabled, startKind = 'primary' }) {
  return (
    <span className="grid flex-none">
      <Button
        kind={startKind}
        size={size}
        onClick={onStart}
        disabled={startDisabled}
        inert={running ? true : undefined}
        aria-hidden={running ? true : undefined}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,background-color] duration-(--dur-state) ease-(--ease-out)',
          running && 'pointer-events-none opacity-0',
        )}
      >
        {startLabel}
      </Button>
      <Button
        kind="secondary"
        size={size}
        onClick={onStop}
        inert={running ? undefined : true}
        aria-hidden={running ? undefined : true}
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,background-color] duration-(--dur-state) ease-(--ease-out)',
          !running && 'pointer-events-none opacity-0',
        )}
      >
        {stopLabel}
      </Button>
    </span>
  )
}

/** Compact native select used inside the timer (no label row). */
function ProjectPicker({ projects, value, onChange, className, size = 'compact', label = 'Project' }) {
  return (
    <span
      className={cn(
        'relative flex min-w-0 items-center rounded-sm border border-rule-strong bg-surface focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring',
        size === 'touch' && 'h-(--size-control-touch)',
        size === 'compact' && 'h-(--size-control)',
        size === 'auto' && 'h-(--size-control-touch) md:h-(--size-control)',
        className,
      )}
    >
      <select
        aria-label={label}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'h-full w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pr-9 pl-3 outline-none focus-visible:outline-none',
          size === 'touch' && 'type-body-mobile',
          size === 'compact' && 'type-body',
          size === 'auto' && 'type-body-mobile md:type-body',
          !value && 'text-muted',
        )}
      >
        <option value="" disabled>
          Choose project
        </option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <Icon name="chevron" className="pointer-events-none absolute right-3 text-muted" />
    </span>
  )
}

function Clock({ seconds, className, running }) {
  return (
    <span role="timer" aria-label={`Elapsed ${formatClock(seconds)}`} className={className}>
      <span aria-hidden="true">{formatClock(running ? seconds : 0)}</span>
    </span>
  )
}

/**
 * TimerControl
 *  layout="bar"  desktop top bar, right side (fixed 420px)
 *  layout="dock" mobile, directly above the tab bar
 *  layout="hero" top of the Timer screen
 * Running = Ledger Green Tint band, pulsing dot, Mono clock.
 */
export function TimerControl({
  layout = 'bar',
  running = false,
  elapsed = 0,
  projects = [],
  projectId,
  onProjectChange,
  runningLabel,
  description = '',
  onDescriptionChange,
  onStart,
  onStop,
  emptyAction,
  className,
}) {
  const descId = useId()
  const band = 'transition-colors duration-(--dur-state) ease-(--ease-out)'
  const noProject = !projectId
  // No projects yet: say why the timer can't start and offer the way forward.
  if (!running && projects.length === 0 && emptyAction) {
    const hint = <span className="min-w-0 flex-1 type-label text-muted">Add a client to start tracking.</span>
    if (layout === 'bar') return <div className={cn('flex h-11 w-105 flex-none items-center justify-end gap-3', className)}>{hint}{emptyAction}</div>
    if (layout === 'dock') return <div className={cn('flex h-(--size-bar) items-center gap-3 border-t border-rule bg-surface px-4', className)}>{hint}{emptyAction}</div>
    return (
      <section aria-label="Timer" className={cn('flex flex-col items-start gap-3 rounded-md border border-rule bg-surface p-4 md:p-6', className)}>
        <span className="type-timer text-faint" aria-hidden="true">00:00:00</span>
        <p className="type-body text-muted">Time is tracked against a client’s project. Add one to start the timer.</p>
        {emptyAction}
      </section>
    )
  }

  if (layout === 'bar') {
    return (
      <div
        className={cn(
          'flex h-11 w-105 flex-none items-center justify-end gap-3 rounded-sm p-1',
          band,
          running ? 'bg-tint pl-3' : 'bg-transparent',
          className,
        )}
      >
        {running ? (
          <>
            <span className="running-dot" />
            <span className="min-w-0 flex-1 truncate type-label text-ink">{runningLabel}</span>
            <Clock seconds={elapsed} running className="type-timer-compact text-ink" />
          </>
        ) : (
          <ProjectPicker projects={projects} value={projectId} onChange={onProjectChange} className="w-55" />
        )}
        <StartStop
          running={running}
          onStart={onStart}
          onStop={onStop}
          startLabel="Start timer"
          stopLabel="Stop timer"
          size="compact"
          startDisabled={noProject}
          startKind="secondary"
        />
      </div>
    )
  }

  if (layout === 'dock') {
    return (
      <div
        className={cn(
          'flex h-(--size-bar) items-center gap-3 border-t border-rule px-4',
          band,
          running ? 'bg-tint' : 'bg-surface',
          className,
        )}
      >
        {running ? (
          <>
            <span className="running-dot" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate type-label text-muted">{runningLabel}</span>
              <Clock seconds={elapsed} running className="type-timer-compact text-ink" />
            </span>
          </>
        ) : (
          <ProjectPicker projects={projects} value={projectId} onChange={onProjectChange} size="touch" className="flex-1" />
        )}
        <StartStop
          running={running}
          onStart={onStart}
          onStop={onStop}
          startLabel="Start timer"
          stopLabel="Stop"
          size="touch"
          startDisabled={noProject}
          startKind="secondary"
        />
      </div>
    )
  }

  // hero
  return (
    <section
      aria-label="Timer"
      className={cn(
        'flex flex-col gap-4 rounded-md border p-4 md:p-6',
        band,
        running ? 'border-tint bg-tint' : 'border-rule bg-surface',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {running ? <span className="running-dot" /> : null}
        <Clock seconds={elapsed} running={running} className={cn('type-timer', running ? 'text-ink' : 'text-faint')} />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label htmlFor={descId} className="sr-only">
          Description
        </label>
        <input
          id={descId}
          value={description}
          onChange={(e) => onDescriptionChange?.(e.target.value)}
          placeholder="What are you working on?"
          className="h-(--size-control-touch) w-full min-w-0 flex-none rounded-sm md:w-auto md:flex-1 border border-rule-strong bg-surface px-3 type-body-mobile outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:h-(--size-control) md:type-body"
        />
        <ProjectPicker
          projects={projects}
          value={projectId}
          onChange={onProjectChange}
          size="auto"
          className="md:w-60"
        />
        <StartStop
          running={running}
          onStart={onStart}
          onStop={onStop}
          startLabel="Start timer"
          stopLabel="Stop timer"
          size="auto"
          startDisabled={noProject}
        />
      </div>
    </section>
  )
}
