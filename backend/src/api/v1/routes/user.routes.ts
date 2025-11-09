import { Router } from 'express';
import {
  forgotPassword,
  getAllUsers,
  getMe,
  loginUser,
  logoutUser,
  refreshToken,
  resetPassword,
  resendVerificationEmail,
signupUser,
  verifyEmail,
  updateMe,
  updateMyPassword,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { isVerified } from '../middleware/isVerified.middleware';
import { Role } from '../../../generated/client';

const router = Router();

// GET /api/v1/users - ADMIN only
router.get('/', protect([Role.ADMIN]), getAllUsers);

// POST /api/v1/users/refresh-token
router.post('/refresh-token', refreshToken);

// POST /api/v1/users/signup
router.post('/signup', signupUser);

// POST /api/v1/users/login
router.post('/login', loginUser);

// POST /api/v1/users/logout
router.post('/logout', logoutUser);

// POST /api/v1/users/forgot-password
router.post('/forgot-password', forgotPassword);

// PATCH /api/v1/users/reset-password/:token
router.patch('/reset-password/:token', resetPassword);

// GET /api/v1/users/verify-email/:token
router.get('/verify-email/:token', verifyEmail);

// POST /api/v1/users/resend-verification - Resend verification email
router.post('/resend-verification', protect(), resendVerificationEmail);

// GET /api/v1/users/me - Any logged in user
router.get('/me', protect(), getMe);

// PATCH /api/v1/users/update-me - Update current user's profile
router.patch('/update-me', protect(), isVerified, updateMe);

// PATCH /api/v1/users/update-my-password - Update current user's password
router.patch('/update-my-password', protect(), isVerified, updateMyPassword);

export default router;