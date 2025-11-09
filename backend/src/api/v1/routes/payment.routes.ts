import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { Role } from "../../../generated/client";
import { createCheckoutSessionController } from '../controllers/payment.controller'

const router=Router();

router.post('/create-checkout',protect([Role.ADMIN]), createCheckoutSessionController);

export default router;