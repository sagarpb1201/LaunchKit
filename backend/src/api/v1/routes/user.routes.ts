import { Router } from 'express';
import { forgotPassword, getAllUsers, getMe, loginUser, refreshToken, resetPassword, signupUser } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { Role } from '../../../generated/prisma';

const router = Router();

// GET /api/v1/users - ADMIN only
router.get('/', protect([Role.ADMIN]), getAllUsers);

// POST /api/v1/users/refresh-token
router.post('/refresh-token', refreshToken);

// POST /api/v1/users/signup
router.post('/signup', signupUser);

// POST /api/v1/users/login
router.post('/login', loginUser);

// POST /api/v1/users/forgot-password
router.post('/forgot-password', forgotPassword);

// PATCH /api/v1/users/reset-password/:token
router.patch('/reset-password/:token', resetPassword);

// GET /api/v1/users/me - Any logged in user
router.get('/me', protect(), getMe);

export default router;