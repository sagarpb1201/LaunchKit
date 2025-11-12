import { z } from 'zod';

export const createProductAndPlanSchema = z.object({
  productName: z.string().min(1, { message: 'Product name is required.' }),
  productDescription: z.string().optional().default(''),
  planName: z.string().min(1, { message: 'Plan name is required.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  currency: z
    .string()
    .length(3, { message: 'Currency must be a 3-letter ISO code.' })
    .toUpperCase(),
  interval: z.enum(['day', 'week', 'month', 'year']),
  features: z.array(z.string()).optional().default([]),
});

export type TCreateProductAndPlanSchema = z.infer<typeof createProductAndPlanSchema>;
