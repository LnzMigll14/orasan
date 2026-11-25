import { useState } from "react";
import { addProject, deleteProject, updateProject } from "../../data/store";
import type { Client, Project } from "../../data/types";
import { Field } from "../../shared/components/form";
import { Modal, ModalBody, ModalFooter, ModalForm } from "../../shared/components/Modal";
import { toast } from "../../shared/components/Toast";
import { currencySymbols, formatMoney, parseMoneyInput, toMoneyInput } from "../../shared/formatMoney";
import { button } from "../../shared/ui";

type Props = { open: boolean; client: Client; project: Project | null; onClose: () => void };

/** Add, rename, re-rate or delete one of a client's projects. */
export function ProjectDialog({ open, client, project, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={project ? "Edit project" : "Add project"} description={client.name}>
      <ProjectForm client={client} project={project} onClose={onClose} />
    </Modal>
  );
}

function ProjectForm({ client, project, onClose }: { client: Client; project: Project | null; onClose: () => void }) {
  const [name, setName] = useState(project?.name ?? "");
  const [ownRate, setOwnRate] = useState(project?.rateMinor != null);
  const [rate, setRate] = useState(project?.rateMinor != null ? toMoneyInput(project.rateMinor) : "");
  const [errors, setErrors] = useState<{ name?: string; rate?: string; form?: string }>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  function submit() {
    const found: typeof errors = {};
    if (!name.trim()) found.name = "Name the project.";
    const rateMinor = ownRate ? parseMoneyInput(rate) : null;
    if (ownRate && !rateMinor) found.rate = "Enter an hourly rate more than zero.";
    setErrors(found);
    if (Object.keys(found).length) return;

    if (project) {
      updateProject(project.id, { name: name.trim(), rateMinor });
      toast("Project updated");
    } else {
      addProject(client.id, name, rateMinor);
      toast("Project added");
    }
    onClose();
  }

  return (
    <ModalForm onSubmit={submit}>
      <ModalBody>
        <Field label="Project name" value={name} error={errors.name} maxLength={120} autoFocus onChange={(event) => setName(event.target.value)} />
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-label font-bold">Hourly rate</legend>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body md:min-h-10">
            <input type="radio" name="rate-mode" checked={!ownRate} onChange={() => setOwnRate(false)} className="size-4 accent-amber" />
            Client rate ({formatMoney(client.rateMinor, client.currency)}/h)
          </label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body md:min-h-10">
            <input type="radio" name="rate-mode" checked={ownRate} onChange={() => setOwnRate(true)} className="size-4 accent-amber" />
            Own rate for this project
          </label>
        </fieldset>
        {ownRate && (
          <Field
            label="Project rate"
            prefix={currencySymbols[client.currency]}
            inputMode="decimal"
            placeholder="0.00"
            value={rate}
            error={errors.rate}
            help="Changing a rate doesn't change invoices you've already made."
            onChange={(event) => setRate(event.target.value)}
          />
        )}
        {errors.form && (
          <p role="alert" className="text-body text-overdue">
            {errors.form}
          </p>
        )}
        {confirmDelete && project && (
          <div role="alert" className="grid gap-3 rounded-md border border-overdue-tint bg-overdue-tint p-4">
            <p className="text-body">Delete {project.name} and its unbilled time entries? This can't be undone.</p>
            <div className="flex gap-2">
              <button type="button" className={button.secondary} onClick={() => setConfirmDelete(false)}>
                Keep it
              </button>
              <button
                type="button"
                className={button.danger}
                onClick={() => {
                  const result = deleteProject(project.id);
                  if (!result.ok) {
                    setConfirmDelete(false);
                    return setErrors({ form: result.error });
                  }
                  toast("Project deleted");
                  onClose();
                }}
              >
                Delete project
              </button>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {project && !confirmDelete && (
          <button type="button" onClick={() => setConfirmDelete(true)} className={`${button.ghost} mr-auto text-overdue hover-fine:text-overdue`}>
            Delete
          </button>
        )}
        <button type="button" onClick={onClose} className={button.secondary}>
          Cancel
        </button>
        <button type="submit" className={button.primary}>
          Save project
        </button>
      </ModalFooter>
    </ModalForm>
  );
}
