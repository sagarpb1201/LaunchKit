import { Request, Response } from 'express';
import Stripe from 'stripe';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import * as webhookService from '../services/webhook.service';
import stripe from '../../../config/stripe';


export const handleStripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      throw new ApiError(400, `Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await webhookService.handleCheckoutSessionCompleted(session);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        await webhookService.handleSubscriptionUpdate(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        // When a subscription is deleted, we only need to call handleSubscriptionDeleted.
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await webhookService.handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        // The subscription is already updated via customer.subscription.updated,
        // but you might have other logic here, like sending a receipt email.
        console.log(`Invoice payment succeeded for ${invoice.id}`);
        break;

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle failed payment, e.g., notify the user, update subscription status
        console.log(`Invoice payment failed for invoice: ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);
