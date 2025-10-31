'use client';

import { useAuth } from '@/context/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Welcome, {user?.name || 'User'}!</h1>
    </div>
  );
}