import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { ApiResponse } from '../../../utils/ApiResponse';
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
  res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = createUserSchema.parse(req).body;

  const user = await userService.createUser({ name, email, password });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json(new ApiResponse(201, userWithoutPassword, 'User created successfully'));
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

  res.status(200).json(new ApiResponse(200, userWithoutPassword, 'Logged in successfully'));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, req.user, 'User profile retrieved successfully'));
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

  res.status(200).json(new ApiResponse(200, null, 'Token refreshed successfully'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { body: { password }, params: { token } } = resetPasswordSchema.parse(req);

  await userService.resetPassword(token, { password });

  res.status(200).json(new ApiResponse(200, null, 'Password reset successfully'));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(req).body;

  await userService.forgotPassword({ email });

  res.status(200).json(new ApiResponse(200, null, 'Token sent to email!'));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    throw new ApiError(400, 'Verification token is required.');
  }
  await userService.verifyEmail(token);

  res.status(200).json(new ApiResponse(200, null, 'Email verified successfully.'));
});

export const resendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await userService.resendVerificationEmail(userId);

  res.status(200).json(new ApiResponse(200, null, 'Verification email sent.'));
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (incomingRefreshToken) {
    await userService.logoutUser(incomingRefreshToken);
  }

  res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = updateProfileSchema.parse(req).body;
  const userId = req.user!.id;

  const updatedUser = await userService.updateUserProfile(userId, { name, email });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = updatedUser;

  res.status(200).json(new ApiResponse(200, userWithoutPassword, 'Profile updated successfully'));
});

export const updateMyPassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req).body;
  const userId = req.user!.id;

  await userService.changeUserPassword(userId, { currentPassword, newPassword, confirmNewPassword: newPassword });

  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});
