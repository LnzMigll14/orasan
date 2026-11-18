import { useEffect, useState } from 'react'
import { Button, Input, Select, SlideOver, formatClock, useToast } from '../components/ui'
import { projectOptions } from './model'
import { useStore } from './store'

const pad = (n) => String(n).padStart(2, '0')
const toDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const toTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

/** Edit an unbilled entry: description, project, date, start and end. Delete with Undo. */
export function EditEntry({ entry, onClose }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [f, setF] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (entry) {
      setF({
        description: entry.description,
        projectId: entry.projectId,
        date: toDate(entry.start),
        from: toTime(entry.start),
        to: toTime(entry.end),
      })
      setError(null)
    }
  }, [entry])

  const save = (e) => {
    e?.preventDefault()
    const start = new Date(`${f.date}T${f.from}:00`)
    const end = new Date(`${f.date}T${f.to}:00`)
    if (!(end > start)) {
      setError('End time must be after the start time.')
      return
    }
    dispatch({
      type: 'entry/update',
      id: entry.id,
      patch: { description: f.description.trim() || 'Untitled work', projectId: f.projectId, start, end },
    })
    toast('Entry updated.')
    onClose()
  }

  const remove = () => {
    const removed = entry
    dispatch({ type: 'entry/delete', id: entry.id })
    toast('Entry deleted.', { action: { label: 'Undo', onClick: () => dispatch({ type: 'entry/restore', entry: removed }) } })
    onClose()
  }

  const duration = f ? Math.max(0, (new Date(`${f.date}T${f.to}:00`) - new Date(`${f.date}T${f.from}:00`)) / 1000) : 0

  return (
    <SlideOver
      open={Boolean(entry)}
      onClose={onClose}
      title="Edit entry"
      footer={
        <>
          <Button kind="danger-ghost" onClick={remove} className="md:mr-auto">
            Delete entry
          </Button>
          <Button kind="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save entry</Button>
        </>
      }
    >
      {f ? (
        <form onSubmit={save} noValidate className="flex flex-col gap-4">
          <Input label="Description" data-autofocus value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          <Select label="Project" value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value })}>
            {projectOptions(state).map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
          <Input label="Date" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start" type="time" value={f.from} error={error} onChange={(e) => setF({ ...f, from: e.target.value })} />
            <Input label="End" type="time" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} />
          </div>
          <p className="type-label text-muted">
            Duration <span className="type-figure text-ink">{formatClock(duration)}</span>
          </p>
          <button type="submit" hidden />
        </form>
      ) : null}
    </SlideOver>
  )
}
