import { currencies, type AppData } from "./types";

// A small hand-written validator. It checks the stored shape and the references
// between records so a bad import can't leave the app in a broken state.

type Check = (value: unknown, path: string, errors: string[]) => void;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const str: Check = (v, p, e) => {
  if (typeof v !== "string") e.push(`${p} must be text`);
};
const int: Check = (v, p, e) => {
  if (!Number.isSafeInteger(v) || (v as number) < 0) e.push(`${p} must be a whole number of 0 or more`);
};
const bool: Check = (v, p, e) => {
  if (typeof v !== "boolean") e.push(`${p} must be true or false`);
};
const iso: Check = (v, p, e) => {
  if (typeof v !== "string" || Number.isNaN(Date.parse(v))) e.push(`${p} must be a date and time`);
};
const day: Check = (v, p, e) => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) e.push(`${p} must be a date (YYYY-MM-DD)`);
};
const currency: Check = (v, p, e) => {
  if (!currencies.includes(v as never)) e.push(`${p} must be PHP or USD`);
};
const nullable = (check: Check): Check => (v, p, e) => {
  if (v !== null) check(v, p, e);
};
const oneOf = (...options: string[]): Check => (v, p, e) => {
  if (!options.includes(v as string)) e.push(`${p} must be one of ${options.join(", ")}`);
};
const shape = (fields: Record<string, Check>): Check => (v, p, e) => {
  if (!isObject(v)) {
    e.push(`${p} must be an object`);
    return;
  }
  for (const [key, check] of Object.entries(fields)) check(v[key], `${p}.${key}`, e);
};
const list = (item: Check): Check => (v, p, e) => {
  if (!Array.isArray(v)) {
    e.push(`${p} must be a list`);
    return;
  }
  v.forEach((value, index) => item(value, `${p}[${index}]`, e));
};

const appDataShape = shape({
  version: int,
  profile: shape({ name: str, business: str, email: str, tin: str }),
  settings: shape({
    payments: list(
      shape({
        id: str,
        label: str,
        currency,
        enabled: bool,
        fields: list(shape({ label: str, value: str })),
      }),
    ),
    invoice: shape({ prefix: str, nextNumber: int, dueDays: int }),
    roundingMinutes: int,
    goalHours: int,
  }),
  clients: list(
    shape({ id: str, name: str, contact: str, email: str, currency, rateMinor: int, createdAt: iso }),
  ),
  projects: list(shape({ id: str, clientId: str, name: str, rateMinor: nullable(int), createdAt: iso })),
  entries: list(
    shape({ id: str, projectId: str, description: str, startedAt: iso, endedAt: iso, invoiceId: nullable(str) }),
  ),
  invoices: list(
    shape({
      id: str,
      number: str,
      clientId: str,
      currency,
      status: oneOf("draft", "sent", "paid"),
      issuedOn: day,
      dueOn: day,
      createdAt: iso,
      sentAt: nullable(iso),
      billedTo: shape({ name: str, email: str }),
      lines: list(
        shape({
          projectId: str,
          description: str,
          minutes: int,
          rateMinor: int,
          amountMinor: int,
          firstDate: day,
          lastDate: day,
        }),
      ),
      entryIds: list(str),
      totalMinor: int,
      payment: nullable(shape({ methodId: str, methodLabel: str, reference: str, receivedOn: day })),
    }),
  ),
  runningTimer: nullable(shape({ projectId: str, description: str, startedAt: iso })),
  createdAt: iso,
  updatedAt: iso,
});

function checkReferences(data: AppData, errors: string[]) {
  const unique = (items: { id: string }[], label: string) => {
    const seen = new Set<string>();
    for (const { id } of items) {
      if (seen.has(id)) errors.push(`${label} has a duplicate id "${id}"`);
      seen.add(id);
    }
    return seen;
  };

  const clientIds = unique(data.clients, "clients");
  const projectIds = unique(data.projects, "projects");
  const invoiceIds = unique(data.invoices, "invoices");
  unique(data.entries, "entries");

  for (const project of data.projects) {
    if (!clientIds.has(project.clientId)) errors.push(`Project "${project.name}" belongs to a missing client`);
  }
  for (const entry of data.entries) {
    if (!projectIds.has(entry.projectId)) errors.push(`Time entry ${entry.id} belongs to a missing project`);
    if (entry.invoiceId && !invoiceIds.has(entry.invoiceId)) {
      errors.push(`Time entry ${entry.id} is on a missing invoice`);
    }
  }
  for (const invoice of data.invoices) {
    if (!clientIds.has(invoice.clientId)) errors.push(`Invoice ${invoice.number} belongs to a missing client`);
  }
  if (data.runningTimer && !projectIds.has(data.runningTimer.projectId)) {
    errors.push("The running timer belongs to a missing project");
  }
}

export type ValidationResult = { ok: true; data: AppData } | { ok: false; errors: string[] };

export function validateAppData(value: unknown): ValidationResult {
  const errors: string[] = [];
  appDataShape(value, "data", errors);
  if (errors.length === 0) checkReferences(value as AppData, errors);
  // "data.clients[0].name" reads better as "clients[0].name".
  const readable = errors.map((error) => error.replace(/^data\./, "").replace(/^data /, "The data "));
  return errors.length ? { ok: false, errors: readable } : { ok: true, data: value as AppData };
}
