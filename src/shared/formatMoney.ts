type Currency = "PHP" | "USD";
type CurrencyDisplay = "standard" | "narrow";

const currencyFormats = {
  standard: {
    PHP: new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }),
    USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  },
  narrow: {
    PHP: new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      currencyDisplay: "narrowSymbol",
    }),
    USD: new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
    }),
  },
};

/** Convert centavos or cents to display units. Dashboard amounts use narrow currency symbols. */
export function formatMoney(
  amountMinor: number,
  currency: Currency,
  display: CurrencyDisplay = "standard",
) {
  return currencyFormats[display][currency].format(amountMinor / 100);
}
