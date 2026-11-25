import type { AppData } from "./types";

/**
 * The only place that knows where data lives. To move to a real database later,
 * write another adapter with the same methods (for example one backed by Supabase)
 * and pass it to the store in store.ts. UI components never call this directly.
 */
export type StorageAdapter = {
  /** Returns the raw saved value, or null when nothing is saved yet. Throws if storage is unreadable. */
  load(): unknown;
  /** Throws when the write fails, for example when storage is full or blocked. */
  save(data: AppData): void;
  clear(): void;
  /** The saved value as text, for rescuing data that can no longer be read. */
  readRaw(): string | null;
  /** Calls back when the data changes outside this tab. Returns an unsubscribe function. */
  subscribe?(onExternalChange: () => void): () => void;
  /** Asks the browser not to clear this data when the device runs low on space. */
  requestPersistence?(): void;
};

export const STORAGE_KEY = "orasan:data";

export const localStorageAdapter: StorageAdapter = {
  load() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  },
  save(data) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
  },
  readRaw() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  requestPersistence() {
    // Best effort: some browsers grant it silently, others decide from site engagement.
    void navigator.storage?.persist?.().catch(() => undefined);
  },
  subscribe(onExternalChange) {
    const listener = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) onExternalChange();
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  },
};
