import prisma from '../../../config';
import bcrypt from 'bcryptjs';
import {
  SignupUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../validators/user.validator';
import { ApiError } from '../../../utils/ApiError';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { LoginUserInput } from '../validators/user.validator';
import crypto from 'crypto';
import { emailService } from '../../../utils/email';

export const findAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};

export const createUser = async (input: SignupUserInput) => {
  const { email, name, password } = input;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, 'A user with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken },
  });

  const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  try {
    if (user.email && user.name) {
      await emailService.sendVerificationEmail(user.email, verificationURL);
    } else {
      console.warn('Skipping verification email: missing user email or name', { userId: user.id, email: user.email, name: user.name });
    }
  } catch (err) {
    console.error('Failed to send verification email:', err);
  }

  return user;
};

export const loginUser = async (input: LoginUserInput) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not set");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not set");
}
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!, 10),
    }
  );

  const refreshTokenId = uuidv4();
  const refreshToken = jwt.sign(
    { id: refreshTokenId, userId: user.id },
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!, 10),
    }
  );

  await prisma.refreshToken.create({
    data: {
      id: refreshTokenId,
      hashedToken: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!) * 1000),
    },
  });

  return { user, accessToken, refreshToken };
};

export const forgotPassword = async (input: ForgotPasswordInput) => {
  const { email } = input;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log('User not found');
    return;
  }

  // Generate reset token logic...
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken, passwordResetExpires },
  });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await emailService.sendPasswordResetEmail(user.email, resetURL);
  } catch (err) {
    // Reset token fields if email fails
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: null, passwordResetExpires: null },
    });
    throw new ApiError(500, 'Failed to send password reset email. Please try again later.');
  }
};

export const resetPassword = async (token: string, input: ResetPasswordInput) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new ApiError(400, 'Token is invalid or has expired');
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, passwordResetToken: null, passwordResetExpires: null },
  });
};

export const verifyEmail = async (token: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
    },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid verification token.');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null, // Invalidate the token
    },
  });
};

export const resendVerificationEmail = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }
  if (user.isEmailVerified) {
    throw new ApiError(400, 'Email is already verified.');
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken },
  });

  const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  try {
    await emailService.sendVerificationEmail(user.email, verificationURL);
  } catch (err) {
    throw new ApiError(500, 'Failed to send verification email. Please try again later.');
  }
};

export const updateUserProfile = async (userId: string, data: UpdateProfileInput) => {
  // Check if the new email is already taken by another user
  if (data.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: userId },
      },
    });
    if (existingUser) {
      throw new ApiError(409, 'Email is already in use by another account.');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
    },
  });

  return updatedUser;
};

export const changeUserPassword = async (userId: string, data: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Incorrect current password.');
  }

  const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedNewPassword } });
};

export const refreshAccessToken = async (token: string) => {
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
    id: string;
    userId: string;
  };

  const storedToken = await prisma.refreshToken.findUnique({
    where: { id: decoded.id },
  });

  if (!storedToken || new Date() > storedToken.expiresAt) {
    throw new ApiError(403, 'Invalid or expired refresh token');
  }

  if (token !== storedToken.hashedToken) {
    throw new ApiError(403, 'Invalid refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  await prisma.refreshToken.delete({
    where: { id: decoded.id },
  });

  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!, 10) }
  );

  const newRefreshToken = jwt.sign({ id: uuidv4(), userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!, 10),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: string };

    await prisma.refreshToken.delete({
      where: { id: decoded.id },
    });
  } catch (error) {
    // If the token is invalid or expired, it's already unusable.
    // We can safely ignore the error and proceed with logging the user out on the client.
  }
};
