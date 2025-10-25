import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { createUserSchema } from '../validators/user.validator';
import { asyncHandler } from '../../../utils/asyncHandler';

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
