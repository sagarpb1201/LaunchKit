import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import {
  createUserSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/user.validator';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.findAllUsers();
  res.status(200).json({ success: true, data: users });
});

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = createUserSchema.parse(req).body;

  const user = await userService.createUser({ name, email, password });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json({ success: true, data: userWithoutPassword });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginUserSchema.parse(req).body;

  const { user, accessToken, refreshToken } = await userService.loginUser({ email, password });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!) * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!) * 1000,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({ success: true, data: userWithoutPassword, message: 'Logged in successfully' });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized: No refresh token provided');
  }

  const { accessToken, refreshToken } = await userService.refreshAccessToken(incomingRefreshToken);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN!, 10) * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!, 10) * 1000,
  });

  res.status(200).json({ success: true, message: 'Token refreshed successfully' });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { body: { password }, params: { token } } = resetPasswordSchema.parse(req);

  await userService.resetPassword(token, { password });

  res.status(200).json({ success: true, message: 'Password reset successfully' });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(req).body;

  await userService.forgotPassword({ email });

  res.status(200).json({ success: true, message: 'Token sent to email!' });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    throw new ApiError(400, 'Verification token is required.');
  }
  await userService.verifyEmail(token);

  res.status(200).json({ success: true, message: 'Email verified successfully.' });
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (incomingRefreshToken) {
    await userService.logoutUser(incomingRefreshToken);
  }

  res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = updateProfileSchema.parse(req).body;
  const userId = req.user!.id;

  const updatedUser = await userService.updateUserProfile(userId, { name, email });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = updatedUser;

  res.status(200).json({ success: true, data: userWithoutPassword, message: 'Profile updated successfully' });
});

export const updateMyPassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req).body;
  const userId = req.user!.id;

  await userService.changeUserPassword(userId, { currentPassword, newPassword, confirmNewPassword: newPassword });

  res.status(200).json({ success: true, message: 'Password changed successfully' });
});
