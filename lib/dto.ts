import type { Expense } from "@prisma/client";
import { toMajorString } from "./money";

export type ExpenseDTO = {
  id: string;
  amount: string; // decimal string, e.g. "123.45"
  amountMinor: number; // integer minor units
  currency: string;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO timestamp
};

export function toDTO(e: Expense): ExpenseDTO {
  return {
    id: e.id,
    amount: toMajorString(e.amountMinor),
    amountMinor: e.amountMinor,
    currency: e.currency,
    category: e.category,
    description: e.description,
    date: e.date,
    createdAt: e.createdAt.toISOString(),
  };
}
