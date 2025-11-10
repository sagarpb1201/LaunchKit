import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiResponse } from "../../../utils/ApiResponse";
import * as paymentService from "../services/payment.service";
import {
  createCheckoutSessionSchema,
  createProductAndPlanSchema,
} from "../validators/payment.validator";

export const createCheckoutSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { priceId } = createCheckoutSessionSchema.parse(req).body;
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

export const createProductAndPlanController = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      productName,
      productDescription,
      currency,
      interval,
      price,
      features,
      planName,
    } = createProductAndPlanSchema.parse(req).body;

    const product = await paymentService.createProductAndPlan(
      productName,
      productDescription || "",
      currency,
      interval,
      price,
      features,
      planName
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, product, "Product and plan created successfully")
      );
  }
);

export const getSubscriptionPlans=asyncHandler(
  async(req:Request, res:Response)=>{
    // const plans=await prisma.plan.findMany();
    const plans=await paymentService.getPlans();
    console.log("Plans",plans)
    return res.status(200).json(
      new ApiResponse(
        200,
        plans,
        'Plans retrieved successfully'
      )
    )
  }
)
