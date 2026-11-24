// Invoice dates represent calendar days. UTC keeps them stable across viewer time zones.
const invoiceDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatInvoiceDate(date: string) {
  return invoiceDateFormat.format(new Date(`${date}T00:00:00Z`));
}
