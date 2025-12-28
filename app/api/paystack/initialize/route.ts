import { auth } from "@/lib/auth";
import { getPreferredBillingProvider } from "@/lib/billing";
import { paystackInitialize } from "@/lib/paystack";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  if (getPreferredBillingProvider() !== "paystack") {
    return NextResponse.json(
      { error: "Paystack is not enabled" },
      { status: 400 },
    );
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

  const amount = Number(process.env.PAYSTACK_STARTER_AMOUNT_KOBO ?? "0");
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Paystack amount is not configured" },
      { status: 500 },
    );
  }

  const callbackUrl =
    process.env.PAYSTACK_CALLBACK_URL ||
    (process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/success`
      : undefined);

  const init = await paystackInitialize({
    email,
    amount,
    callbackUrl,
    metadata: {
      userId,
      productId: "paystack:starter",
    },
  });

  if (!init.status || !init.data?.authorization_url) {
    return NextResponse.json(
      { error: init.message || "Failed to initialize Paystack payment" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    authorizationUrl: init.data.authorization_url,
    reference: init.data.reference,
  });
}
