import prisma from '../../../config';
import { ApiError } from '../../../utils/ApiError';
import Stripe from 'stripe';
import { Plan } from '../../../generated/prisma';

// Initialize Stripe with the secret key and a specific API version.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

/**
 * Creates a Stripe Checkout Session for a user to purchase a subscription.
 * @param userId - The ID of the user initiating the checkout.
 * @param priceId - The ID of the Stripe Price object.
 * @returns The URL for the Stripe Checkout session.
 */
export const createCheckoutSession = async (
  userId: string,
  priceId: string
): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let stripeCustomerId = user.stripeCustomerId;

  // If the user is not a Stripe customer yet, create one.
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
    subscription_data: { metadata: { userId: userId } },
  });

  if (!session.url) {
    throw new ApiError(500, 'Failed to create Stripe checkout session');
  }

  return session.url;
};

/**
 * Fetches all available subscription plans from the database.
 * The plans are ordered by price in ascending order.
 * @returns A promise that resolves to an array of plans.
 */
export const getSubscriptionPlans = async (): Promise<Plan[]> => {
  const plans = await prisma.plan.findMany({
    orderBy: {
      price: 'asc',
    },
  });
  return plans;
};