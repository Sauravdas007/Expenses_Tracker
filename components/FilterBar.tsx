"use client";

type SortKey = "date_desc" | "created_desc";

type Props = {
  category: string;
  setCategory: (v: string) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  categoryOptions: string[];
};

export default function FilterBar({
  category,
  setCategory,
  sort,
  setSort,
  categoryOptions,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3" data-testid="filter-bar">
      <div className="flex items-center gap-2">
        <label
          htmlFor="filter-category"
          className="text-xs font-semibold uppercase tracking-wider text-ink-400"
        >
          Category
        </label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          data-testid="filter-category-select"
          className="rounded-lg border border-ink-700 bg-ink-950/60 px-3 py-2 text-sm text-ink-100 transition-colors focus:border-ember-500"
        >
          <option value="">All</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="filter-sort"
          className="text-xs font-semibold uppercase tracking-wider text-ink-400"
        >
          Sort
        </label>
        <select
          id="filter-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          data-testid="filter-sort-select"
          className="rounded-lg border border-ink-700 bg-ink-950/60 px-3 py-2 text-sm text-ink-100 transition-colors focus:border-ember-500"
        >
          <option value="date_desc">Date (newest first)</option>
          <option value="created_desc">Recently added</option>
        </select>
      </div>

      {category ? (
        <button
          type="button"
          onClick={() => setCategory("")}
          data-testid="filter-clear-button"
          className="ml-auto text-xs font-semibold text-ember-400 underline-offset-4 hover:underline"
        >
          clear filter
        </button>
      ) : null}
    </div>
  );
}
