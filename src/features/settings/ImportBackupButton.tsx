import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { parseBackupFile } from "../../data/backup";
import { getAppData, replaceAllData } from "../../data/store";
import type { AppData } from "../../data/types";
import { Modal, ModalBody, ModalFooter } from "../../shared/components/Modal";
import { toast } from "../../shared/components/Toast";
import { button } from "../../shared/ui";

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
});

function summary(data: AppData) {
  const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  return [
    count(data.clients.length, "client", "clients"),
    count(data.projects.length, "project", "projects"),
    count(data.entries.length, "time entry", "time entries"),
    count(data.invoices.length, "invoice", "invoices"),
  ].join(", ");
}

type Pending = { data: AppData; exportedAt: string | null; fileName: string };

/**
 * Picks an Orasan JSON export, validates it, and asks before replacing existing data.
 * With no existing data (onboarding) it restores straight away.
 */
export function ImportBackupButton({ className = button.secondary, label = "Import JSON" }: { className?: string; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ fileName: string; list: string[] } | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const current = getAppData();

  function restore(data: AppData) {
    if (replaceAllData(data)) toast("Data imported");
    else toast("Couldn't save the imported data in this browser", "error");
  }

  async function handleFile(file: File) {
    setBusy(true);
    const result = await parseBackupFile(file);
    setBusy(false);

    if (!result.ok) {
      setErrors({ fileName: file.name, list: result.errors });
      return;
    }
    if (!current) {
      restore(result.data);
      return;
    }
    setPending({ data: result.data, exportedAt: result.exportedAt, fileName: file.name });
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          // Reset so picking the same file again still fires a change.
          event.currentTarget.value = "";
          if (file) void handleFile(file);
        }}
      />
      <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className={className}>
        <Upload aria-hidden="true" size={16} />
        {busy ? "Reading file…" : label}
      </button>

      <Modal
        open={errors !== null}
        onClose={() => setErrors(null)}
        title="Can't import this file"
        description={errors ? `${errors.fileName} wasn't imported. Your current data hasn't changed.` : undefined}
      >
        <ModalBody>
          <ul className="list-disc space-y-1 pl-5 text-body text-overdue">
            {errors?.list.slice(0, 8).map((error) => <li key={error}>{error}</li>)}
          </ul>
          {errors && errors.list.length > 8 && (
            <p className="text-label text-text-muted">…and {errors.list.length - 8} more problems.</p>
          )}
        </ModalBody>
        <ModalFooter>
          <button type="button" onClick={() => setErrors(null)} className={button.primary}>
            OK
          </button>
        </ModalFooter>
      </Modal>

      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Replace your data?"
        description="Importing replaces everything in Orasan on this browser. This can't be undone, so export your current data first if you might need it."
      >
        {pending && current && (
          <ModalBody>
            <dl className="grid gap-3 text-body">
              <div>
                <dt className="text-label text-text-muted">Current data</dt>
                <dd>{summary(current)}</dd>
              </div>
              <div>
                <dt className="text-label text-text-muted">
                  From {pending.fileName}
                  {pending.exportedAt && `, exported ${dateTimeFormat.format(new Date(pending.exportedAt))}`}
                </dt>
                <dd>{summary(pending.data)}</dd>
              </div>
            </dl>
          </ModalBody>
        )}
        <ModalFooter>
          <button type="button" onClick={() => setPending(null)} className={button.secondary}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (pending) restore(pending.data);
              setPending(null);
            }}
            className={button.danger}
          >
            Replace my data
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
