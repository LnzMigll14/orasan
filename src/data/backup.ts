import { migrate } from "./migrations";
import { DATA_VERSION, type AppData } from "./types";

// Export and import files. The file wraps the data with its version and export date.

export type BackupFile = {
  app: "orasan";
  version: number;
  exportedAt: string;
  data: AppData;
};

export function buildBackup(data: AppData): BackupFile {
  return { app: "orasan", version: DATA_VERSION, exportedAt: new Date().toISOString(), data };
}

export function backupFileName(date = new Date()) {
  return `orasan-backup-${date.toISOString().slice(0, 10)}.json`;
}

export function downloadJson(value: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before releasing the blob.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type ParsedBackup =
  | { ok: true; data: AppData; exportedAt: string | null }
  | { ok: false; errors: string[] };

const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Reads and validates an Orasan export. Older versions are migrated to the current shape. */
export async function parseBackupFile(file: File): Promise<ParsedBackup> {
  if (file.size > MAX_FILE_BYTES) return { ok: false, errors: ["The file is larger than 10 MB."] };

  let json: unknown;
  try {
    json = JSON.parse(await file.text());
  } catch {
    return { ok: false, errors: ["The file isn't valid JSON."] };
  }

  if (typeof json !== "object" || json === null || (json as { app?: unknown }).app !== "orasan") {
    return { ok: false, errors: ["This isn't an Orasan export file."] };
  }

  const backup = json as Partial<BackupFile>;
  // The data object carries its own version; the wrapper's version must agree.
  if (backup.data && typeof backup.data === "object" && backup.version !== (backup.data as AppData).version) {
    return { ok: false, errors: ["The file's version doesn't match its data."] };
  }

  const result = migrate(backup.data);
  if (!result.ok) return result;
  return {
    ok: true,
    data: result.data,
    exportedAt: typeof backup.exportedAt === "string" ? backup.exportedAt : null,
  };
}
