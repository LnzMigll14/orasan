// The shape of everything Orasan stores. Bump DATA_VERSION and add a migration in
// migrations.ts whenever this shape changes.

export type Currency = "PHP" | "USD";
export const currencies: readonly Currency[] = ["PHP", "USD"];

export type Profile = {
  name: string;
  business: string;
  email: string;
  tin: string;
};

export type PaymentField = {
  label: string;
  value: string;
  type?: "email" | "tel";
};

export type PaymentMethod = {
  id: string;
  label: string;
  currency: Currency;
  enabled: boolean;
  fields: PaymentField[];
};

export type Settings = {
  payments: PaymentMethod[];
  invoice: {
    prefix: string;
    nextNumber: number;
    dueDays: number;
  };
  /** 0 means no rounding; otherwise each entry rounds up to this many minutes. */
  roundingMinutes: number;
  /** 0 hides the goal line on the Dashboard chart. */
  goalHours: number;
};

export type Client = {
  id: string;
  name: string;
  contact: string;
  email: string;
  currency: Currency;
  /** Hourly rate in centavos or cents. */
  rateMinor: number;
  createdAt: string;
};

export type Project = {
  id: string;
  clientId: string;
  name: string;
  /** null uses the client's rate. */
  rateMinor: number | null;
  createdAt: string;
};

export type TimeEntry = {
  id: string;
  projectId: string;
  description: string;
  /** UTC ISO timestamps. */
  startedAt: string;
  endedAt: string;
  /** Set when the entry is on an invoice. Billed entries are locked. */
  invoiceId: string | null;
};

export type RunningTimer = {
  projectId: string;
  description: string;
  startedAt: string;
};

export type InvoiceLine = {
  projectId: string;
  description: string;
  minutes: number;
  rateMinor: number;
  amountMinor: number;
  /** Calendar days (YYYY-MM-DD) of the first and last entry on the line. */
  firstDate: string;
  lastDate: string;
};

export type Payment = {
  methodId: string;
  methodLabel: string;
  reference: string;
  /** Calendar day, YYYY-MM-DD. */
  receivedOn: string;
};

/** Stored status. "overdue" is derived from a sent invoice's due date. */
export type StoredInvoiceStatus = "draft" | "sent" | "paid";
export type InvoiceStatus = StoredInvoiceStatus | "overdue";

export type Invoice = {
  id: string;
  number: string;
  clientId: string;
  currency: Currency;
  status: StoredInvoiceStatus;
  /** Calendar days, YYYY-MM-DD. */
  issuedOn: string;
  dueOn: string;
  createdAt: string;
  sentAt: string | null;
  /** A snapshot so a sent invoice doesn't change when the client is edited. */
  billedTo: { name: string; email: string };
  lines: InvoiceLine[];
  entryIds: string[];
  totalMinor: number;
  payment: Payment | null;
};

export type AppData = {
  version: number;
  profile: Profile;
  settings: Settings;
  clients: Client[];
  projects: Project[];
  entries: TimeEntry[];
  invoices: Invoice[];
  runningTimer: RunningTimer | null;
  createdAt: string;
  updatedAt: string;
};

export const DATA_VERSION = 1;
