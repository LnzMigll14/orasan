import { Input, PageHeader, SectionHead, Select, Toggle, cn } from '../../components/ui'
import { nextInvoiceNumber } from '../model'
import { useStore } from '../store'

function Group({ id, title, note, children }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="m-0 type-title text-ink">
          {title}
        </h2>
        {note ? <p className="type-label text-muted">{note}</p> : null}
      </div>
      <div className="flex max-w-140 flex-col gap-4">{children}</div>
    </section>
  )
}

export function Settings() {
  const { state, dispatch } = useStore()
  const { profile, settings, methods } = state
  const setP = (patch) => dispatch({ type: 'profile', patch })
  const setS = (patch) => dispatch({ type: 'settings', patch })

  return (
    <>
      <PageHeader title="Settings">
        <span className="type-label text-muted">Changes save as you type.</span>
      </PageHeader>
      <div className="flex flex-col gap-10 [&>section+section]:border-t [&>section+section]:border-rule [&>section+section]:pt-10">
        <Group id="s-biz" title="Business info" note="Printed on every invoice.">
          <Input label="Your name" value={profile.name} onChange={(e) => setP({ name: e.target.value })} />
          <Input label="Business name" value={profile.business} onChange={(e) => setP({ business: e.target.value })} />
          <Input label="Email" type="email" value={profile.email} onChange={(e) => setP({ email: e.target.value })} />
          <Input label="TIN" help="Optional. Orasan does not make BIR-compliant receipts." value={profile.tin} onChange={(e) => setP({ tin: e.target.value })} />
        </Group>

        <Group id="s-pay" title="Payment details" note="Invoices show only the methods that are on and match their currency.">
          <div className="border-t border-rule">
            {methods.map((m) => (
              <div key={m.id} className="border-b border-rule">
                <div className="flex min-h-(--size-row-touch) items-center gap-3 md:min-h-(--size-row)">
                  <label htmlFor={`s-${m.id}`} className="flex-1 cursor-pointer type-body-mobile text-ink md:type-body">
                    {m.label}
                    <span className="ml-2 type-label text-muted">{m.currency} invoices</span>
                  </label>
                  <Toggle id={`s-${m.id}`} label={`Accept ${m.label}`} checked={m.enabled} onChange={(v) => dispatch({ type: 'method', id: m.id, enabled: v })} />
                </div>
                {m.enabled ? (
                  <fieldset aria-label={`${m.label} details`} className="m-0 grid gap-3 border-0 p-0 pb-4 md:grid-cols-2">
                    {m.fields.map((f) => (
                      <Input
                        key={f.key}
                        label={f.label}
                        value={f.value}
                        error={f.value ? null : 'Add this so clients can pay.'}
                        onChange={(e) => dispatch({ type: 'method', id: m.id, field: f.key, value: e.target.value })}
                      />
                    ))}
                  </fieldset>
                ) : null}
              </div>
            ))}
          </div>
        </Group>

        <Group id="s-num" title="Invoice numbering" note={`Next invoice: ${nextInvoiceNumber(state)}`}>
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Prefix" value={settings.prefix} onChange={(e) => setS({ prefix: e.target.value })} />
            <Input label="Next number" inputMode="numeric" value={settings.nextNumber} onChange={(e) => setS({ nextNumber: Number(e.target.value.replace(/\D/g, '')) || 1 })} />
            <Input label="Due after (days)" inputMode="numeric" value={settings.dueDays} onChange={(e) => setS({ dueDays: Number(e.target.value.replace(/\D/g, '')) || 0 })} />
          </div>
        </Group>

        <Group id="s-round" title="Rounding" note="Applied to each entry when it goes on an invoice.">
          <Select label="Round each entry" value={settings.rounding} onChange={(e) => setS({ rounding: e.target.value })}>
            <option value="none">No rounding</option>
            <option value="6">Up to the next 6 minutes</option>
            <option value="15">Up to the next 15 minutes</option>
          </Select>
        </Group>

        <Group id="s-theme" title="Appearance">
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 type-label text-ink">Theme</legend>
            <div className="flex max-w-90 rounded-sm border border-rule-strong">
              {[
                ['light', 'Light'],
                ['dark', 'Dark'],
                ['system', 'Match device'],
              ].map(([v, l]) => (
                <label
                  key={v}
                  className={cn(
                    'flex h-(--size-control-touch) flex-1 cursor-pointer items-center justify-center type-label-strong has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring md:h-(--size-control)',
                    settings.theme === v ? 'bg-ink text-paper' : 'text-ink hover-fine:bg-sunken',
                  )}
                >
                  <input type="radio" name="theme" value={v} checked={settings.theme === v} onChange={() => dispatch({ type: 'theme', theme: v })} className="sr-only" />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
        </Group>
      </div>
    </>
  )
}
