/**
 * Prototype state: useReducer + Context. No Redux, no storage; a reload resets everything.
 */
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { CLIENTS, ENTRIES, INVOICES, PAYMENT_METHODS, PROFILE, PROJECTS, SETTINGS, TODAY } from './mockData'

const clone = (x) => structuredClone(x)

export function seed(data = 'filled', keep = {}) {
  const filled = data === 'filled'
  return {
    data,
    profile: clone(PROFILE),
    methods: clone(PAYMENT_METHODS),
    settings: { ...clone(SETTINGS), theme: keep.theme ?? SETTINGS.theme, nextNumber: filled ? 13 : 1 },
    clients: filled ? clone(CLIENTS) : [],
    projects: filled ? clone(PROJECTS) : [],
    entries: filled ? clone(ENTRIES) : [],
    invoices: filled ? clone(INVOICES) : [],
    timer: { running: false, startedAt: null, projectId: filled ? 'brand' : null, description: '' },
    frame: keep.frame ?? 'fluid',
  }
}

let uid = 0
const newId = (p) => `${p}${Date.now().toString(36)}${(uid += 1)}`

/** Prototype "now": today's date (18 Nov 2026) at the real time of day. */
export function protoNow() {
  const n = new Date()
  const d = new Date(TODAY)
  d.setHours(n.getHours(), n.getMinutes(), n.getSeconds(), 0)
  return d
}

function reducer(state, a) {
  switch (a.type) {
    case 'reset':
      return seed(a.data ?? state.data, { theme: state.settings.theme, frame: state.frame })
    case 'frame':
      return { ...state, frame: a.frame }
    case 'theme':
      return { ...state, settings: { ...state.settings, theme: a.theme } }
    case 'settings':
      return { ...state, settings: { ...state.settings, ...a.patch } }
    case 'profile':
      return { ...state, profile: { ...state.profile, ...a.patch } }
    case 'method': {
      const methods = state.methods.map((m) => {
        if (m.id !== a.id) return m
        const next = { ...m }
        if ('enabled' in a) next.enabled = a.enabled
        if (a.field) next.fields = m.fields.map((f) => (f.key === a.field ? { ...f, value: a.value } : f))
        return next
      })
      return { ...state, methods }
    }

    case 'timer/project':
      return { ...state, timer: { ...state.timer, projectId: a.projectId } }
    case 'timer/description':
      return { ...state, timer: { ...state.timer, description: a.description } }
    case 'timer/start':
      if (!state.timer.projectId && !a.projectId) return state
      return {
        ...state,
        timer: {
          running: true,
          startedAt: Date.now(),
          projectId: a.projectId ?? state.timer.projectId,
          description: a.description ?? state.timer.description,
        },
      }
    case 'timer/stop': {
      if (!state.timer.running) return state
      const end = protoNow()
      const seconds = Math.max(1, Math.round((Date.now() - state.timer.startedAt) / 1000))
      const start = new Date(end.getTime() - seconds * 1000)
      const entry = {
        id: a.id,
        projectId: state.timer.projectId,
        description: state.timer.description.trim() || 'Untitled work',
        start,
        end,
        invoiceId: null,
      }
      return {
        ...state,
        entries: [entry, ...state.entries],
        timer: { ...state.timer, running: false, startedAt: null, description: '' },
      }
    }
    case 'entry/delete':
      return { ...state, entries: state.entries.filter((e) => e.id !== a.id) }
    case 'entry/restore':
      return { ...state, entries: [a.entry, ...state.entries] }

    case 'client/add':
      return { ...state, clients: [...state.clients, a.client], projects: [...state.projects, ...(a.projects ?? [])] }

    case 'onboarding/complete':
      return {
        ...state,
        profile: { ...state.profile, ...a.profile },
        methods: a.methods ?? state.methods,
        clients: [...state.clients, a.client],
        projects: [...state.projects, a.project],
        timer: { ...state.timer, projectId: a.project.id },
      }

    case 'invoice/create': {
      const num = `${state.settings.prefix}${String(state.settings.nextNumber).padStart(4, '0')}`
      const issued = new Date(TODAY)
      const due = new Date(TODAY.getTime() + state.settings.dueDays * 86400000)
      const invoice = {
        id: a.id,
        number: num,
        clientId: a.clientId,
        status: a.status,
        issued,
        due,
        staticLines: [],
        payment: null,
        token: a.id.slice(-6),
      }
      const ids = new Set(a.entryIds)
      return {
        ...state,
        invoices: [...state.invoices, invoice],
        entries: state.entries.map((e) => (ids.has(e.id) ? { ...e, invoiceId: a.id } : e)),
        settings: { ...state.settings, nextNumber: state.settings.nextNumber + 1 },
      }
    }
    case 'invoice/send':
      return {
        ...state,
        invoices: state.invoices.map((i) => (i.id === a.id ? { ...i, status: 'sent', issued: new Date(TODAY) } : i)),
      }
    case 'invoice/unpaid':
      return {
        ...state,
        invoices: state.invoices.map((i) => (i.id === a.id ? { ...i, status: 'sent', payment: null } : i)),
      }
    case 'entry/update':
      return { ...state, entries: state.entries.map((e) => (e.id === a.id ? { ...e, ...a.patch } : e)) }
    case 'invoice/paid':
      return {
        ...state,
        invoices: state.invoices.map((i) => (i.id === a.id ? { ...i, status: 'paid', payment: a.payment } : i)),
      }
    default:
      throw new Error(`Unknown action ${a.type}`)
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => seed('filled'))

  // Theme: .dark on <html>. "system" follows the OS live.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = state.settings.theme === 'dark' || (state.settings.theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#151412' : '#F6F4EF')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [state.settings.theme])

  const api = useMemo(
    () => ({
      state,
      dispatch,
      newId,
    }),
    [state],
  )
  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}

/** Seconds since the timer started, ticking once a second while it runs. */
export function useElapsed() {
  const { state } = useStore()
  const { running, startedAt } = state.timer
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!running) return
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [running])
  return running ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0
}
