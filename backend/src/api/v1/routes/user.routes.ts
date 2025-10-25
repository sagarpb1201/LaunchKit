import { Router } from 'express';
import { getAllUsers, loginUser, refreshToken, signupUser } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/users
router.get('/', protect, getAllUsers);

// POST /api/v1/users/refresh-token
router.post('/refresh-token', refreshToken);

// POST /api/v1/users/signup
router.post('/signup', signupUser);

// POST /api/v1/users/login
router.post('/login', loginUser);

export default router;