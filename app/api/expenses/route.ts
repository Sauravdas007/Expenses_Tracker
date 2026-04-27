import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createExpenseSchema } from "@/lib/validation";
import { toMinor } from "@/lib/money";
import { toDTO } from "@/lib/dto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/expenses
 *   ?category=Food
 *   ?sort=date_desc
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category")?.trim();
  const sort = searchParams.get("sort");

  const where = category ? { category } : {};

  // Default sort: newest first (by date, then createdAt as tiebreaker).
  const orderBy =
    sort === "date_desc" || !sort
      ? [{ date: "desc" as const }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }];

  const rows = await prisma.expense.findMany({ where, orderBy });
  return NextResponse.json({ items: rows.map(toDTO) });
}

/**
 * POST /api/expenses
 * Body: { amount, category, description, date }
 * Headers: Idempotency-Key (optional but recommended) — retries with the same
 * key return the original created record, so refresh/double-click is safe.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const parsed = createExpenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  let amountMinor: number;
  try {
    amountMinor = toMinor(parsed.data.amount);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 400 }
    );
  }

  const idemKey = req.headers.get("idempotency-key")?.trim() || null;

  // Idempotency fast-path: if a record exists for this key, return the stored expense.
  if (idemKey) {
    const existing = await prisma.idempotencyRecord.findUnique({
      where: { key: idemKey },
    });
    if (existing) {
      const exp = await prisma.expense.findUnique({
        where: { id: existing.expenseId },
      });
      if (exp) {
        return NextResponse.json(toDTO(exp), { status: 200 });
      }
    }
  }

  // Create + register idempotency atomically.
  try {
    const created = await prisma.$transaction(async (tx) => {
      const exp = await tx.expense.create({
        data: {
          amountMinor,
          currency: "INR",
          category: parsed.data.category.trim(),
          description: (parsed.data.description ?? "").trim(),
          date: parsed.data.date,
        },
      });
      if (idemKey) {
        await tx.idempotencyRecord.create({
          data: { key: idemKey, expenseId: exp.id },
        });
      }
      return exp;
    });
    return NextResponse.json(toDTO(created), { status: 201 });
  } catch (e: unknown) {
    // Race: another request with the same idem key just won; return its record.
    if (idemKey) {
      const existing = await prisma.idempotencyRecord.findUnique({
        where: { key: idemKey },
      });
      if (existing) {
        const exp = await prisma.expense.findUnique({
          where: { id: existing.expenseId },
        });
        if (exp) return NextResponse.json(toDTO(exp), { status: 200 });
      }
    }
    console.error("POST /api/expenses failed", e);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
