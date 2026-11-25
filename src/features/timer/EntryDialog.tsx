import { useId, useState } from "react";
import { addEntry, deleteEntry, updateEntry, useAppData } from "../../data/store";
import type { TimeEntry } from "../../data/types";
import { Field } from "../../shared/components/form";
import { Modal, ModalBody, ModalFooter, ModalForm } from "../../shared/components/Modal";
import { ProjectPicker, defaultProjectId } from "../../shared/components/ProjectPicker";
import { toast } from "../../shared/components/Toast";
import { dateKey, formatDuration, manilaToIso, timeKey, todayKey } from "../../shared/time";
import { button } from "../../shared/ui";

type Props = {
  open: boolean;
  /** null adds a new entry. */
  entry: TimeEntry | null;
  onClose: () => void;
};

/** Add a time entry by hand, or edit or delete an unbilled one. */
export function EntryDialog({ open, entry, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={entry ? "Edit time entry" : "Add time entry"} description="Times are in Manila time.">
      <EntryForm entry={entry} onClose={onClose} />
    </Modal>
  );
}

function EntryForm({ entry, onClose }: { entry: TimeEntry | null; onClose: () => void }) {
  const data = useAppData();
  const projectFieldId = useId();
  const [values, setValues] = useState(() => ({
    description: entry?.description ?? "",
    projectId: entry?.projectId ?? defaultProjectId(data),
    day: entry ? dateKey(entry.startedAt) : todayKey(),
    start: entry ? timeKey(entry.startedAt) : "09:00",
    end: entry ? timeKey(entry.endedAt) : "10:00",
  }));
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const startedAt = manilaToIso(values.day, values.start);
  let endedAt = manilaToIso(values.day, values.end);
  // An end time earlier than the start means the entry ran past midnight.
  if (startedAt && endedAt && endedAt <= startedAt) {
    endedAt = new Date(Date.parse(endedAt) + 86_400_000).toISOString();
  }
  const seconds = startedAt && endedAt ? (Date.parse(endedAt) - Date.parse(startedAt)) / 1000 : 0;

  function submit() {
    if (!values.projectId) return setError("Pick a project.");
    if (!startedAt || !endedAt) return setError("Enter a valid date, start time and end time.");
    if (seconds < 60) return setError("An entry must be at least one minute long.");
    if (Date.parse(startedAt) > Date.now()) return setError("The entry can't start in the future.");

    const input = { projectId: values.projectId, description: values.description, startedAt, endedAt };
    if (entry) {
      const result = updateEntry(entry.id, input);
      if (!result.ok) return setError(result.error);
      toast("Entry updated");
    } else {
      addEntry(input);
      toast("Entry added");
    }
    onClose();
  }

  const set = (key: keyof typeof values) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  return (
    <ModalForm onSubmit={submit}>
      <ModalBody>
        <Field label="Description" value={values.description} placeholder="What did you work on?" maxLength={200} onChange={set("description")} />
        <div className="grid gap-2">
          <label htmlFor={projectFieldId} className="text-label font-bold">
            Project
          </label>
          <ProjectPicker id={projectFieldId} data={data} shape="field" value={values.projectId} onChange={set("projectId")} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Date" type="date" value={values.day} max={todayKey()} onChange={set("day")} />
          <Field label="Start" type="time" value={values.start} onChange={set("start")} />
          <Field
            label="End"
            type="time"
            value={values.end}
            help={seconds >= 60 ? `${formatDuration(seconds)} h${endedAt && dateKey(endedAt) !== values.day ? ", ends the next day" : ""}` : undefined}
            onChange={set("end")}
          />
        </div>
        {error && (
          <p role="alert" className="text-body text-overdue">
            {error}
          </p>
        )}
        {confirmDelete && entry && (
          <div role="alert" className="grid gap-3 rounded-md border border-overdue-tint bg-overdue-tint p-4">
            <p className="text-body">Delete this entry? This can't be undone.</p>
            <div className="flex gap-2">
              <button type="button" className={button.secondary} onClick={() => setConfirmDelete(false)}>
                Keep it
              </button>
              <button
                type="button"
                className={button.danger}
                onClick={() => {
                  const result = deleteEntry(entry.id);
                  if (!result.ok) return setError(result.error);
                  toast("Entry deleted");
                  onClose();
                }}
              >
                Delete entry
              </button>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {entry && !confirmDelete && (
          <button type="button" onClick={() => setConfirmDelete(true)} className={`${button.ghost} mr-auto text-overdue hover-fine:text-overdue`}>
            Delete
          </button>
        )}
        <button type="button" onClick={onClose} className={button.secondary}>
          Cancel
        </button>
        <button type="submit" className={button.primary}>
          {entry ? "Save entry" : "Add entry"}
        </button>
      </ModalFooter>
    </ModalForm>
  );
}
