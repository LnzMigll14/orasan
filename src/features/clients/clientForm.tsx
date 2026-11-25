import { currencies, type Currency } from "../../data/types";
import { Field, SelectField, isEmail } from "../../shared/components/form";
import { currencyNames, currencySymbols, parseMoneyInput } from "../../shared/formatMoney";

export type ClientFormValues = {
  name: string;
  contact: string;
  email: string;
  currency: Currency;
  rate: string;
  projectName: string;
};

export type ClientFormErrors = Partial<Record<keyof ClientFormValues, string>>;

export const emptyClientForm: ClientFormValues = {
  name: "",
  contact: "",
  email: "",
  currency: "PHP",
  rate: "",
  projectName: "",
};

export function validateClientForm(values: ClientFormValues, { requireProject }: { requireProject: boolean }) {
  const errors: ClientFormErrors = {};
  if (!values.name.trim()) errors.name = "Enter the client's name.";
  if (values.email.trim() && !isEmail(values.email)) errors.email = "Enter a valid email address.";
  const rate = parseMoneyInput(values.rate);
  if (rate === null) errors.rate = "Enter an hourly rate, like 1200 or 12.50.";
  else if (rate === 0) errors.rate = "The rate must be more than zero.";
  if (requireProject && !values.projectName.trim()) errors.projectName = "Name the first project. Time is tracked against a project.";
  return { errors, rateMinor: rate ?? 0 };
}

type Props = {
  values: ClientFormValues;
  errors: ClientFormErrors;
  onChange: (values: ClientFormValues) => void;
  /** Show the contact and email fields (the Clients drawer does; onboarding keeps it short). */
  showContactFields?: boolean;
  showProject?: boolean;
  currencyLocked?: boolean;
};

export function ClientFormFields({
  values,
  errors,
  onChange,
  showContactFields = true,
  showProject = true,
  currencyLocked = false,
}: Props) {
  const set = <K extends keyof ClientFormValues>(key: K, value: ClientFormValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <>
      <Field
        label="Client name"
        value={values.name}
        error={errors.name}
        help="Shown on invoices."
        autoComplete="organization"
        maxLength={120}
        onChange={(event) => set("name", event.target.value)}
      />
      {showContactFields && (
        <>
          <Field
            label="Contact person"
            value={values.contact}
            help="Optional."
            autoComplete="off"
            maxLength={120}
            onChange={(event) => set("contact", event.target.value)}
          />
          <Field
            label="Billing email"
            type="email"
            value={values.email}
            error={errors.email}
            help="Optional. Printed on invoices."
            autoComplete="off"
            onChange={(event) => set("email", event.target.value)}
          />
        </>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Currency"
          value={values.currency}
          disabled={currencyLocked}
          help={currencyLocked ? "Locked because this client has invoices." : "Invoices use this currency."}
          onChange={(event) => set("currency", event.target.value as Currency)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currencyNames[currency]}
            </option>
          ))}
        </SelectField>
        <Field
          label="Hourly rate"
          prefix={currencySymbols[values.currency]}
          inputMode="decimal"
          placeholder="0.00"
          value={values.rate}
          error={errors.rate}
          help={showProject ? "Projects can override this." : undefined}
          onChange={(event) => set("rate", event.target.value)}
        />
      </div>
      {showProject && (
        <Field
          label="First project"
          value={values.projectName}
          error={errors.projectName}
          help="Time is tracked against a project."
          maxLength={120}
          onChange={(event) => set("projectName", event.target.value)}
        />
      )}
    </>
  );
}
