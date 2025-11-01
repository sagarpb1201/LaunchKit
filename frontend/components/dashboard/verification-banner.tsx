'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { AlertCircle } from 'lucide-react';

export default function VerificationBanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResend = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await api.post('/users/resend-verification');
      setMessage('A new verification email has been sent to your inbox.');
    } catch (error) {
      setMessage('Failed to send verification email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Email Verification Required</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Your email is not verified. Please check your inbox for a verification link.</span>
        <Button onClick={handleResend} disabled={isLoading} variant="outline" size="sm">
          {isLoading ? 'Sending...' : 'Resend Email'}
        </Button>
      </AlertDescription>
      {message && <p className="text-sm mt-2">{message}</p>}
    </Alert>
  );
}