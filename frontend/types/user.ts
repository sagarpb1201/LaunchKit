export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified?: boolean;
}