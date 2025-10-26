'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TLoginSchema, loginSchema } from '@/lib/validators/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: TLoginSchema) => {
    setError(null);
    try {
      const response = await api.post('/users/login', data);
      if (response.data.success) {
        // On successful login, redirect to the dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Handle login errors (e.g., invalid credentials)
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
      console.error('Login failed:', errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="sagar@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
