import { Router } from 'express';
import { getAllUsers, loginUser, signupUser } from '../controllers/user.controller';

const router = Router();

// GET /api/v1/users
router.get('/', getAllUsers);

// POST /api/v1/users/signup
router.post('/signup', signupUser);

router.post('/login',loginUser)

export default router;