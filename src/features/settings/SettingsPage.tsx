import { useId, useState, type ReactNode } from "react";
import { Download, Trash2 } from "lucide-react";
import { backupFileName, buildBackup, downloadJson } from "../../data/backup";
import { formatInvoiceNumber } from "../../data/invoicing";
import { resetAllData, updateProfile, updateSettings, useAppData } from "../../data/store";
import type { PaymentMethod, Profile } from "../../data/types";
import { Field, SelectField } from "../../shared/components/form";
import { ConfirmDialog } from "../../shared/components/Modal";
import { PageHeader } from "../../shared/components/PageHeader";
import { toast } from "../../shared/components/Toast";
import { button } from "../../shared/ui";
import { trimProfile, validateProfile } from "../onboarding/OnboardingPage";
import { ImportBackupButton } from "./ImportBackupButton";
import { PaymentMethodsEditor, trimPaymentMethods, validatePaymentMethods } from "./PaymentMethodsEditor";

function SettingsGroup({ title, note, children }: { title: string; note: ReactNode; children: ReactNode }) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="grid gap-5 rounded-lg border border-border bg-surface p-5 md:p-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8"
    >
      <div>
        <h2 id={id} className="text-headline">
          {title}
        </h2>
        <p className="mt-1 text-label text-text-muted">{note}</p>
      </div>
      <div className="grid min-w-0 max-w-[600px] gap-4">{children}</div>
    </section>
  );
}

type Draft = {
  profile: Profile;
  payments: PaymentMethod[];
  prefix: string;
  nextNumber: string;
  dueDays: string;
  roundingMinutes: number;
  goalHours: number;
};

type Errors = Partial<Record<"name" | "email" | "prefix" | "nextNumber" | "dueDays", string>> & { payments?: Record<string, string> };

// Gives each saved profile/settings object a stable number, so the form can reset when they change.
const objectIds = new WeakMap<object, number>();
let lastObjectId = 0;
function objectId(value: object) {
  if (!objectIds.has(value)) objectIds.set(value, ++lastObjectId);
  return objectIds.get(value)!;
}

export function SettingsPage() {
  const data = useAppData();
  // Start a fresh draft after saving or importing, but not when unrelated data (like the timer) changes.
  return <SettingsForm key={`${objectId(data.profile)}-${objectId(data.settings)}`} />;
}

