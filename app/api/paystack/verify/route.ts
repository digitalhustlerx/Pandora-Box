import { db } from "@/db/drizzle";
import { paystackSubscription } from "@/db/schema";
import { auth } from "@/lib/auth";
import { paystackVerify } from "@/lib/paystack";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export async function POST(req: Request) {
  if (!db) {
    return NextResponse.json(
      { error: "Database is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  type SessionResult = {
    session?: { userId?: string };
    user?: { email?: string };
  };

  const result = (await auth.api.getSession({
    headers: await headers(),
  })) as unknown as SessionResult;
  const userId = result?.session?.userId;
  const email = result?.user?.email;
  if (!userId || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const verified = await paystackVerify(reference);
  if (!verified.status || !verified.data) {
    return NextResponse.json(
      { error: verified.message || "Verification failed" },
      { status: 502 },
    );
  }

  if (verified.data.status !== "success") {
    return NextResponse.json(
      { error: "Payment not successful" },
      { status: 400 },
    );
  }

  const paidAt = verified.data.paid_at ? new Date(verified.data.paid_at) : new Date();
  const expiresAt = addDays(paidAt, 30);

  const record = {
    id: verified.data.reference,
    paidAt,
    expiresAt,
    amount: verified.data.amount,
    currency: verified.data.currency,
    status: "active",
    customerEmail: verified.data.customer?.email || email,
    productId: "paystack:starter",
    metadata: verified.data.metadata ? JSON.stringify(verified.data.metadata) : null,
    userId,
  };

  await db
    .insert(paystackSubscription)
    .values(record)
    .onConflictDoUpdate({
      target: paystackSubscription.id,
      set: {
        paidAt: record.paidAt,
        expiresAt: record.expiresAt,
        amount: record.amount,
        currency: record.currency,
        status: record.status,
        customerEmail: record.customerEmail,
        productId: record.productId,
        metadata: record.metadata,
        userId: record.userId,
      },
    });

  const rows = await db
    .select()
    .from(paystackSubscription)
    .where(eq(paystackSubscription.id, record.id));

  return NextResponse.json({ ok: true, subscription: rows[0] });
}
