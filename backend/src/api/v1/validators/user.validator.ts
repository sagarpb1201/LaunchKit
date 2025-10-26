import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.email({ message: 'A valid email is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.email({ message: 'A valid email is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email({ message: 'A valid email is required' }),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
