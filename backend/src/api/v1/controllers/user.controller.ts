import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { createUserSchema } from '../validators/user.validator';

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
    console.log("req",req.body)
    const { name, email, password } = createUserSchema.parse(req).body;

    const user = await userService.createUser({ name, email, password });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error: any) {
    console.log("error signup",error)
    if (error.message.includes('already exists')) {
      return res.status(409).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'An error occurred during signup.' });
  }
};
