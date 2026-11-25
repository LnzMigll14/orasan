import { DATA_VERSION, type AppData } from "./types";
import { validateAppData, type ValidationResult } from "./validate";

/**
 * Each entry upgrades data from version N to N + 1. When the AppData shape changes:
 *   1. bump DATA_VERSION in types.ts,
 *   2. add `[oldVersion]: (data) => ({ ...data, version: oldVersion + 1, ...changes })` here.
 * Saved data and imported files both pass through migrate(), so old exports keep working.
 */
const migrations: Record<number, (data: Record<string, unknown>) => Record<string, unknown>> = {
  // Example for the next change:
  // 1: (data) => ({ ...data, version: 2, clients: (data.clients as any[]).map((c) => ({ ...c, notes: "" })) }),
};

export function migrate(value: unknown): ValidationResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { ok: false, errors: ["The data is not an Orasan data object."] };
  }

  let data = value as Record<string, unknown>;
  const version = data.version;

  if (!Number.isSafeInteger(version) || (version as number) < 1) {
    return { ok: false, errors: ["The data has no valid version number."] };
  }
  if ((version as number) > DATA_VERSION) {
    return {
      ok: false,
      errors: [
        `The data is from a newer version of Orasan (data version ${version}). This app reads up to version ${DATA_VERSION}.`,
      ],
    };
  }

  for (let current = version as number; current < DATA_VERSION; current++) {
    const step = migrations[current];
    if (!step) return { ok: false, errors: [`No upgrade path from data version ${current}.`] };
    data = step(data);
  }

  return validateAppData(data);
}

export type { AppData };
