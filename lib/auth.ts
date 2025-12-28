import { db } from "@/db/drizzle";
import { account, session, subscription, user, verification } from "@/db/schema";
import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

function safeParseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const hasDatabase = !!db && !!process.env.DATABASE_URL;
const hasGoogleOAuth =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

const hasPolarEnv =
  hasDatabase &&
  !!appUrl &&
  !!process.env.POLAR_ACCESS_TOKEN &&
  !!process.env.POLAR_WEBHOOK_SECRET &&
  !!process.env.NEXT_PUBLIC_STARTER_TIER &&
  !!process.env.NEXT_PUBLIC_STARTER_SLUG;

const plugins = [nextCookies()];

if (hasPolarEnv) {
  const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: "sandbox",
  });
  const database = db!;

  plugins.unshift(
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: process.env.NEXT_PUBLIC_STARTER_TIER!,
              slug: process.env.NEXT_PUBLIC_STARTER_SLUG!,
            },
          ],
          successUrl: `${appUrl}/${process.env.POLAR_SUCCESS_URL ?? "success"}`,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onPayload: async ({ data, type }) => {
            if (
              type === "subscription.created" ||
              type === "subscription.active" ||
              type === "subscription.canceled" ||
              type === "subscription.revoked" ||
              type === "subscription.uncanceled" ||
              type === "subscription.updated"
            ) {
              try {
                const userId = data.customer?.externalId;
                const subscriptionData = {
                  id: data.id,
                  createdAt: new Date(data.createdAt),
                  modifiedAt: safeParseDate(data.modifiedAt),
                  amount: data.amount,
                  currency: data.currency,
                  recurringInterval: data.recurringInterval,
                  status: data.status,
                  currentPeriodStart:
                    safeParseDate(data.currentPeriodStart) || new Date(),
                  currentPeriodEnd:
                    safeParseDate(data.currentPeriodEnd) || new Date(),
                  cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
                  canceledAt: safeParseDate(data.canceledAt),
                  startedAt: safeParseDate(data.startedAt) || new Date(),
                  endsAt: safeParseDate(data.endsAt),
                  endedAt: safeParseDate(data.endedAt),
                  customerId: data.customerId,
                  productId: data.productId,
                  discountId: data.discountId || null,
                  checkoutId: data.checkoutId || "",
                  customerCancellationReason:
                    data.customerCancellationReason || null,
                  customerCancellationComment:
                    data.customerCancellationComment || null,
                  metadata: data.metadata ? JSON.stringify(data.metadata) : null,
                  customFieldData: data.customFieldData
                    ? JSON.stringify(data.customFieldData)
                    : null,
                  userId: userId as string | null,
                };

                await database
                  .insert(subscription)
                  .values(subscriptionData)
                  .onConflictDoUpdate({
                    target: subscription.id,
                    set: {
                      modifiedAt: subscriptionData.modifiedAt || new Date(),
                      amount: subscriptionData.amount,
                      currency: subscriptionData.currency,
                      recurringInterval: subscriptionData.recurringInterval,
                      status: subscriptionData.status,
                      currentPeriodStart: subscriptionData.currentPeriodStart,
                      currentPeriodEnd: subscriptionData.currentPeriodEnd,
                      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
                      canceledAt: subscriptionData.canceledAt,
                      startedAt: subscriptionData.startedAt,
                      endsAt: subscriptionData.endsAt,
                      endedAt: subscriptionData.endedAt,
                      customerId: subscriptionData.customerId,
                      productId: subscriptionData.productId,
                      discountId: subscriptionData.discountId,
                      checkoutId: subscriptionData.checkoutId,
                      customerCancellationReason:
                        subscriptionData.customerCancellationReason,
                      customerCancellationComment:
                        subscriptionData.customerCancellationComment,
                      metadata: subscriptionData.metadata,
                      customFieldData: subscriptionData.customFieldData,
                      userId: subscriptionData.userId,
                    },
                  });
              } catch (error) {
                console.error("Error processing subscription webhook:", error);
              }
            }
          },
        }),
      ],
    }),
  );
}

const databaseConfig = hasDatabase
  ? drizzleAdapter(db!, {
      provider: "pg",
      schema: {
        user,
        session,
        account,
        verification,
        subscription,
      },
    })
  : undefined;

export const auth = betterAuth({
  ...(process.env.BETTER_AUTH_SECRET
    ? { secret: process.env.BETTER_AUTH_SECRET }
    : {}),
  ...(appUrl ? { baseURL: appUrl } : {}),
  trustedOrigins: appUrl ? [appUrl] : [],
  allowedDevOrigins: appUrl ? [appUrl] : [],
  emailAndPassword: {
    enabled: true,
  },
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,
  },
  ...(databaseConfig ? { database: databaseConfig } : {}),
  ...(hasGoogleOAuth
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          },
        },
      }
    : {}),
  plugins,
});
