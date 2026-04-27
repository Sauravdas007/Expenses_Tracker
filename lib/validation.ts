import { z } from "zod";

// Category is a free-form string but we trim + cap length to avoid garbage data.
const categorySchema = z
  .string()
  .trim()
  .min(1, "category is required")
  .max(40, "category too long");

const descriptionSchema = z
  .string()
  .trim()
  .max(280, "description too long")
  .default("");

// Accept ISO date (YYYY-MM-DD) — simple and unambiguous.
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

// Amount arrives as a decimal string ("123.45") or number — validated by toMinor.
const amountSchema = z.union([z.string(), z.number()]);

export const createExpenseSchema = z.object({
  amount: amountSchema,
  category: categorySchema,
  description: descriptionSchema.optional().default(""),
  date: dateSchema,
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
