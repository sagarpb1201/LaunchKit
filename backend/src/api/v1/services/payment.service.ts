import prisma from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import stripe from "../../../config/stripe";
import Stripe from "stripe";

const getOrCreateStripeCustomer = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const stripeCustomerId = user.stripeCustomerId;

  if (stripeCustomerId) {
    return stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined, // Add user's name
    metadata: {
      userId,
    },
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });
  return customer.id;
};

export const createCheckoutSession = async (
  userId: string,
  priceId: string
) => {
  const stripeCustomerId = await getOrCreateStripeCustomer(userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    // This should theoretically never happen if getOrCreateStripeCustomer succeeded
    throw new ApiError(404, "User not found");
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    customer_update: {
      name: 'auto',
    },
    payment_method_types: ["card"],
    billing_address_collection: "required",
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    metadata: { userId },
  });

  return session.url;
};

export const createProductAndPlan = async (
  productName: string,
  productDescription: string,
  currency: string,
  interval: Stripe.Price.Recurring.Interval,
  price: number,
  features: string[],
  planName: string
) => {
  const stripeProduct = await stripe.products.create({
    name: productName,
    description: productDescription,
  });

  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: price * 100,
    currency: currency,
    recurring: { interval },
  });

  const product = await prisma.product.create({
    data: {
      name: productName,
      description: productDescription,
      stripeProductId: stripeProduct.id,
      plans: {
        create: {
          name: planName,
          price,
          currency,
          interval,
          stripePriceId: stripePrice.id,
          features,
        },
      },
    },
  });
  return product;
};

export const getPlans = async () => {
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });
  return plans;
};
