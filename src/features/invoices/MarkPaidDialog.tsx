import { useState } from "react";
import { markInvoicePaid, useAppData } from "../../data/store";
import type { Invoice } from "../../data/types";
import { Field, SelectField } from "../../shared/components/form";
import { Modal, ModalBody, ModalFooter, ModalForm } from "../../shared/components/Modal";
import { toast } from "../../shared/components/Toast";
import { formatInvoiceDate } from "../../shared/FormatInvoiceDate";
import { formatMoney } from "../../shared/formatMoney";
import { todayKey } from "../../shared/time";
import { button } from "../../shared/ui";

type Props = { open: boolean; invoice: Invoice; onClose: () => void };

/** Records a payment by hand. Orasan never moves money. */
export function MarkPaidDialog({ open, invoice, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Mark ${invoice.number} as paid`}
      description={`${invoice.billedTo.name} · ${formatMoney(invoice.totalMinor, invoice.currency)} · due ${formatInvoiceDate(invoice.dueOn)}`}
    >
      <MarkPaidForm invoice={invoice} onClose={onClose} />
    </Modal>
  );
}

function MarkPaidForm({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const data = useAppData();
  const methods = data.settings.payments.filter((method) => method.enabled && method.currency === invoice.currency);
  const options = [
    ...methods.map((method) => ({
      id: method.id,
      label: method.label,
      detail: method.fields.map((field) => field.value).filter(Boolean).at(-1),
    })),
    { id: "cash", label: "Cash", detail: undefined },
    { id: "other", label: "Other", detail: undefined },
  ];
  const [methodId, setMethodId] = useState(options[0]!.id);
  const [reference, setReference] = useState("");
  const [receivedOn, setReceivedOn] = useState(todayKey());
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const today = todayKey();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(receivedOn)) return setError("Enter the date you received the payment.");
    if (receivedOn > today) return setError("The payment date can't be in the future.");
    const method = options.find((option) => option.id === methodId)!;
    markInvoicePaid(invoice.id, {
      methodId: method.id,
      methodLabel: method.label,
      reference: reference.trim(),
      receivedOn,
    });
    toast(`Bayad na! ${invoice.number} is paid.`);
    onClose();
  }

  return (
    <ModalForm onSubmit={submit}>
      <ModalBody>
        <SelectField label="Payment method" value={methodId} onChange={(event) => setMethodId(event.target.value)}>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.detail ? `${option.label} — ${option.detail}` : option.label}
            </option>
          ))}
        </SelectField>
        <Field
          label="Reference number"
          value={reference}
          maxLength={80}
          autoComplete="off"
          help="Optional. From the GCash, bank or Wise receipt."
          onChange={(event) => setReference(event.target.value)}
        />
        <Field
          label="Date received"
          type="date"
          value={receivedOn}
          max={todayKey()}
          error={error}
          onChange={(event) => setReceivedOn(event.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <button type="button" onClick={onClose} className={button.secondary}>
          Cancel
        </button>
        <button type="submit" className={button.primary}>
          Mark as paid
        </button>
      </ModalFooter>
    </ModalForm>
  );
}
