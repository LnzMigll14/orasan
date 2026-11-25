import type { Currency } from "../data/types";

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

export const currencySymbols: Record<Currency, string> = { PHP: "₱", USD: "$" };
export const currencyNames: Record<Currency, string> = { PHP: "PHP — Philippine peso", USD: "USD — US dollar" };

/** Convert centavos or cents to display units. Dashboard amounts use narrow currency symbols. */
export function formatMoney(amountMinor: number, currency: Currency, display: CurrencyDisplay = "standard") {
  return currencyFormats[display][currency].format(amountMinor / 100);
}

/** "1,200.50" → 120050. Returns null when the text isn't a valid amount with up to 2 decimals. */
export function parseMoneyInput(text: string) {
  const cleaned = text.replace(/[,\s₱$]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const [whole = "0", fraction = ""] = cleaned.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(minor) ? minor : null;
}

/** 120050 → "1200.50" for prefilling an input. */
export function toMoneyInput(amountMinor: number) {
  return (amountMinor / 100).toFixed(2);
}
