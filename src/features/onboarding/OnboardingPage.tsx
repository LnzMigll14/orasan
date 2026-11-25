import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { defaultPaymentMethods, emptyProfile } from "../../data/defaults";
import { completeOnboarding } from "../../data/store";
import type { PaymentMethod, Profile } from "../../data/types";
import { Logo } from "../../shared/components/brand/Logo";
import { Field, isEmail } from "../../shared/components/form";
import { toast } from "../../shared/components/Toast";
import { button, card } from "../../shared/ui";
import {
  ClientFormFields,
  emptyClientForm,
  validateClientForm,
  type ClientFormErrors,
} from "../clients/clientForm";
import { ImportBackupButton } from "../settings/ImportBackupButton";
import { PaymentMethodsEditor, trimPaymentMethods, validatePaymentMethods } from "../settings/PaymentMethodsEditor";

const steps = ["Your details", "How you get paid", "First client and rate"] as const;

type ProfileErrors = Partial<Record<keyof Profile, string>>;

export function validateProfile(profile: Profile): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!profile.name.trim()) errors.name = "Enter your name. It prints on your invoices.";
  if (!profile.email.trim()) errors.email = "Enter your email. Clients reply to it.";
  else if (!isEmail(profile.email)) errors.email = "Enter a valid email address.";
  return errors;
}

export function trimProfile(profile: Profile): Profile {
  return {
    name: profile.name.trim(),
    business: profile.business.trim(),
    email: profile.email.trim(),
    tin: profile.tin.trim(),
  };
}

/** Shown on first visit, when there is no saved data. Collects what an invoice needs. */
export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [payments, setPayments] = useState<PaymentMethod[]>(defaultPaymentMethods);
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [client, setClient] = useState(emptyClientForm);
  const [clientErrors, setClientErrors] = useState<ClientFormErrors>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Move focus to each new step's heading so screen readers announce it.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  function finish(withClient: boolean) {
    let clientInput = null;
    if (withClient) {
      const { errors, rateMinor } = validateClientForm(client, { requireProject: true });
      setClientErrors(errors);
      if (Object.keys(errors).length) return;
      clientInput = { ...client, rateMinor };
    }
    const saved = completeOnboarding({
      profile: trimProfile(profile),
      payments: trimPaymentMethods(payments),
      client: clientInput,
    });
    if (saved) toast("You're all set. Tara, start tracking!");
    else toast("Couldn't save in this browser. Check that site data is allowed.", "error");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (step === 0) {
      const errors = validateProfile(profile);
      setProfileErrors(errors);
      if (Object.keys(errors).length === 0) setStep(1);
    } else if (step === 1) {
      const errors = validatePaymentMethods(payments);
      setPaymentErrors(errors);
      if (Object.keys(errors).length === 0) setStep(2);
    } else {
      finish(true);
    }
  }

  const setField = (key: keyof Profile) => (event: { target: { value: string } }) =>
    setProfile((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div className="min-h-dvh bg-canvas px-4 py-6 text-text md:px-10 md:py-8">
      <Logo size={32} />

      <form noValidate onSubmit={handleSubmit} className={`${card} mt-6 w-full max-w-xl p-5 md:mt-8 md:p-8`}>
        <ol className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Setup steps">
          {steps.map((label, index) => {
            const done = index < step;
            const currentStep = index === step;
            return (
              <li
                key={label}
                aria-current={currentStep ? "step" : undefined}
                className={`flex items-center gap-2 text-label font-bold ${currentStep ? "text-text" : "text-text-muted"}`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-6 place-items-center rounded-full border text-micro ${
                    currentStep
                      ? "border-amber bg-amber text-on-amber"
                      : done
                        ? "border-amber-tint bg-amber-tint text-amber"
                        : "border-border-strong"
                  }`}
                >
                  {done ? <Check size={12} strokeWidth={3} /> : index + 1}
                </span>
                {label}
                {done && <span className="sr-only">(done)</span>}
              </li>
            );
          })}
        </ol>

        <h1 ref={headingRef} tabIndex={-1} className="mt-8 text-display outline-none">
          {steps[step]}
        </h1>

        {step === 0 && (
          <div className="mt-2 grid gap-4">
            <p className="text-body text-text-secondary">
              These print on every invoice you send. Everything you enter stays in this browser, on this device.
            </p>
            <Field label="Your name" value={profile.name} error={profileErrors.name} autoComplete="name" autoFocus maxLength={120} onChange={setField("name")} />
            <Field
              label="Business name"
              value={profile.business}
              help="Optional. Shown above your name on invoices."
              autoComplete="organization"
              maxLength={120}
              onChange={setField("business")}
            />
            <Field label="Email" type="email" value={profile.email} error={profileErrors.email} autoComplete="email" onChange={setField("email")} />
            <Field
              label="TIN"
              placeholder="Optional"
              value={profile.tin}
              help="Optional. Prints on your billing statements. Orasan invoices aren't BIR-registered."
              maxLength={40}
              onChange={setField("tin")}
            />
          </div>
        )}

        {step === 1 && (
          <div className="mt-2 grid gap-4">
            <p className="text-body text-text-secondary">
              Turn on the ways clients can pay you. Invoices only show methods that match their currency. You can change these in
              Settings.
            </p>
            <PaymentMethodsEditor methods={payments} onChange={setPayments} errors={paymentErrors} />
          </div>
        )}

        {step === 2 && (
          <div className="mt-2 grid gap-4">
            <p className="text-body text-text-secondary">Add one client now. You can add more from Clients.</p>
            <ClientFormFields values={client} errors={clientErrors} onChange={setClient} showContactFields={false} />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className={button.secondary}>
              Back
            </button>
          )}
          {step === 0 && <ImportBackupButton className={button.ghost} label="Restore from a backup" />}
          <div className="ml-auto flex flex-wrap gap-2">
            {step === 2 && (
              <button type="button" onClick={() => finish(false)} className={button.ghost}>
                Skip for now
              </button>
            )}
            <button type="submit" className={button.primary}>
              {step === 2 ? "Start tracking" : "Continue"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
