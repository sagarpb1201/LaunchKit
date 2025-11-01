'use client';

import { useAuth } from '@/context/auth-context';
import { ReactNode } from 'react';
import VerificationBanner from '../dashboard/verification-banner';

export default function EmailVerifiedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user && !user.isEmailVerified) {
    return (
      <div>
        <VerificationBanner />
        {/* Optionally, you can show a disabled version of the page or just the banner */}
      </div>
    );
  }

  return <>{children}</>;
}