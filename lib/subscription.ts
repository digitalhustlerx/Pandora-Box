import { paystackSubscription, subscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export type SubscriptionDetails = {
  id: string;
  productId: string;
  status: string;
  amount: number;
  currency: string;
  recurringInterval: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  organizationId: string | null;
  provider?: "polar" | "paystack";
};

export type SubscriptionDetailsResult = {
  hasSubscription: boolean;
  subscription?: SubscriptionDetails;
  error?: string;
  errorType?: "CANCELED" | "EXPIRED" | "GENERAL";
};

export async function getSubscriptionDetails(): Promise<SubscriptionDetailsResult> {
  try {
    // In early dev / public pages, allow rendering without DB/auth configured.
    if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
      return { hasSubscription: false };
    }

    const [{ auth }, { db }] = await Promise.all([
      import("@/lib/auth"),
      import("@/db/drizzle"),
    ]);

    if (!db) {
      return { hasSubscription: false };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { hasSubscription: false };
    }

    const [polarRows, paystackRows] = await Promise.all([
      db.select().from(subscription).where(eq(subscription.userId, session.user.id)),
      db
        .select()
        .from(paystackSubscription)
        .where(eq(paystackSubscription.userId, session.user.id)),
    ]);

    if (!polarRows.length && !paystackRows.length) {
      return { hasSubscription: false };
    }

    const now = new Date();

    const activePolar = polarRows
      .filter((sub) => sub.status === "active")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

    if (activePolar) {
      return {
        hasSubscription: true,
        subscription: {
          id: activePolar.id,
          productId: activePolar.productId,
          status: activePolar.status,
          amount: activePolar.amount,
          currency: activePolar.currency,
          recurringInterval: activePolar.recurringInterval,
          currentPeriodStart: activePolar.currentPeriodStart,
          currentPeriodEnd: activePolar.currentPeriodEnd,
          cancelAtPeriodEnd: activePolar.cancelAtPeriodEnd,
          canceledAt: activePolar.canceledAt,
          organizationId: null,
          provider: "polar",
        },
      };
    }

    const activePaystack = paystackRows
      .filter(
        (row) =>
          row.status === "active" &&
          new Date(row.expiresAt).getTime() > now.getTime(),
      )
      .sort(
        (a, b) =>
          new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
      )[0];

    if (activePaystack) {
      return {
        hasSubscription: true,
        subscription: {
          id: activePaystack.id,
          productId: activePaystack.productId,
          status: "active",
          amount: activePaystack.amount,
          currency: activePaystack.currency,
          recurringInterval: "30d",
          currentPeriodStart: activePaystack.paidAt,
          currentPeriodEnd: activePaystack.expiresAt,
          cancelAtPeriodEnd: true,
          canceledAt: null,
          organizationId: null,
          provider: "paystack",
        },
      };
    }

    const latestPolar = polarRows.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

    if (latestPolar) {
      const isExpired = new Date(latestPolar.currentPeriodEnd) < now;
      const isCanceled = latestPolar.status === "canceled";

      return {
        hasSubscription: true,
        subscription: {
          id: latestPolar.id,
          productId: latestPolar.productId,
          status: latestPolar.status,
          amount: latestPolar.amount,
          currency: latestPolar.currency,
          recurringInterval: latestPolar.recurringInterval,
          currentPeriodStart: latestPolar.currentPeriodStart,
          currentPeriodEnd: latestPolar.currentPeriodEnd,
          cancelAtPeriodEnd: latestPolar.cancelAtPeriodEnd,
          canceledAt: latestPolar.canceledAt,
          organizationId: null,
          provider: "polar",
        },
        error: isCanceled
          ? "Subscription has been canceled"
          : isExpired
            ? "Subscription has expired"
            : "Subscription is not active",
        errorType: isCanceled ? "CANCELED" : isExpired ? "EXPIRED" : "GENERAL",
      };
    }

    const latestPaystack = paystackRows.sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
    )[0];

    if (latestPaystack) {
      const isExpired = new Date(latestPaystack.expiresAt) < now;
      return {
        hasSubscription: true,
        subscription: {
          id: latestPaystack.id,
          productId: latestPaystack.productId,
          status: isExpired ? "expired" : "active",
          amount: latestPaystack.amount,
          currency: latestPaystack.currency,
          recurringInterval: "30d",
          currentPeriodStart: latestPaystack.paidAt,
          currentPeriodEnd: latestPaystack.expiresAt,
          cancelAtPeriodEnd: true,
          canceledAt: null,
          organizationId: null,
          provider: "paystack",
        },
        error: isExpired ? "Subscription has expired" : undefined,
        errorType: isExpired ? "EXPIRED" : undefined,
      };
    }

    return { hasSubscription: false };
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return {
      hasSubscription: false,
      error: "Failed to load subscription details",
      errorType: "GENERAL",
    };
  }
}

// Simple helper to check if user has an active subscription
export async function isUserSubscribed(): Promise<boolean> {
  const result = await getSubscriptionDetails();
  return result.hasSubscription && result.subscription?.status === "active";
}

// Helper to check if user has access to a specific product/tier
export async function hasAccessToProduct(productId: string): Promise<boolean> {
  const result = await getSubscriptionDetails();
  return (
    result.hasSubscription &&
    result.subscription?.status === "active" &&
    result.subscription?.productId === productId
  );
}

// Helper to get user's current subscription status
export async function getUserSubscriptionStatus(): Promise<"active" | "canceled" | "expired" | "none"> {
  const result = await getSubscriptionDetails();
  
  if (!result.hasSubscription) {
    return "none";
  }
  
  if (result.subscription?.status === "active") {
    return "active";
  }
  
  if (result.errorType === "CANCELED") {
    return "canceled";
  }
  
  if (result.errorType === "EXPIRED") {
    return "expired";
  }
  
  return "none";
}
