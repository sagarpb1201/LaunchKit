import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const signupSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TSignupSchema = z.infer<typeof signupSchema>;