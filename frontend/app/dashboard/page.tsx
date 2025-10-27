'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome, {user?.name || 'User'}!</h1>
        <p className="mt-2 text-lg text-muted-foreground">This is your protected dashboard.</p>
        <p className="mt-1 text-sm text-muted-foreground">Your role is: {user?.role}</p>
        <Button onClick={handleLogout} className="mt-6">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}