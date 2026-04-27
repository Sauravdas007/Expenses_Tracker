"use client";

import { formatINR } from "./types";

export default function SummaryBar({
  totalMinor,
  count,
}: {
  totalMinor: number;
  count: number;
}) {
  return (
    <div
      className="flex items-baseline gap-3 rounded-lg border border-ember-500/20 bg-ember-500/5 px-4 py-2"
      data-testid="summary-bar"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-ember-400">
        Total
      </span>
      <span
        className="font-mono text-lg font-semibold text-ink-100"
        data-testid="summary-total-amount"
      >
        {formatINR(totalMinor)}
      </span>
      <span
        className="text-xs text-ink-400"
        data-testid="summary-count"
      >
        · {count} {count === 1 ? "item" : "items"}
      </span>
    </div>
  );
}
