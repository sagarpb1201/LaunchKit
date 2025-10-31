import LoginForm from '@/components/auth/login-form';
import PublicRoute from '@/components/auth/public-route';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <PublicRoute>
        <LoginForm />
      </PublicRoute>
    </main>
  );
}