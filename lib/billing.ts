export type BillingProvider = "polar" | "paystack";

export function getConfiguredBillingProviders(): BillingProvider[] {
  const providers: BillingProvider[] = [];

  const hasPolar =
    !!process.env.NEXT_PUBLIC_STARTER_TIER &&
    !!process.env.NEXT_PUBLIC_STARTER_SLUG;
  if (hasPolar) providers.push("polar");

  const hasPaystack = !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (hasPaystack) providers.push("paystack");

  return providers;
}

export function getPreferredBillingProvider(): BillingProvider | null {
  const providers = getConfiguredBillingProviders();
  return providers[0] ?? null;
}

