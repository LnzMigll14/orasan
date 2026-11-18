import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { cn } from './cn'

const ToastContext = createContext(() => {})

/** `const toast = useToast(); toast('Saved.', { action: { label: 'Undo', onClick } })` */
export function useToast() {
  return useContext(ToastContext)
}

function ToastItem({ item, onDone }) {
  const [shown, setShown] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const remaining = useRef(5000)
  const started = useRef(0)
  const timer = useRef(0)

  const leave = useCallback(() => {
    setLeaving(true)
    setTimeout(() => onDone(item.id), 120)
  }, [item.id, onDone])

  const run = useCallback(() => {
    started.current = Date.now()
    timer.current = setTimeout(leave, remaining.current)
  }, [leave])
  const pause = useCallback(() => {
    clearTimeout(timer.current)
    remaining.current -= Date.now() - started.current
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    run()
    // Pause while the tab is hidden, so a toast is never missed.
    const onVis = () => (document.hidden ? pause() : run())
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(timer.current)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [run, pause])

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={run}
      onFocus={pause}
      onBlur={run}
      className={cn(
        'pointer-events-auto flex max-w-[calc(100vw-32px)] items-center gap-6 rounded-sm bg-inverse px-4 py-3 text-on-inverse shadow-toast transition-[transform,opacity]',
        shown && !leaving
          ? 'translate-y-0 opacity-100 duration-(--dur-toast) ease-(--ease-out)'
          : 'translate-y-2 opacity-0',
        leaving && 'duration-[120ms] ease-(--ease-exit)',
      )}
    >
      <span className="type-body">{item.message}</span>
      {item.action ? (
        <button
          type="button"
          onClick={() => {
            item.action.onClick?.()
            leave()
          }}
          className="-my-3 -mr-2 flex min-h-11 cursor-pointer items-center px-2 type-label-strong underline underline-offset-3"
        >
          {item.action.label}
        </button>
      ) : null}
    </div>
  )
}

/**
 * Toast region: bottom-left on desktop, above the timer dock on mobile.
 * The shell sets --toast-offset to clear the dock and tab bar.
 */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const seq = useRef(0)
  const toast = useCallback((message, opts = {}) => {
    seq.current += 1
    const id = seq.current
    setItems((list) => [...list.slice(-2), { id, message, ...opts }])
  }, [])
  const done = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), [])
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-[var(--toast-offset,16px)] left-4 z-50 flex flex-col items-start gap-2 md:bottom-8 md:left-8"
      >
        {items.map((t) => (
          <ToastItem key={t.id} item={t} onDone={done} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
