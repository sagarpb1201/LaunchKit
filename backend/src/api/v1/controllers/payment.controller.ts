import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse } from "../../../utils/ApiResponse";
import * as paymentService from "../services/payment.service";
import { createCheckoutSessionSchema } from "../validators/payment.validator";

export const createCheckoutSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { priceId } = createCheckoutSessionSchema.parse(req).body;
    // @ts-ignore - We will fix the Express Request type globally later.
    const userId = req.user!.id;
    const sessionUrl = await paymentService.createCheckoutSession(
      userId,
      priceId
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { url: sessionUrl },
          "Checkout session created successfully"
        )
      );
  }
);
