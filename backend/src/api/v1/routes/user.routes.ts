import { Router } from 'express';
import { getAllUsers, getMe, loginUser, refreshToken, signupUser } from '../controllers/user.controller';
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

// GET /api/v1/users/me - Any logged in user
router.get('/me', protect(), getMe);

export default router;