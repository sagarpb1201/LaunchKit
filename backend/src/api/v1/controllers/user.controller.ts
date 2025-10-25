import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { createUserSchema, loginUserSchema } from '../validators/user.validator';
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
