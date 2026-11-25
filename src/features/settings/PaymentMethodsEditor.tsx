import type { PaymentMethod } from "../../data/types";
import { Field, Switch } from "../../shared/components/form";

/** Turn payment methods on and fill in their details. Shared by onboarding and Settings. */
export function PaymentMethodsEditor({
  methods,
  onChange,
  errors = {},
}: {
  methods: PaymentMethod[];
  onChange: (methods: PaymentMethod[]) => void;
  /** Keyed by `${methodId}:${fieldLabel}`. */
  errors?: Record<string, string>;
}) {
  function updateMethod(id: string, update: (method: PaymentMethod) => PaymentMethod) {
    onChange(methods.map((method) => (method.id === id ? update(method) : method)));
  }

  return (
    <div className="divide-y divide-border">
      {methods.map((method) => (
        <div key={method.id} className="grid gap-3 py-3 first:pt-0 last:pb-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-body font-bold">
              {method.label}{" "}
              <span className="text-label font-medium text-text-muted">{method.currency} invoices</span>
            </p>
            <Switch
              label={`Accept ${method.label}`}
              checked={method.enabled}
              onChange={(enabled) => updateMethod(method.id, (current) => ({ ...current, enabled }))}
            />
          </div>

          {method.enabled && (
            <fieldset className="grid min-w-0 gap-4 pb-2 md:grid-cols-2">
              <legend className="sr-only">{method.label} details</legend>
              {method.fields.map((field) => (
                <Field
                  key={field.label}
                  label={field.label}
                  type={field.type ?? "text"}
                  inputMode={field.type === "tel" ? "tel" : undefined}
                  autoComplete="off"
                  value={field.value}
                  error={errors[`${method.id}:${field.label}`]}
                  onChange={(event) => {
                    const value = event.target.value;
                    updateMethod(method.id, (current) => ({
                      ...current,
                      fields: current.fields.map((item) => (item.label === field.label ? { ...item, value } : item)),
                    }));
                  }}
                />
              ))}
            </fieldset>
          )}
        </div>
      ))}
    </div>
  );
}

/** Every switched-on method needs all of its details. */
export function validatePaymentMethods(methods: PaymentMethod[]) {
  const errors: Record<string, string> = {};
  for (const method of methods) {
    if (!method.enabled) continue;
    for (const field of method.fields) {
      const value = field.value.trim();
      if (!value) errors[`${method.id}:${field.label}`] = `Enter the ${field.label.toLowerCase()}, or turn ${method.label} off.`;
      else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[`${method.id}:${field.label}`] = "Enter a valid email address.";
      }
    }
  }
  return errors;
}

export function trimPaymentMethods(methods: PaymentMethod[]) {
  return methods.map((method) => ({
    ...method,
    fields: method.fields.map((field) => ({ ...field, value: field.value.trim() })),
  }));
}
