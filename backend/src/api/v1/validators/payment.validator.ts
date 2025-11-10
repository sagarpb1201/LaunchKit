import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  body: z.object({
    priceId: z.string().min(1, 'Price ID is required'),
  }),
});

export const createProductAndPlanSchema = z.object({
  body:z.object({
    productName: z.string().min(1, "Product name is required"),
    productDescription: z.string().optional(),
    planName: z.string().min(1, "Plan name is required"),
    price: z.number().positive("Price must a positive number"),
    currency: z
      .string()
      .min(3, "Currency must be a 3-letter ISO code")
      .max(3),
    interval: z.enum(["day", "week", "month", "year"]),
    features: z.array(z.string()).optional().default([]),
  }),
});