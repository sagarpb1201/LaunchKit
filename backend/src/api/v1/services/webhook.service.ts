import Stripe from 'stripe';
import prisma from '../../../config/prisma';
import { ApiError } from '../../../utils/ApiError';
import { SubscriptionStatus } from '../../../generated/client'; // Corrected import path
import stripe from '../../../config/stripe';

/**
 * Handles the 'checkout.session.completed' event.
 * Creates a new subscription in the local database.
 * @param session - The Stripe Checkout Session object from the webhook event.
 */
const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeSubscriptionId) {
    throw new ApiError(400, 'Webhook Error: Missing metadata for checkout.session.completed');
  }

  const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const plan = await prisma.plan.findUnique({
    where: { stripePriceId: subscription.items.data[0].price.id },
  });

  if (!plan) {
    throw new ApiError(404, `Plan not found for price ID: ${subscription.items.data[0].price.id}`);
  }

  // Use upsert to handle both creation and updates idempotently
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId },
    update: {
      userId,
      planId: plan.id,
      status: subscription.status.toUpperCase() as SubscriptionStatus, // Ensure status is uppercase
      currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    create: { // This 'create' block was missing
      userId,
      planId: plan.id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status.toUpperCase() as SubscriptionStatus, // Ensure status is uppercase
      currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
  console.log(`✅ Subscription created for user ${userId}`);
};

/**
 * Handles 'invoice.payment_succeeded' and 'customer.subscription.updated' events.
 * Updates an existing subscription's status and period in the local database.
 * @param invoice - The Stripe Invoice or Subscription object from the webhook event.
 */
const handleSubscriptionUpdate = async (subscription: Stripe.Subscription) => {
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: subscription.status.toUpperCase() as SubscriptionStatus,
      currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
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
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id, },
    data: { status: 'CANCELED', canceledAt: new Date() },
  });
  console.log(`✅ Subscription canceled for ${subscription.id}`);
};

export { handleCheckoutSessionCompleted, handleSubscriptionUpdate, handleSubscriptionDeleted };
