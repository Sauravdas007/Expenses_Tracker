"use client";

import { ExpenseDTO, formatINR } from "./types";

type Props = {
  items: ExpenseDTO[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export default function ExpenseList({ items, loading, error, onRetry }: Props) {
  if (loading) {
    return (
      <div
        data-testid="expenses-loading"
        className="flex items-center gap-3 rounded-lg border border-ink-800 bg-ink-900/50 px-4 py-6 text-sm text-ink-300"
      >
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ember-500" />
        Loading expenses…
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        data-testid="expenses-error"
        className="flex items-center justify-between gap-3 rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-4 text-sm text-red-300"
      >
        <span>Couldn&apos;t load expenses: {error}</span>
        <button
          onClick={onRetry}
          data-testid="expenses-retry-button"
          className="rounded-md border border-red-500/50 px-3 py-1 font-medium text-red-200 hover:bg-red-900/40"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        data-testid="expenses-empty"
        className="rounded-lg border border-dashed border-ink-700 bg-ink-900/40 px-6 py-10 text-center text-sm text-ink-400"
      >
        <p className="mb-1 text-base font-semibold text-ink-200">
          No expenses yet
        </p>
        <p>Add your first entry using the form.</p>
      </div>
    );
  }

  return (
    <ul
      data-testid="expenses-list"
      className="divide-y divide-ink-800 overflow-hidden rounded-lg border border-ink-800 bg-ink-900/40"
    >
      {items.map((e) => (
        <li
          key={e.id}
          data-testid="expense-row"
          data-category={e.category}
          className="group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-ink-800/40 sm:px-5"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full border border-ember-500/30 bg-ember-500/10 px-2.5 py-0.5 text-xs font-medium text-ember-400"
                data-testid="expense-row-category"
              >
                {e.category}
              </span>
              <span
                className="font-mono text-xs text-ink-400"
                data-testid="expense-row-date"
              >
                {e.date}
              </span>
            </div>
            <p
              className="mt-2 break-words text-sm text-ink-200"
              data-testid="expense-row-description"
            >
              {e.description || (
                <span className="italic text-ink-500">no description</span>
              )}
            </p>
          </div>
          <div
            className="shrink-0 text-right font-mono text-base font-semibold text-ink-100 sm:text-lg"
            data-testid="expense-row-amount"
          >
            {formatINR(e.amountMinor)}
          </div>
        </li>
      ))}
    </ul>
  );
}
