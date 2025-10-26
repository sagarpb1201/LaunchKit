'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TSignupSchema, signupSchema } from '@/lib/validators/auth';
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
import { useState } from 'react';

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: TSignupSchema) => {
    setError(null);
    try {
      const response = await api.post('/users/signup', data);
      if (response.data.success) {
        router.push('/login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
      console.error('Signup failed:', errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your LaunchKit account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sagar Biradar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              {form.formState.isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}