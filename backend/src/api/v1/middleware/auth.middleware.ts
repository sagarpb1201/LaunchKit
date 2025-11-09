import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import prisma from '../../../config/prisma';
import { Role } from '../../../generated/prisma';

export const protect = (roles: Role[] = []) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ApiError(401, 'Unauthorized request: No token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string; role: Role };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });

      if (!user) {
        throw new ApiError(401, 'Invalid access token: User not found');
      }

      // Role-based access control check
      if (roles.length > 0 && !roles.includes(user.role)) {
        throw new ApiError(403, 'Forbidden: You do not have permission to access this resource');
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, 'Invalid access token');
    }
  });
