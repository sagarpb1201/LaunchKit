import { Router } from 'express';
import {
  createCheckoutSessionController,
  getPlansController,
} from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/plans', getPlansController);

router.post(
  '/create-checkout-session',
  protect(),
  createCheckoutSessionController
);

export default router;