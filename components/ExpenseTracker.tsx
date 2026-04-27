"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import FilterBar from "./FilterBar";
import SummaryBar from "./SummaryBar";
import { type ExpenseDTO, totalMinor } from "./types";

type SortKey = "date_desc" | "created_desc";

export default function ExpenseTracker() {
  const [items, setItems] = useState<ExpenseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("date_desc");

  const fetchExpenses = useCallback(async () => {
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      params.set("sort", sort);
      const res = await fetch(`/api/expenses?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`request failed (${res.status})`);
      const data = (await res.json()) as { items: ExpenseDTO[] };
      setItems(data.items);
    } catch (e) {
      setError((e as Error).message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Unique category list derived from current data + a sensible default set.
  const categoryOptions = useMemo(() => {
    const defaults = [
      "Food",
      "Travel",
      "Rent",
      "Utilities",
      "Shopping",
      "Health",
      "Entertainment",
      "Other",
    ];
    const fromData = Array.from(new Set(items.map((i) => i.category)));
    return Array.from(new Set([...defaults, ...fromData])).sort();
  }, [items]);

  const total = totalMinor(items);

  const handleCreated = (created: ExpenseDTO) => {
    // Optimistically prepend if it matches current filter; else refetch.
    setItems((prev) => {
      if (category && created.category !== category) return prev;
      // avoid dup if idempotent response returned an existing id
      if (prev.some((p) => p.id === created.id)) return prev;
      const next = [created, ...prev];
      if (sort === "date_desc") {
        next.sort((a, b) => {
          if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt);
          return b.date.localeCompare(a.date);
        });
      }
      return next;
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.25fr] md:gap-10">
      <section
        className="animate-fade-up rounded-2xl border border-ink-800 bg-ink-900/60 p-6 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] backdrop-blur-sm sm:p-8"
        style={{ animationDelay: "60ms" }}
        aria-label="Add new expense"
      >
        <h2 className="mb-1 text-lg font-semibold text-ink-100">
          Add an expense
        </h2>
        <p className="mb-6 text-sm text-ink-400">
          Small honest numbers. They add up.
        </p>
        <ExpenseForm
          categoryOptions={categoryOptions}
          onCreated={handleCreated}
        />
      </section>

      <section
        className="animate-fade-up rounded-2xl border border-ink-800 bg-ink-900/40 p-6 backdrop-blur-sm sm:p-8"
        style={{ animationDelay: "140ms" }}
        aria-label="Expenses list"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink-100">Your expenses</h2>
          <SummaryBar totalMinor={total} count={items.length} />
        </div>
        <FilterBar
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          categoryOptions={categoryOptions}
        />
        <div className="mt-6">
          <ExpenseList items={items} loading={loading} error={error} onRetry={fetchExpenses} />
        </div>
      </section>
    </div>
  );
}
