// Money helpers — we store money as integer minor units (paise) to avoid
// floating-point drift. User input is a decimal string like "123.45".

const MAX_SAFE_MAJOR = 10_000_000_000; // ₹10B hard upper bound

/** Parse a user-provided amount string/number into integer minor units. */
export function toMinor(input: string | number): number {
  if (input === null || input === undefined || input === "") {
    throw new Error("amount is required");
  }
  const s = String(input).trim();
  // allow up to 2 decimal places, positive only
  if (!/^\d+(\.\d{1,2})?$/.test(s)) {
    throw new Error("amount must be a positive number with up to 2 decimals");
  }
  const [intPart, fracRaw = ""] = s.split(".");
  const frac = (fracRaw + "00").slice(0, 2);
  const major = Number(intPart);
  if (major > MAX_SAFE_MAJOR) throw new Error("amount too large");
  const minor = major * 100 + Number(frac);
  if (minor <= 0) throw new Error("amount must be greater than 0");
  return minor;
}

/** Convert minor units back to a decimal string for JSON responses. */
export function toMajorString(minor: number): string {
  const sign = minor < 0 ? "-" : "";
  const abs = Math.abs(minor);
  const rupees = Math.floor(abs / 100);
  const paise = (abs % 100).toString().padStart(2, "0");
  return `${sign}${rupees}.${paise}`;
}

/** Format as INR for display (e.g. "₹1,234.50"). */
export function formatINR(minor: number): string {
  const major = minor / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major);
}
