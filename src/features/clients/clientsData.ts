// These sample records store money as integer centavos or cents, including hourly rates.
export const clientsPageData = {
  projectCount: 6,
  clients: [
    {
      id: "reyes-studio",
      name: "Reyes Studio",
      initials: "RS",
      email: "billing@reyesstudio.example",
      currency: "PHP",
      hourlyRateMinor: 120_000,
      unbilledMinor: 3_892_500,
      outstandingMinor: 3_600_000,
    },
    {
      id: "kalye-coffee",
      name: "Kalye Coffee Co.",
      initials: "KC",
      email: "hello@kalyecoffee.example",
      currency: "PHP",
      hourlyRateMinor: 90_000,
      unbilledMinor: 315_000,
      outstandingMinor: 855_000,
    },
    {
      id: "northwind-remote",
      name: "Northwind Remote LLC",
      initials: "NR",
      email: "ap@northwind.example",
      currency: "USD",
      hourlyRateMinor: 1_200,
      unbilledMinor: 14_100,
      outstandingMinor: 0,
    },
  ],
} as const;
