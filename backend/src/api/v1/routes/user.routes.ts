import { Router } from 'express';
import { getAllUsers, signupUser } from '../controllers/user.controller';

const router = Router();

// GET /api/v1/users
router.get('/', getAllUsers);

// POST /api/v1/users/signup
router.post('/signup', signupUser);

export default router;