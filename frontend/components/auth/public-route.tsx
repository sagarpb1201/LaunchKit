'use client';

import { useAuth } from '@/context/auth-context';
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}