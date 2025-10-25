import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { ZodError } from 'zod';
import { createUserSchema } from '../validators/user.validator';
import z from 'zod';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.findAllUsers();
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'An error occurred while fetching users.' });
  }
};

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = createUserSchema.parse(req).body;

    const user = await userService.createUser({ name, email, password });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error: any) {
    if (error instanceof ZodError) {
        const formattedErrors=z.treeifyError(error)
      return res.status(400).json({ success: false, errors:formattedErrors});
    }
    if (error.message.includes('already exists')) {
      return res.status(409).json({ success: false, error: error.message });
    }
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, error: 'An unexpected error occurred during signup.' });
  }
};
