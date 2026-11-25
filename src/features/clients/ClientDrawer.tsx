import { useState } from "react";
import { useNavigate } from "react-router";
import { addClient, updateClient, useAppData } from "../../data/store";
import type { Client } from "../../data/types";
import { Modal, ModalBody, ModalFooter, ModalForm } from "../../shared/components/Modal";
import { toast } from "../../shared/components/Toast";
import { toMoneyInput } from "../../shared/formatMoney";
import { button } from "../../shared/ui";
import { ClientFormFields, emptyClientForm, validateClientForm, type ClientFormErrors } from "./clientForm";

type Props = { open: boolean; client: Client | null; onClose: () => void };

/** Add a client (with a first project) or edit one. */
export function ClientDrawer({ open, client, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={client ? "Edit client" : "Add client"} variant="drawer">
      <ClientDrawerForm client={client} onClose={onClose} />
    </Modal>
  );
}

function ClientDrawerForm({ client, onClose }: { client: Client | null; onClose: () => void }) {
  const data = useAppData();
  const navigate = useNavigate();
  const [values, setValues] = useState(() =>
    client
      ? { ...emptyClientForm, name: client.name, contact: client.contact, email: client.email, currency: client.currency, rate: toMoneyInput(client.rateMinor) }
      : emptyClientForm,
  );
  const [errors, setErrors] = useState<ClientFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const hasInvoices = client ? data.invoices.some((invoice) => invoice.clientId === client.id) : false;

  function submit() {
    const { errors: found, rateMinor } = validateClientForm(values, { requireProject: !client });
    setErrors(found);
    if (Object.keys(found).length) return;

    if (client) {
      const result = updateClient(client.id, {
        name: values.name.trim(),
        contact: values.contact.trim(),
        email: values.email.trim(),
        currency: values.currency,
        rateMinor,
      });
      if (!result.ok) return setFormError(result.error);
      toast("Client updated");
      onClose();
    } else {
      const id = addClient({ ...values, rateMinor });
      toast(`${values.name.trim()} added`);
      onClose();
      navigate(`/clients/${id}`);
    }
  }

  return (
    <ModalForm onSubmit={submit}>
      <ModalBody>
        <ClientFormFields values={values} errors={errors} onChange={setValues} showProject={!client} currencyLocked={hasInvoices} />
        {formError && (
          <p role="alert" className="text-body text-overdue">
            {formError}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <button type="button" onClick={onClose} className={button.secondary}>
          Cancel
        </button>
        <button type="submit" className={button.primary}>
          Save client
        </button>
      </ModalFooter>
    </ModalForm>
  );
}
