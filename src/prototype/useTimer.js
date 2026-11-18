import { useCallback } from 'react'
import { formatClock, useToast } from '../components/ui'
import { byId } from './model'
import { useStore } from './store'

/** Start, stop and resume, with the stop toast (and Undo). */
export function useTimer() {
  const { state, dispatch, newId } = useStore()
  const toast = useToast()

  const stop = useCallback(() => {
    if (!state.timer.running) return
    const id = newId('e')
    const seconds = Math.max(1, Math.round((Date.now() - state.timer.startedAt) / 1000))
    const project = byId(state.projects, state.timer.projectId)
    dispatch({ type: 'timer/stop', id })
    toast(`Saved ${formatClock(seconds)} to ${project?.name ?? 'your entries'}.`, {
      action: { label: 'Undo', onClick: () => dispatch({ type: 'entry/delete', id }) },
    })
  }, [state.timer, state.projects, dispatch, newId, toast])

  const start = useCallback(() => dispatch({ type: 'timer/start' }), [dispatch])

  const resume = useCallback(
    (entry) => {
      if (state.timer.running) stop()
      dispatch({ type: 'timer/start', projectId: entry.projectId, description: entry.description })
    },
    [state.timer.running, stop, dispatch],
  )

  return { start, stop, resume }
}
