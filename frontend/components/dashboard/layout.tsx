'use client';
import ProtectedRoute from '@/components/auth/protected-route';
import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';
import VerificationBanner from '@/components/dashboard/verification-banner';
import { AuthProvider, useAuth } from '@/context/auth-context';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </ProtectedRoute>
    </AuthProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {user && !user.isEmailVerified && <VerificationBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}