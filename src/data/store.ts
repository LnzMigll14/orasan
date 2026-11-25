import { useSyncExternalStore } from "react";
import { addDays, todayKey } from "../shared/time";
import { createAppData } from "./defaults";
import { buildInvoiceLines, formatInvoiceNumber, sumLines } from "./invoicing";
import { migrate } from "./migrations";
import { localStorageAdapter, type StorageAdapter } from "./storage";
import type {
  AppData,
  Client,
  Currency,
  Invoice,
  Payment,
  PaymentMethod,
  Profile,
  Project,
  Settings,
  TimeEntry,
} from "./types";

/*
 * The app's single data store. Components read with useAppData() and change data only
 * through the actions exported below. Persistence goes through a StorageAdapter, so
 * swapping localStorage for a backend means writing a new adapter, not touching the UI.
 */

export type StoreState = {
  /** null until onboarding is finished. */
  data: AppData | null;
  /** Saved data exists but can't be read. The app refuses to overwrite it. */
  loadError: string[] | null;
  /** The last write failed (for example storage is full). Changes stay in memory. */
  saveFailed: boolean;
};

const adapter: StorageAdapter = localStorageAdapter;
const listeners = new Set<() => void>();
let state: StoreState = readFromStorage();

function readFromStorage(): StoreState {
  try {
    const raw = adapter.load();
    if (raw === null) return { data: null, loadError: null, saveFailed: false };
    const result = migrate(raw);
    if (!result.ok) return { data: null, loadError: result.errors, saveFailed: false };
    return { data: result.data, loadError: null, saveFailed: false };
  } catch (error) {
    return {
      data: null,
      loadError: [error instanceof Error ? error.message : "Saved data could not be read."],
      saveFailed: false,
    };
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Keep tabs in sync when another tab changes the data.
adapter.subscribe?.(() => {
  state = readFromStorage();
  emit();
});

function persist(data: AppData | null) {
  try {
    if (data) adapter.save(data);
    else adapter.clear();
    return true;
  } catch {
    return false;
  }
}

function setData(data: AppData | null) {
  const saved = persist(data);
  state = { data, loadError: null, saveFailed: !saved };
  emit();
  return saved;
}

/** Applies a change to the current data. Throws if called before onboarding. */
function update(change: (data: AppData) => AppData) {
  if (!state.data) throw new Error("Orasan has no data yet.");
  const next = change(state.data);
  return setData({ ...next, updatedAt: new Date().toISOString() });
}

function current() {
  if (!state.data) throw new Error("Orasan has no data yet.");
  return state.data;
}

export function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---------- Hooks ----------

export function useStoreState() {
  return useSyncExternalStore(subscribe, () => state);
}

/** The current data. Only use inside screens that render after onboarding. */
export function useAppData() {
  const { data } = useStoreState();
  if (!data) throw new Error("useAppData was called before onboarding finished.");
  return data;
}

export function getAppData() {
  return state.data;
}

// ---------- Result type for actions that can be refused ----------

export type ActionResult<T = void> = { ok: true; value: T } | { ok: false; error: string };
const ok = <T>(value: T): ActionResult<T> => ({ ok: true, value });
const fail = (error: string): ActionResult<never> => ({ ok: false, error });

// ---------- Onboarding, profile, settings ----------

export type NewClientInput = {
  name: string;
  contact: string;
  email: string;
  currency: Currency;
  rateMinor: number;
  projectName: string;
};

export function completeOnboarding(input: {
  profile: Profile;
  payments: PaymentMethod[];
  client: NewClientInput | null;
}) {
  const data = createAppData(input.profile);
  data.settings.payments = input.payments;
  if (input.client) {
    const { clients, projects } = withNewClient(data, input.client);
    data.clients = clients.list;
    data.projects = projects;
  }
  return setData(data);
}

export function updateProfile(profile: Profile) {
  return update((data) => ({ ...data, profile }));
}

export function updateSettings(settings: Settings) {
  return update((data) => ({ ...data, settings }));
}

// ---------- Clients and projects ----------

function withNewClient(data: AppData, input: NewClientInput) {
  const now = new Date().toISOString();
  const client: Client = {
    id: newId(),
    name: input.name.trim(),
    contact: input.contact.trim(),
    email: input.email.trim(),
    currency: input.currency,
    rateMinor: input.rateMinor,
    createdAt: now,
  };
  const projects = [...data.projects];
  if (input.projectName.trim()) {
    projects.push({ id: newId(), clientId: client.id, name: input.projectName.trim(), rateMinor: null, createdAt: now });
  }
  return { clients: { list: [...data.clients, client], client }, projects };
}

export function addClient(input: NewClientInput) {
  let id = "";
  update((data) => {
    const { clients, projects } = withNewClient(data, input);
    id = clients.client.id;
    return { ...data, clients: clients.list, projects };
  });
  return id;
}

export function updateClient(id: string, patch: Partial<Omit<Client, "id" | "createdAt">>): ActionResult {
  const data = current();
  const client = data.clients.find((item) => item.id === id);
  if (!client) return fail("This client no longer exists.");
  if (patch.currency && patch.currency !== client.currency && data.invoices.some((inv) => inv.clientId === id)) {
    return fail("The currency can't change once the client has invoices.");
  }
  update((d) => ({ ...d, clients: d.clients.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  return ok(undefined);
}

export function deleteClient(id: string): ActionResult {
  const data = current();
  if (data.invoices.some((invoice) => invoice.clientId === id)) {
    return fail("This client has invoices. Delete their invoices first.");
  }
  const projectIds = new Set(data.projects.filter((project) => project.clientId === id).map((p) => p.id));
  update((d) => ({
    ...d,
    clients: d.clients.filter((client) => client.id !== id),
    projects: d.projects.filter((project) => !projectIds.has(project.id)),
    entries: d.entries.filter((entry) => !projectIds.has(entry.projectId)),
    runningTimer: d.runningTimer && projectIds.has(d.runningTimer.projectId) ? null : d.runningTimer,
  }));
  return ok(undefined);
}

export function addProject(clientId: string, name: string, rateMinor: number | null) {
  const project: Project = { id: newId(), clientId, name: name.trim(), rateMinor, createdAt: new Date().toISOString() };
  update((data) => ({ ...data, projects: [...data.projects, project] }));
  return project.id;
}

export function updateProject(id: string, patch: { name?: string; rateMinor?: number | null }) {
  return update((data) => ({
    ...data,
    projects: data.projects.map((project) => (project.id === id ? { ...project, ...patch } : project)),
  }));
}

export function deleteProject(id: string): ActionResult {
  const data = current();
  if (data.entries.some((entry) => entry.projectId === id && entry.invoiceId)) {
    return fail("This project has billed time on an invoice, so it can't be deleted.");
  }
  update((d) => ({
    ...d,
    projects: d.projects.filter((project) => project.id !== id),
    entries: d.entries.filter((entry) => entry.projectId !== id),
    runningTimer: d.runningTimer?.projectId === id ? null : d.runningTimer,
  }));
  return ok(undefined);
}

// ---------- Timer and time entries ----------

function entryFromTimer(data: AppData, stoppedAt: number): TimeEntry | null {
  const timer = data.runningTimer;
  if (!timer) return null;
  // Ignore accidental taps that last less than a second.
  if (stoppedAt - Date.parse(timer.startedAt) < 1000) return null;
  return {
    id: newId(),
    projectId: timer.projectId,
    description: timer.description.trim(),
    startedAt: timer.startedAt,
    endedAt: new Date(stoppedAt).toISOString(),
    invoiceId: null,
  };
}

/** Starts a timer. A running timer is stopped and saved first, so only one runs at a time. */
export function startTimer(projectId: string, description: string) {
  const now = Date.now();
  return update((data) => {
    const stopped = entryFromTimer(data, now);
    return {
      ...data,
      entries: stopped ? [stopped, ...data.entries] : data.entries,
      runningTimer: { projectId, description: description.trim(), startedAt: new Date(now).toISOString() },
    };
  });
}

export function updateRunningTimer(patch: { projectId?: string; description?: string }) {
  return update((data) =>
    data.runningTimer ? { ...data, runningTimer: { ...data.runningTimer, ...patch } } : data,
  );
}

export function stopTimer() {
  const entry = entryFromTimer(current(), Date.now());
  update((data) => ({
    ...data,
    entries: entry ? [entry, ...data.entries] : data.entries,
    runningTimer: null,
  }));
  return entry;
}

export function discardTimer() {
  return update((data) => ({ ...data, runningTimer: null }));
}

export type EntryInput = Pick<TimeEntry, "projectId" | "description" | "startedAt" | "endedAt">;

export function addEntry(input: EntryInput) {
  const entry: TimeEntry = { ...input, description: input.description.trim(), id: newId(), invoiceId: null };
  update((data) => ({ ...data, entries: [entry, ...data.entries] }));
  return entry.id;
}

export function updateEntry(id: string, input: EntryInput): ActionResult {
  const entry = current().entries.find((item) => item.id === id);
  if (!entry) return fail("This entry no longer exists.");
  if (entry.invoiceId) return fail("This entry is on an invoice and is locked.");
  update((data) => ({
    ...data,
    entries: data.entries.map((item) =>
      item.id === id ? { ...item, ...input, description: input.description.trim() } : item,
    ),
  }));
  return ok(undefined);
}

export function deleteEntry(id: string): ActionResult {
  const entry = current().entries.find((item) => item.id === id);
  if (entry?.invoiceId) return fail("This entry is on an invoice and is locked.");
  update((data) => ({ ...data, entries: data.entries.filter((item) => item.id !== id) }));
  return ok(undefined);
}

// ---------- Invoices ----------

/** The next free invoice number (skips numbers already used, for example after an import). */
export function nextInvoiceNumber(data: AppData) {
  const taken = new Set(data.invoices.map((invoice) => invoice.number));
  let number = Math.max(1, data.settings.invoice.nextNumber);
  while (taken.has(formatInvoiceNumber(data.settings.invoice.prefix, number))) number++;
  return number;
}

function linesFor(data: AppData, clientId: string, entryIds: readonly string[], allowInvoiceId: string | null) {
  const wanted = new Set(entryIds);
  const clientProjects = new Set(data.projects.filter((p) => p.clientId === clientId).map((p) => p.id));
  const entries = data.entries.filter(
    (entry) =>
      wanted.has(entry.id) &&
      clientProjects.has(entry.projectId) &&
      (entry.invoiceId === null || entry.invoiceId === allowInvoiceId),
  );
  return { entries, lines: buildInvoiceLines(data, entries) };
}

export function createInvoice(input: { clientId: string; entryIds: string[]; send: boolean }): ActionResult<string> {
  const data = current();
  const client = data.clients.find((item) => item.id === input.clientId);
  if (!client) return fail("This client no longer exists.");

  const { entries, lines } = linesFor(data, client.id, input.entryIds, null);
  if (entries.length === 0) return fail("Pick at least one unbilled entry.");

  const number = nextInvoiceNumber(data);
  const issuedOn = todayKey();
  const now = new Date().toISOString();
  const invoice: Invoice = {
    id: newId(),
    number: formatInvoiceNumber(data.settings.invoice.prefix, number),
    clientId: client.id,
    currency: client.currency,
    status: input.send ? "sent" : "draft",
    issuedOn,
    dueOn: addDays(issuedOn, data.settings.invoice.dueDays),
    createdAt: now,
    sentAt: input.send ? now : null,
    billedTo: { name: client.name, email: client.email },
    lines,
    entryIds: entries.map((entry) => entry.id),
    totalMinor: sumLines(lines),
    payment: null,
  };
  const billed = new Set(invoice.entryIds);

  update((d) => ({
    ...d,
    invoices: [invoice, ...d.invoices],
    entries: d.entries.map((entry) => (billed.has(entry.id) ? { ...entry, invoiceId: invoice.id } : entry)),
    settings: { ...d.settings, invoice: { ...d.settings.invoice, nextNumber: number + 1 } },
  }));
  return ok(invoice.id);
}

/** Replaces the entries on a draft. Sent and paid invoices are settled. */
export function updateDraftInvoice(id: string, entryIds: string[], send: boolean): ActionResult<string> {
  const data = current();
  const invoice = data.invoices.find((item) => item.id === id);
  if (!invoice) return fail("This invoice no longer exists.");
  if (invoice.status !== "draft") return fail("Only drafts can be edited.");
  const client = data.clients.find((item) => item.id === invoice.clientId);

  const { entries, lines } = linesFor(data, invoice.clientId, entryIds, id);
  if (entries.length === 0) return fail("Pick at least one unbilled entry.");

  const billed = new Set(entries.map((entry) => entry.id));
  const today = todayKey();
  const now = new Date().toISOString();
  update((d) => ({
    ...d,
    entries: d.entries.map((entry) => {
      if (billed.has(entry.id)) return { ...entry, invoiceId: id };
      if (entry.invoiceId === id) return { ...entry, invoiceId: null };
      return entry;
    }),
    invoices: d.invoices.map((item) =>
      item.id === id
        ? {
            ...item,
            lines,
            entryIds: [...billed],
            totalMinor: sumLines(lines),
            billedTo: client ? { name: client.name, email: client.email } : item.billedTo,
            ...(send
              ? { status: "sent" as const, sentAt: now, issuedOn: today, dueOn: addDays(today, d.settings.invoice.dueDays) }
              : {}),
          }
        : item,
    ),
  }));
  return ok(id);
}

export function sendInvoice(id: string) {
  const today = todayKey();
  return update((data) => ({
    ...data,
    invoices: data.invoices.map((invoice) =>
      invoice.id === id && invoice.status === "draft"
        ? {
            ...invoice,
            status: "sent",
            sentAt: new Date().toISOString(),
            issuedOn: today,
            dueOn: addDays(today, data.settings.invoice.dueDays),
          }
        : invoice,
    ),
  }));
}

export function markInvoicePaid(id: string, payment: Payment) {
  return update((data) => ({
    ...data,
    invoices: data.invoices.map((invoice) => (invoice.id === id ? { ...invoice, status: "paid", payment } : invoice)),
  }));
}

export function markInvoiceUnpaid(id: string) {
  return update((data) => ({
    ...data,
    invoices: data.invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, status: "sent", payment: null } : invoice,
    ),
  }));
}

/** Deletes an invoice and returns its entries to unbilled time. */
export function deleteInvoice(id: string) {
  return update((data) => ({
    ...data,
    invoices: data.invoices.filter((invoice) => invoice.id !== id),
    entries: data.entries.map((entry) => (entry.invoiceId === id ? { ...entry, invoiceId: null } : entry)),
  }));
}

// ---------- Whole-dataset operations ----------

/** Replaces everything with already-validated data (used by import). */
export function replaceAllData(data: AppData) {
  return setData(data);
}

/** The saved data exactly as stored, for downloading when it can't be read. */
export function readRawSavedData() {
  return adapter.readRaw();
}

/** Deletes all saved data and returns to onboarding. */
export function resetAllData() {
  return setData(null);
}
