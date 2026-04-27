import ExpenseTracker from "@/components/ExpenseTracker";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12 md:py-16">
      <header className="mb-10 flex items-end justify-between gap-4 md:mb-14">
        <div>
          <p
            className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-ember-500"
            data-testid="app-tagline"
          >
            paisa · v1
          </p>
          <h1
            className="font-semibold leading-[0.95] tracking-tight text-ink-100"
            style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)" }}
            data-testid="app-title"
          >
            where your
            <br />
            <span className="text-ember-500">money</span> goes.
          </h1>
        </div>
        <div className="hidden shrink-0 text-right text-xs text-ink-400 md:block">
          <div className="font-mono">INR · ₹</div>
          <div className="mt-1">record · filter · understand</div>
        </div>
      </header>

      <ExpenseTracker />

      <footer className="mt-16 border-t border-ink-800 pt-6 text-xs text-ink-400">
        <p>
          Built with Next.js · Prisma · SQLite. Money stored as integer paise to
          avoid float drift. POST is idempotent via <code className="font-mono text-ember-400">Idempotency-Key</code>.
        </p>
      </footer>
    </main>
  );
}
