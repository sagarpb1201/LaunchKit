import { Router } from 'express';
import { getAllUsers, loginUser, signupUser } from '../controllers/user.controller.ts';
import { protect } from '../middleware/auth.middleware.ts';

const router = Router();

// GET /api/v1/users
router.get('/', protect, getAllUsers);

// POST /api/v1/users/signup
router.post('/signup', signupUser);

// POST /api/v1/users/login
router.post('/login', loginUser);

export default router;