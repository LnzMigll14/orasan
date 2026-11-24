type Invoice = {
  id: string;
  client: string;
  issued: string;
  due: string;
  amountMinor: number;
  currency: "PHP" | "USD";
} & (
  | { status: "draft" | "sent" | "overdue" }
  | { status: "paid"; payment: { date: string; method: string } }
);

// Prototype dates are calendar days. Amounts are stored in centavos or cents.
export const invoicesPageData = {
  referenceDate: "2026-11-18",
  invoices: [
    {
      id: "INV-0009",
      client: "Reyes Studio",
      issued: "2026-10-24",
      due: "2026-11-07",
      status: "overdue",
      amountMinor: 3_600_000,
      currency: "PHP",
    },
    {
      id: "INV-0012",
      client: "Northwind Remote LLC",
      issued: "2026-11-13",
      due: "2026-11-27",
      status: "draft",
      amountMinor: 6_900,
      currency: "USD",
    },
    {
      id: "INV-0011",
      client: "Kalye Coffee Co.",
      issued: "2026-11-10",
      due: "2026-11-24",
      status: "sent",
      amountMinor: 855_000,
      currency: "PHP",
    },
    {
      id: "INV-0010",
      client: "Northwind Remote LLC",
      issued: "2026-11-01",
      due: "2026-11-15",
      status: "paid",
      amountMinor: 48_000,
      currency: "USD",
      payment: { date: "2026-11-10", method: "Wise" },
    },
  ] as const satisfies readonly Invoice[],
} as const;
