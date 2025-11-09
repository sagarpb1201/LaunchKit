import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { Role } from "../../../generated/client";
import { createCheckoutSessionController, getSubscriptionPlans } from '../controllers/payment.controller'

const router=Router();

router.post('/create-checkout-session',protect([Role.USER]), createCheckoutSessionController);
router.get('/plans',getSubscriptionPlans);

export default router;