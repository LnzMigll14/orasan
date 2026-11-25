import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { button } from "../ui";
import "./Modal.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  /** "drawer" slides in from the right on wider screens; both are bottom sheets on phones. */
  variant?: "center" | "drawer";
  children: ReactNode;
};

/**
 * A native <dialog> shown with showModal(), so focus is trapped, Escape closes it and the
 * rest of the page is inert. Content only mounts while open, so forms start fresh each time.
 */
export function Modal({ open, onClose, title, description, variant = "center", children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      data-variant={variant}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) onClose();
      }}
      className="app-modal text-text"
    >
      {open && (
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-start justify-between gap-3 border-b border-border px-5 pt-5 pb-4 md:px-6">
            <div className="min-w-0">
              <h2 id={titleId} className="text-headline">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1 text-body text-text-secondary">
                  {description}
                </p>
              )}
            </div>
            <button type="button" aria-label="Close" onClick={onClose} className={`${button.icon} -mt-2 -mr-2`}>
              <X aria-hidden="true" size={18} />
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}

/** A form that fills the modal so its body scrolls and its footer stays put. */
export function ModalForm({ onSubmit, children }: { onSubmit: () => void; children: ReactNode }) {
  return (
    <form
      noValidate
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  );
}

/** Scrollable body + sticky footer for a form inside a Modal. */
export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto px-5 py-5 md:px-6">{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4 md:px-6">
      {children}
    </footer>
  );
}

type ConfirmProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({ open, title, description, confirmLabel, tone = "danger", onConfirm, onClose }: ConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <ModalFooter>
        <button type="button" onClick={onClose} className={button.secondary}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={tone === "danger" ? button.danger : button.primary}
        >
          {confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}
