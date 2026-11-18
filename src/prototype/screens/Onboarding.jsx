import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button, Icon, Input, Select, Toggle, cn, currencySymbol } from '../../components/ui'
import { useStore } from '../store'

const STEPS = ['Your details', 'How you get paid', 'First client and rate']

function Stepper({ step }) {
  return (
    <ol className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0" aria-label="Setup steps">
      {STEPS.map((label, i) => {
        const n = i + 1
        const done = n < step
        const current = n === step
        return (
          <li
            key={label}
            aria-current={current ? 'step' : undefined}
            className={cn('flex items-center gap-2 type-label', current ? 'text-ink' : done ? 'text-muted' : 'text-faint')}
          >
            <span
              className={cn(
                'inline-flex size-5 items-center justify-center rounded-xs border type-label-strong',
                current && 'border-ink bg-ink text-paper',
                done && 'border-accent bg-accent text-on-accent',
                !current && !done && 'border-rule-strong',
              )}
            >
              {done ? <Icon name="check" size={12} /> : n}
            </span>
            <span className={cn(current ? 'type-label-strong' : 'hidden md:inline')}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function Onboarding() {
  const { step: stepParam } = useParams()
  const step = Number(stepParam)
  const navigate = useNavigate()
  const { state, dispatch, newId } = useStore()

  const [profile, setProfile] = useState({
    name: state.profile.name,
    business: state.profile.business,
    email: state.profile.email,
    tin: state.profile.tin,
  })
  const [currency, setCurrency] = useState(state.profile.defaultCurrency)
  const [methods, setMethods] = useState(state.methods)
  // currency: null follows the default currency chosen in step 2 until the user picks one.
  const [client, setClient] = useState({ name: '', currency: null, rate: '', project: '' })
  const clientCurrency = client.currency ?? currency
  const formRef = useRef(null)
  const [errors, setErrors] = useState({})

  // Move focus to the new step's heading so screen readers announce it.
  useEffect(() => {
    formRef.current?.querySelector('h1')?.focus()
    document.title = `Set up Orasan · Step ${step} of 3`
  }, [step])
  // After a failed submit, focus the first field with an error.
  useEffect(() => {
    if (Object.keys(errors).length) formRef.current?.querySelector('[aria-invalid="true"], [data-error]')?.focus()
  }, [errors])

  if (![1, 2, 3].includes(step)) return <Navigate to="/onboarding/1" replace />

  const setMethod = (id, patch) =>
    setMethods((list) =>
      list.map((m) =>
        m.id !== id
          ? m
          : {
              ...m,
              enabled: patch.enabled ?? m.enabled,
              fields: patch.field ? m.fields.map((f) => (f.key === patch.field ? { ...f, value: patch.value } : f)) : m.fields,
            },
      ),
    )

  const next = (e) => {
    e.preventDefault()
    if (step === 1) {
      const err = {}
      if (!profile.name.trim()) err.name = 'Enter your name.'
      if (!profile.email.includes('@')) err.email = 'Enter an email address, like you@example.com.'
      setErrors(err)
      if (Object.keys(err).length) return
      navigate('/onboarding/2')
    } else if (step === 2) {
      if (!methods.some((m) => m.enabled)) {
        setErrors({ methods: 'Turn on at least one way to get paid.' })
        return
      }
      const missing = methods.filter((m) => m.enabled && m.fields.some((f) => !f.value.trim()))
      if (missing.length) {
        setErrors({ methods: `Fill in the details for ${missing.map((m) => m.label).join(', ')}, or turn ${missing.length > 1 ? 'them' : 'it'} off.`, missing: missing.map((m) => m.id) })
        return
      }
      if (!methods.some((m) => m.enabled && m.currency === currency)) {
        setErrors({ methods: `Turn on a ${currency} method, so ${currency} invoices show how to pay.` })
        return
      }
      setErrors({})
      navigate('/onboarding/3')
    } else {
      const err = {}
      if (!client.name.trim()) err.name = 'Enter the client’s name.'
      if (!(Number(client.rate) > 0)) err.rate = 'Enter an hourly rate above 0.'
      if (!client.project.trim()) err.project = 'Name the first project, like “Website build”.'
      setErrors(err)
      if (Object.keys(err).length) return
      const clientId = newId('c')
      dispatch({
        type: 'onboarding/complete',
        profile: { ...profile, defaultCurrency: currency },
        methods,
        client: { id: clientId, name: client.name.trim(), contact: '', email: '', currency: clientCurrency, rate: Number(client.rate) },
        project: { id: newId('p'), clientId, name: client.project.trim(), rate: null },
      })
      navigate('/timer')
    }
  }

  return (
    <div className="min-h-dvh bg-paper">
      <header className="flex h-(--size-bar) items-center border-b border-rule bg-surface px-4 md:px-8">
        <span className="type-title text-ink">Orasan</span>
      </header>
      <main className="px-4 pt-6 pb-16 md:px-8 md:pt-10">
        <form ref={formRef} onSubmit={next} noValidate className="flex max-w-140 flex-col gap-8">
          <Stepper step={step} />

          {step === 1 ? (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h1 tabIndex={-1} className="m-0 type-headline text-ink outline-none">Your details</h1>
                <p className="type-body text-muted">These print on every invoice you send.</p>
              </div>
              <Input label="Your name" value={profile.name} error={errors.name} autoComplete="name" onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              <Input label="Business name" help="Optional. Shown above your name on invoices." value={profile.business} onChange={(e) => setProfile({ ...profile, business: e.target.value })} />
              <Input label="Email" type="email" value={profile.email} error={errors.email} autoComplete="email" onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              <Input label="TIN" help="Optional. Prints on your invoices. Orasan does not make BIR-compliant receipts." value={profile.tin} inputMode="numeric" onChange={(e) => setProfile({ ...profile, tin: e.target.value })} />
            </section>
          ) : null}

          {step === 2 ? (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h1 tabIndex={-1} className="m-0 type-headline text-ink outline-none">How you get paid</h1>
                <p className="type-body text-muted">Invoices show only the methods that match their currency. You can change these later in Settings.</p>
              </div>
              <Select label="Default currency" help="Used for new clients." value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="PHP">PHP — Philippine peso</option>
                <option value="USD">USD — US dollar</option>
              </Select>
              <fieldset className="m-0 flex flex-col border-0 p-0">
                <legend className="mb-2 type-label text-ink">Payment methods</legend>
                <div className="border-t border-rule">
                  {methods.map((m) => (
                    <div key={m.id} className="border-b border-rule">
                      <div className="flex min-h-(--size-row-touch) items-center gap-3 md:min-h-(--size-row)">
                        <label htmlFor={`m-${m.id}`} className="flex-1 cursor-pointer type-body-mobile text-ink md:type-body">
                          {m.label}
                          <span className="ml-2 type-label text-muted">{m.currency}</span>
                        </label>
                        <Toggle id={`m-${m.id}`} label={`Accept ${m.label}`} checked={m.enabled} onChange={(v) => setMethod(m.id, { enabled: v })} />
                      </div>
                      {m.enabled ? (
                        <fieldset aria-label={`${m.label} details`} className="m-0 grid gap-3 border-0 p-0 pb-4 md:grid-cols-2">
                          {m.fields.map((f) => (
                            <Input key={f.key} label={f.label} value={f.value} error={errors.missing?.includes(m.id) && !f.value.trim() ? 'Required while this method is on.' : null} onChange={(e) => setMethod(m.id, { field: f.key, value: e.target.value })} />
                          ))}
                        </fieldset>
                      ) : null}
                    </div>
                  ))}
                </div>
                {errors.methods ? (
                  <p tabIndex={-1} data-error className="mt-2 type-label text-danger outline-none" role="alert">
                    Error: {errors.methods}
                  </p>
                ) : null}
              </fieldset>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h1 tabIndex={-1} className="m-0 type-headline text-ink outline-none">First client and rate</h1>
                <p className="type-body text-muted">Add one client now. You can add more from Clients.</p>
              </div>
              <Input label="Client name" value={client.name} error={errors.name} placeholder="Client or company name" onChange={(e) => setClient({ ...client, name: e.target.value })} />
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Currency" value={clientCurrency} onChange={(e) => setClient({ ...client, currency: e.target.value })}>
                  <option value="PHP">PHP — Philippine peso</option>
                  <option value="USD">USD — US dollar</option>
                </Select>
                <Input label="Hourly rate" currency={currencySymbol(clientCurrency)} value={client.rate} error={errors.rate} placeholder="0.00" onChange={(e) => setClient({ ...client, rate: e.target.value })} />
              </div>
              <Input label="First project" help="Time is tracked against a project." value={client.project} error={errors.project} placeholder="Website build" onChange={(e) => setClient({ ...client, project: e.target.value })} />
            </section>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-rule pt-6 md:flex-row md:justify-between">
            {step > 1 ? (
              <Button kind="secondary" onClick={() => navigate(`/onboarding/${step - 1}`)}>
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit">{step < 3 ? 'Continue' : 'Start tracking'}</Button>
          </div>
        </form>
      </main>
    </div>
  )
}
