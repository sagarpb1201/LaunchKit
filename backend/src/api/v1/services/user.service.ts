import prisma from '../../../config';
import bcrypt from 'bcryptjs';
import { CreateUserInput, ForgotPasswordInput } from '../validators/user.validator';
import { ApiError } from '../../../utils/ApiError';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { LoginUserInput } from '../validators/user.validator';
import crypto from 'crypto';
import { sendEmail } from '../../../utils/email';

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

export const createUser = async (input: CreateUserInput) => {
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

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await prisma.refreshToken.create({
    data: {
      id: refreshTokenId,
      hashedToken: hashedRefreshToken,
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
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken, passwordResetExpires },
  });

  const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  await sendEmail({
    to: user.email,
    subject: 'Your password reset token (valid for 10 min)',
    html: message,
  });
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

  const isTokenValid = await bcrypt.compare(token, storedToken.hashedToken);
  if (!isTokenValid) {
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
