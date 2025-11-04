import { Router } from 'express';
import { createCheckoutSessionController } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-checkout-session', protect(), createCheckoutSessionController);

export default router;