import Stripe from "stripe";
import prisma from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import { SubscriptionStatus } from "../../../generated/client"; // Corrected import path
import stripe from "../../../config/stripe";

/**
 * Handles the 'checkout.session.completed' event.
 * Creates a new subscription in the local database.
 * @param session - The Stripe Checkout Session object from the webhook event.
 */
const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const userId = session.metadata?.userId;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeSubscriptionId) {
    throw new ApiError(
      400,
      "Webhook Error: Missing metadata for checkout.session.completed"
    );
  }

  const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId
  );
  const priceId = subscription.items.data[0].price.id;

  const plan = await prisma.plan.findUnique({
    where: { stripePriceId: priceId },
  });

  if (!plan) {
    throw new ApiError(404, `Plan not found for price ID: ${priceId}`);
  }

  const existingLocalSubscription = await prisma.subscription.findUnique({
    where: { userId: userId },
  });

  const subscriptionData = {
    userId,
    planId: plan.id,
    stripeSubscriptionId: subscription.id,
    status: subscription.status.toUpperCase() as SubscriptionStatus,
    currentPeriodStart: new Date(
      subscription.items.data[0].current_period_start * 1000
    ),
    currentPeriodEnd: new Date(
      subscription.items.data[0].current_period_end * 1000
    ),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
  };

  if (existingLocalSubscription) {
    await prisma.subscription.update({
      where: { id: existingLocalSubscription.id },
      data: subscriptionData,
    });
    console.log(
      `Existing subscription for user ${userId} updated with new Stripe subscription ID: ${subscription.id}`
    );
  } else {
    await prisma.subscription.create({
      data: subscriptionData,
    });
    console.log(
      `✅ Subscription created for user ${userId} with Stripe subscription ID: ${subscription.id}`
    );
  }
};

/**
 * Handles 'invoice.payment_succeeded' and 'customer.subscription.updated' events.
 * Updates an existing subscription's status and period in the local database.
 * @param invoice - The Stripe Invoice or Subscription object from the webhook event.
 */
const handleSubscriptionUpdate = async (subscription: Stripe.Subscription) => {
  const localSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!localSubscription) {
    console.warn(
      `Webhook received for non-existent local subscription with Stripe ID: ${subscription.id} (update event)`
    );
    return;
  }
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: subscription.status.toUpperCase() as SubscriptionStatus,
      currentPeriodStart: new Date(
        subscription.items.data[0].current_period_start * 1000
      ),
      currentPeriodEnd: new Date(
        subscription.items.data[0].current_period_end * 1000
      ),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
  });

  console.log(`✅ Subscription updated for ${subscription.id}`);
};

/**
 * Handles 'customer.subscription.deleted' event.
 * Updates an existing subscription's status to 'canceled'.
 * @param subscription - The Stripe Subscription object from the webhook event.
 */
const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
    const localSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!localSubscription) {
    console.warn(`Webhook received for non-existent local subscription with Stripe ID: ${subscription.id} (deletion event)`);
    return;
  }
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: SubscriptionStatus.CANCELED, canceledAt: new Date() },
  });
  console.log(`✅ Subscription canceled for ${subscription.id}`);
};

/**
 * Handles 'invoice.payment_succeeded' event.
 * Creates a record of the payment in the local database.
 * @param invoice - The Stripe Invoice object from the webhook event.
 */
const handleInvoicePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  if (!invoice.customer) {
    console.warn(`Invoice ${invoice.id} is missing customer.`);
    return;
  }

  const stripeCustomerId = invoice.customer as string;
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId },
  });

  if (!user) {
    console.warn(`Webhook received for non-existent user with Stripe Customer ID: ${stripeCustomerId}`);
    return;
  }

  await prisma.payments.create({
    data: {
      userId: user.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status || 'succeeded',
      description: invoice.lines.data[0]?.description,
    },
  });

  console.log(`✅ Payment record created for invoice ${invoice.id} for user ${user.id}`);
};

export {
  handleCheckoutSessionCompleted,
  handleSubscriptionUpdate,
  handleSubscriptionDeleted,
  handleInvoicePaymentSucceeded,
};
