import { db } from "@/db/drizzle";
import { paystackSubscription } from "@/db/schema";
import { paystackVerify, verifyPaystackSignature } from "@/lib/paystack";
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

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event?: string;
    data?: { reference?: string; metadata?: { userId?: string } };
  };

  const reference = event?.data?.reference;
  const userId = event?.data?.metadata?.userId;
  if (!reference || !userId) {
    return NextResponse.json({ ok: true });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ ok: true });
  }

  const verified = await paystackVerify(reference);
  if (!verified.status || !verified.data || verified.data.status !== "success") {
    return NextResponse.json({ ok: true });
  }

  const paidAt = verified.data.paid_at ? new Date(verified.data.paid_at) : new Date();
  const expiresAt = addDays(paidAt, 30);

  await db.insert(paystackSubscription).values({
    id: verified.data.reference,
    paidAt,
    expiresAt,
    amount: verified.data.amount,
    currency: verified.data.currency,
    status: "active",
    customerEmail: verified.data.customer?.email || "unknown",
    productId: "paystack:starter",
    metadata: verified.data.metadata ? JSON.stringify(verified.data.metadata) : null,
    userId,
  }).onConflictDoUpdate({
    target: paystackSubscription.id,
    set: {
      paidAt,
      expiresAt,
      amount: verified.data.amount,
      currency: verified.data.currency,
      status: "active",
      customerEmail: verified.data.customer?.email || "unknown",
      productId: "paystack:starter",
      metadata: verified.data.metadata ? JSON.stringify(verified.data.metadata) : null,
      userId,
    },
  });

  return NextResponse.json({ ok: true });
}

