"use client";

import { useRef, useState } from "react";
import { ExpenseDTO, newIdempotencyKey, todayISO } from "./types";

type Props = {
  categoryOptions: string[];
  onCreated: (e: ExpenseDTO) => void;
};

export default function ExpenseForm({ categoryOptions, onCreated }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Idempotency key is generated once per form "attempt" and reused across
  // duplicate clicks or retries. It's regenerated after a successful submit.
  const idemKeyRef = useRef<string>(newIdempotencyKey());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return; // guard against rapid double-submits

    setError(null);

    // Client-side validation mirrors server validation for good UX.
    if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
      setError("Amount must be a positive number with up to 2 decimals.");
      return;
    }
    if (!category.trim()) {
      setError("Category is required.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Date is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idemKeyRef.current,
        },
        body: JSON.stringify({
          amount,
          category: category.trim(),
          description: description.trim(),
          date,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed (${res.status})`);
      }
      const created = (await res.json()) as ExpenseDTO;
      onCreated(created);

      // reset form & rotate idempotency key for next entry
      setAmount("");
      setDescription("");
      idemKeyRef.current = newIdempotencyKey();
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4"
      data-testid="expense-form"
      noValidate
    >
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-300">
          Amount (₹)
        </label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          data-testid="expense-amount-input"
          className="w-full rounded-lg border border-ink-700 bg-ink-950/60 px-4 py-3 font-mono text-lg text-ink-100 placeholder:text-ink-500 transition-colors focus:border-ember-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-300">
            Category
          </label>
          <input
            list="category-options"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            data-testid="expense-category-input"
            className="w-full rounded-lg border border-ink-700 bg-ink-950/60 px-4 py-3 text-ink-100 transition-colors focus:border-ember-500"
          />
          <datalist id="category-options">
            {categoryOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-300">
            Date
          </label>
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            required
            data-testid="expense-date-input"
            className="w-full rounded-lg border border-ink-700 bg-ink-950/60 px-4 py-3 text-ink-100 transition-colors focus:border-ember-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-300">
          Description
        </label>
        <input
          type="text"
          placeholder="e.g. Dinner with Rahul"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={280}
          data-testid="expense-description-input"
          className="w-full rounded-lg border border-ink-700 bg-ink-950/60 px-4 py-3 text-ink-100 placeholder:text-ink-500 transition-colors focus:border-ember-500"
        />
      </div>

      {error ? (
        <div
          role="alert"
          data-testid="expense-form-error"
          className="rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        data-testid="expense-submit-button"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-ember-500 px-5 py-3 font-semibold text-ink-950 transition-all hover:bg-ember-400 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Add expense"}
      </button>
    </form>
  );
}
