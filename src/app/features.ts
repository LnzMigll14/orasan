// Switches for what the current storage can support. Data lives in the browser for now,
// so nothing a client opens on their own device can read it. Turn these on with the backend.
export const features = {
  /** Client-facing invoice links (/i/:id) that open on the client's device. */
  publicInvoiceLinks: false,
} as const;
