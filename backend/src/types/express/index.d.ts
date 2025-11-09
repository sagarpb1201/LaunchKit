import { User } from '../../generated/prisma';

declare global {
  namespace Express {
    export interface Request {
      user?: Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'emailVerificationToken' | 'passwordResetToken' | 'passwordResetExpires'>;
    }
  }
}