import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { Role } from "../../../generated/client";
import {
  createCheckoutSessionController,
  getSubscriptionPlans,
  createProductAndPlanController,
} from "../controllers/payment.controller";

const router=Router();

router.post('/create-checkout-session',protect([Role.USER]), createCheckoutSessionController);
router.get('/plans',getSubscriptionPlans);
router.post('/products',protect([Role.USER]), createProductAndPlanController)

export default router;