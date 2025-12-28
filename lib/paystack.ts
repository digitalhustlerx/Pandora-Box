import crypto from "crypto";

export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string;
    customer?: { email?: string };
    metadata?: unknown;
  };
};

export function getPaystackSecretKey(): string | null {
  return process.env.PAYSTACK_SECRET_KEY || null;
}

export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = getPaystackSecretKey();
  if (!secret || !signature) return false;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

export async function paystackInitialize(input: {
  email: string;
  amount: number; // in kobo
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackInitializeResponse> {
  const secret = getPaystackSecretKey();
  if (!secret) {
    return { status: false, message: "Paystack is not configured" };
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amount,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  return response.json();
}

export async function paystackVerify(
  reference: string,
): Promise<PaystackVerifyResponse> {
  const secret = getPaystackSecretKey();
  if (!secret) {
    return { status: false, message: "Paystack is not configured" };
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      cache: "no-store",
    },
  );

  return response.json();
}

