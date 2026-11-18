import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from './Button'
import { Icon } from './Icon'
import { cn } from './cn'

/** Keep an element mounted through its exit transition. */
function usePresence(open, exitMs) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)
  useLayoutEffect(() => {
    if (open) {
      setMounted(true)
      // Two frames: commit the start state, then transition to the shown state.
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
      return () => cancelAnimationFrame(id)
    }
    setShown(false)
    const t = setTimeout(() => setMounted(false), exitMs)
    return () => clearTimeout(t)
  }, [open, exitMs])
  return { mounted, shown }
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Focus the panel on open, trap Tab, close on Escape, restore focus on close. */
function useModalFocus(ref, open, onClose) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const panel = ref.current
    const first = panel?.querySelector('[data-autofocus]') ?? panel?.querySelector(FOCUSABLE)
    ;(first ?? panel)?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current?.()
      }
      if (e.key !== 'Tab' || !panel) return
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => !el.closest('[inert]'))
      if (!items.length) return
      const a = items[0]
      const z = items[items.length - 1]
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [open, ref])
}

function Scrim({ shown, onClick }) {
  return (
    <div
      aria-hidden="true"
      onClick={onClick}
      className={cn(
        'fixed inset-0 bg-scrim transition-opacity',
        shown ? 'opacity-100 duration-(--dur-drawer-in) ease-(--ease-out)' : 'opacity-0 duration-(--dur-drawer-out) ease-(--ease-exit)',
      )}
    />
  )
}

/**
 * SlideOver: desktop 480px panel from the right (square edges, overlay shadow);
 * mobile full-height sheet from the bottom. Title bar, scrolling body, fixed footer (primary last).
 */
export function SlideOver({ open, onClose, title, footer, children }) {
  const { mounted, shown } = usePresence(open, 150)
  const ref = useRef(null)
  useModalFocus(ref, open && mounted, onClose)
  if (!mounted) return null
  return createPortal(
    <div className="fixed inset-0 z-40">
      <Scrim shown={shown} onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'absolute inset-0 flex flex-col bg-raised outline-none transition-[transform,opacity]',
          'md:inset-y-0 md:right-0 md:left-auto md:w-(--size-slideover) md:border-l md:border-rule md:shadow-overlay',
          shown
            ? 'translate-y-0 opacity-100 duration-(--dur-drawer-in) ease-(--ease-drawer) md:translate-x-0'
            : 'translate-y-4 opacity-0 duration-(--dur-drawer-out) ease-(--ease-exit) md:translate-x-4 md:translate-y-0',
        )}
      >
        <div className="flex h-(--size-bar) flex-none items-center justify-between border-b border-rule pr-2 pl-4 md:pl-6">
          <h2 className="m-0 type-title text-ink">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <Icon name="close" />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">{children}</div>
        {footer ? (
          <div className="flex flex-none items-center justify-end gap-2 border-t border-rule bg-raised px-4 py-4 *:flex-1 md:px-6 md:*:flex-none">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

/** Centered dialog (6px radius, overlay shadow). Scales from 0.97, never from 0. */
export function Dialog({ open, onClose, title, description, footer, children }) {
  const { mounted, shown } = usePresence(open, 150)
  const ref = useRef(null)
  useModalFocus(ref, open && mounted, onClose)
  if (!mounted) return null
  return createPortal(
    <div className="fixed inset-0 z-40 flex items-end justify-center p-4 md:items-center">
      <Scrim shown={shown} onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative flex w-full max-w-110 flex-col rounded-md border border-rule bg-raised shadow-overlay outline-none transition-[transform,opacity]',
          shown
            ? 'scale-100 opacity-100 duration-(--dur-drawer-in) ease-(--ease-out)'
            : 'scale-97 opacity-0 duration-(--dur-drawer-out) ease-(--ease-exit)',
        )}
      >
        <div className="flex flex-col gap-1 px-6 pt-6">
          <h2 className="m-0 type-title text-ink">{title}</h2>
          {description ? <p className="type-body text-muted">{description}</p> : null}
        </div>
        <div className="flex flex-col gap-4 px-6 py-4">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-rule px-6 py-4 *:flex-1 md:*:flex-none">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
