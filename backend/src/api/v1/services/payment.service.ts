import prisma from '../../../config/prisma';
import { ApiError } from '../../../utils/ApiError';
import stripe from '../../../config/stripe';
import { Plan } from '../../../generated/prisma';

const getOrCreateStripeCustomer = async(userId:string)=>{
  const user=await prisma.user.findUnique({
    where:{
      id:userId
    }
  });

  if(!user){
    throw new ApiError(404, 'User not found');
  }

  const stripeCustomerId=user.stripeCustomerId;

  if(stripeCustomerId){
    return stripeCustomerId;
  }

  const customer=await stripe.customers.create({
    email:user.email,
    metadata:{
      userId
    }
  });

  await prisma.user.update({
    where:{
      id:userId
    },
    data:{
      stripeCustomerId:customer.id
    }
  });
  return customer.id;
}

export const createCheckoutSession = async(userId:string, priceId:string)=>{
  const stripeCustomerId=await getOrCreateStripeCustomer(userId);

  const session=await stripe.checkout.sessions.create({
    customer:stripeCustomerId,
    payment_method_types:['card'],
    mode:'subscription',
    line_items:[
      {
        price:priceId,
        quantity:1
      }
    ],
    success_url:`${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:`${process.env.FRONTEND_URL}/cancel`,
    metadata:{userId}
  });

  return session.url;
}