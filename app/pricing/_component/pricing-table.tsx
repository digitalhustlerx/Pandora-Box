"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { getPreferredBillingProvider } from "@/lib/billing";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SubscriptionDetails = {
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
};

type SubscriptionDetailsResult = {
  hasSubscription: boolean;
  subscription?: SubscriptionDetails;
  error?: string;
  errorType?: "CANCELED" | "EXPIRED" | "GENERAL";
};

interface PricingTableProps {
  subscriptionDetails: SubscriptionDetailsResult;
}

export default function PricingTable({
  subscriptionDetails,
}: PricingTableProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session.data?.user);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleCheckout = async (productId: string, slug: string) => {
    if (isAuthenticated === false) {
      router.push("/sign-in");
      return;
    }

    try {
      const provider = getPreferredBillingProvider();
      if (provider === "polar") {
        if (!productId || !slug) {
          toast.error("Polar billing is not configured yet");
          return;
        }
        await authClient.checkout({
          products: [productId],
          slug: slug,
        });
        return;
      }

      if (provider === "paystack") {
        const res = await fetch("/api/paystack/initialize", { method: "POST" });
        const data = (await res.json()) as
          | { authorizationUrl: string }
          | { error: string };
        if (!res.ok || "error" in data) {
          toast.error("error" in data ? data.error : "Paystack init failed");
          return;
        }
        window.location.href = data.authorizationUrl;
        return;
      }

      toast.error("Billing is not configured yet");
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  const handleManageSubscription = async () => {
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      toast.error("Failed to open subscription management");
    }
  };

  const STARTER_TIER = process.env.NEXT_PUBLIC_STARTER_TIER ?? "";
  const STARTER_SLUG = process.env.NEXT_PUBLIC_STARTER_SLUG ?? "";
  const isBillingConfigured = !!getPreferredBillingProvider();

  const isCurrentPlan = (tierProductId: string) => {
    return (
      subscriptionDetails.hasSubscription &&
      (subscriptionDetails.subscription?.productId === tierProductId ||
        subscriptionDetails.subscription?.productId === "paystack:starter") &&
      subscriptionDetails.subscription?.status === "active"
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="flex flex-col items-center justify-center px-4 mb-24 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          Fake Subscription
        </h1>
        <p className="text-xl text-muted-foreground">
          Test out this starter kit using this fake subscription.
        </p>
        {!isBillingConfigured && (
          <p className="text-sm text-muted-foreground mt-2">
            Billing is not configured yet. Pricing will be available soon.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Starter Tier */}
        <Card className="relative h-fit">
          {isCurrentPlan(STARTER_TIER) && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Current Plan
              </Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Starter</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$1,000</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>5 Projects</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>10GB Storage</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>1 Team Member</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>Email Support</span>
            </div>
          </CardContent>
          <CardFooter>
            {!isBillingConfigured ? (
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            ) : isCurrentPlan(STARTER_TIER) ? (
              <div className="w-full space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleManageSubscription}
                >
                  Manage Subscription
                </Button>
                {subscriptionDetails.subscription && (
                  <p className="text-sm text-muted-foreground text-center">
                    {subscriptionDetails.subscription.cancelAtPeriodEnd
                      ? `Expires ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`
                      : `Renews ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`}
                  </p>
                )}
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleCheckout(STARTER_TIER, STARTER_SLUG)}
              >
                {isAuthenticated === false
                  ? "Sign In to Get Started"
                  : "Get Started"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Need a custom plan?{" "}
          <span className="text-primary cursor-pointer hover:underline">
            Contact us
          </span>
        </p>
      </div>
    </section>
  );
}