function SettingsForm() {
  const data = useAppData();
  const [draft, setDraft] = useState<Draft>(() => toDraft());
  const [errors, setErrors] = useState<Errors>({});
  const [confirmReset, setConfirmReset] = useState(false);

  function toDraft(): Draft {
    return {
      profile: data.profile,
      payments: data.settings.payments,
      prefix: data.settings.invoice.prefix,
      nextNumber: String(data.settings.invoice.nextNumber),
      dueDays: String(data.settings.invoice.dueDays),
      roundingMinutes: data.settings.roundingMinutes,
      goalHours: data.settings.goalHours,
    };
  }

  const saved = toDraft();
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(saved);
  const { profile } = draft;
  const next = Number(draft.nextNumber);
  const nextInvoice = Number.isSafeInteger(next) && next >= 1 ? formatInvoiceNumber(draft.prefix, next) : "—";

  const setProfile = (key: keyof Profile) => (event: { target: { value: string } }) =>
    setDraft((current) => ({ ...current, profile: { ...current.profile, [key]: event.target.value } }));

  function save() {
    const found: Errors = { ...validateProfile(profile) };
    const paymentErrors = validatePaymentMethods(draft.payments);
    if (Object.keys(paymentErrors).length) found.payments = paymentErrors;
    if (draft.prefix.length > 12) found.prefix = "Keep the prefix to 12 characters or fewer.";
    if (!Number.isSafeInteger(next) || next < 1) found.nextNumber = "Enter a number of 1 or more.";
    else if (data.invoices.some((invoice) => invoice.number === formatInvoiceNumber(draft.prefix, next))) {
      found.nextNumber = `${formatInvoiceNumber(draft.prefix, next)} is already used. Orasan will skip to the next free number.`;
    }
    const dueDays = Number(draft.dueDays);
    if (draft.dueDays === "" || !Number.isSafeInteger(dueDays) || dueDays > 365) found.dueDays = "Enter 0 to 365 days.";
    setErrors(found);

    // A taken invoice number is only a warning; everything else blocks saving.
    const blocking = Object.keys(found).filter((key) => !(key === "nextNumber" && Number.isSafeInteger(next) && next >= 1));
    if (blocking.length) {
      toast("Check the highlighted fields", "error");
      return;
    }

    const savedProfile = updateProfile(trimProfile(profile));
    const savedSettings = updateSettings({
      payments: trimPaymentMethods(draft.payments),
      invoice: { prefix: draft.prefix.trim(), nextNumber: next, dueDays },
      roundingMinutes: draft.roundingMinutes,
      goalHours: draft.goalHours,
    });
    // On success the form remounts with the saved values (see SettingsPage).
    if (savedProfile && savedSettings) {
      toast("Settings saved");
    } else {
      toast("Couldn't save settings in this browser. Try again.", "error");
    }
  }

  return (
    <form
      className="mx-auto w-full max-w-(--size-content) space-y-5"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <PageHeader
        title="Settings"
        subtitle={<span role="status">{hasChanges ? "Unsaved changes." : "All changes saved."}</span>}
        action={
          <button type="submit" disabled={!hasChanges} className={button.primary}>
            Save settings
          </button>
        }
      />

      <SettingsGroup title="Business info" note="Printed on every invoice.">
        <Field label="Your name" value={profile.name} error={errors.name} autoComplete="name" maxLength={120} onChange={setProfile("name")} />
        <Field
          label="Business name"
          value={profile.business}
          help="Optional. Shown above your name on invoices."
          autoComplete="organization"
          maxLength={120}
          onChange={setProfile("business")}
        />
        <Field label="Email" type="email" value={profile.email} error={errors.email} autoComplete="email" onChange={setProfile("email")} />
        <Field
          label="TIN"
          placeholder="Optional"
          value={profile.tin}
          help="Optional. Prints on your billing statements. Orasan invoices aren't BIR-registered."
          maxLength={40}
          onChange={setProfile("tin")}
        />
      </SettingsGroup>

      <SettingsGroup title="Payment details" note="Invoices show only the methods that are on and match their currency.">
        <PaymentMethodsEditor
          methods={draft.payments}
          errors={errors.payments}
          onChange={(payments) => setDraft((current) => ({ ...current, payments }))}
        />
      </SettingsGroup>

      <SettingsGroup title="Invoice numbering" note={`Next invoice: ${nextInvoice}`}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Prefix"
            value={draft.prefix}
            error={errors.prefix}
            onChange={(event) => setDraft((current) => ({ ...current, prefix: event.target.value }))}
          />
          <Field
            label="Next number"
            inputMode="numeric"
            value={draft.nextNumber}
            error={errors.nextNumber}
            onChange={(event) => setDraft((current) => ({ ...current, nextNumber: event.target.value.replace(/\D/g, "") }))}
          />
          <Field
            label="Due after (days)"
            inputMode="numeric"
            value={draft.dueDays}
            error={errors.dueDays}
            onChange={(event) => setDraft((current) => ({ ...current, dueDays: event.target.value.replace(/\D/g, "") }))}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title="Rounding" note="Applied to each entry when it goes on an invoice.">
        <SelectField
          label="Round each entry"
          value={draft.roundingMinutes}
          onChange={(event) => setDraft((current) => ({ ...current, roundingMinutes: Number(event.target.value) }))}
        >
          <option value={0}>No rounding</option>
          <option value={6}>Up to the next 6 minutes</option>
          <option value={15}>Up to the next 15 minutes</option>
        </SelectField>
      </SettingsGroup>

      <SettingsGroup title="Daily goal" note="Shown as a dashed line on the Dashboard’s hours chart.">
        <SelectField
          label="Hours a day"
          value={draft.goalHours}
          onChange={(event) => setDraft((current) => ({ ...current, goalHours: Number(event.target.value) }))}
        >
          <option value={0}>Off, no goal line</option>
          {[4, 5, 6, 7, 8, 9, 10].map((hours) => (
            <option key={hours} value={hours}>
              {hours} hours
            </option>
          ))}
        </SelectField>
      </SettingsGroup>

      <SettingsGroup
        title="Your data"
        note="Orasan keeps your data in this browser. Export a backup regularly, and before clearing browser data."
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={button.secondary}
            onClick={() => {
              downloadJson(buildBackup(data), backupFileName());
              toast("Backup downloaded");
            }}
          >
            <Download aria-hidden="true" size={16} />
            Export JSON
          </button>
          <ImportBackupButton />
        </div>
        <p className="text-label text-text-muted">
          The export includes your profile, settings, clients, projects, time entries and invoices. Importing replaces
          everything here.
        </p>
        <div className="border-t border-border pt-4">
          <button type="button" className={button.danger} onClick={() => setConfirmReset(true)}>
            <Trash2 aria-hidden="true" size={16} />
            Delete all data
          </button>
        </div>
      </SettingsGroup>

      <ConfirmDialog
        open={confirmReset}
        title="Delete all of your data?"
        description="This removes your profile, clients, time entries and invoices from this browser and starts setup again. It can't be undone. Export a backup first if you might need it."
        confirmLabel="Delete everything"
        onConfirm={resetAllData}
        onClose={() => setConfirmReset(false)}
      />
    </form>
  );
}
