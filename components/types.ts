export type ExpenseDTO = {
  id: string;
  amount: string;
  amountMinor: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  createdAt: string;
};

/** Browser-side total of currently visible expenses, in minor units. */
export function totalMinor(items: ExpenseDTO[]): number {
  return items.reduce((sum, e) => sum + e.amountMinor, 0);
}

export function formatINR(minor: number): string {
  const major = minor / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(major);
}

export function todayISO(): string {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

/** Crypto-strong idempotency key, falls back to Math.random if unavailable. */
export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "k_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
