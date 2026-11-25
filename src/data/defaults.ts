import { DATA_VERSION, type AppData, type PaymentMethod, type Profile, type Settings } from "./types";

export function defaultPaymentMethods(): PaymentMethod[] {
  return [
    {
      id: "gcash", label: "GCash", currency: "PHP", enabled: false,
      fields: [
        { label: "Account name", value: "" },
        { label: "Number", value: "", type: "tel" },
      ],
    },
    {
      id: "maya", label: "Maya", currency: "PHP", enabled: false,
      fields: [
        { label: "Account name", value: "" },
        { label: "Number", value: "", type: "tel" },
      ],
    },
    {
      id: "bank", label: "Bank transfer", currency: "PHP", enabled: false,
      fields: [
        { label: "Bank", value: "" },
        { label: "Account name", value: "" },
        { label: "Account no.", value: "" },
      ],
    },
    {
      id: "wise", label: "Wise", currency: "USD", enabled: false,
      fields: [{ label: "Email", value: "", type: "email" }],
    },
    {
      id: "paypal", label: "PayPal", currency: "USD", enabled: false,
      fields: [{ label: "Email", value: "", type: "email" }],
    },
    {
      id: "payoneer", label: "Payoneer", currency: "USD", enabled: false,
      fields: [{ label: "Email", value: "", type: "email" }],
    },
  ];
}

export function defaultSettings(): Settings {
  return {
    payments: defaultPaymentMethods(),
    invoice: { prefix: "INV-", nextNumber: 1, dueDays: 14 },
    roundingMinutes: 0,
    goalHours: 8,
  };
}

export function emptyProfile(): Profile {
  return { name: "", business: "", email: "", tin: "" };
}

export function createAppData(profile: Profile, settings: Settings = defaultSettings()): AppData {
  const now = new Date().toISOString();
  return {
    version: DATA_VERSION,
    profile,
    settings,
    clients: [],
    projects: [],
    entries: [],
    invoices: [],
    runningTimer: null,
    createdAt: now,
    updatedAt: now,
  };
}
