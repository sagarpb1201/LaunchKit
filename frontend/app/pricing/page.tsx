// import { PricingCard } from '@/components/pricing-card'
import { PricingCard } from "@/components/dashboard/pricing-card";
import api from "@/lib/axios";
import { Plan } from "@/types/payment";

async function getPlans(): Promise<Plan[]>{
    try{
        console.log("Fetchign plans")
        const res = await api.get('/payment/plans');
        return res.data.data;
    }catch(err:any){
        throw new Error('Failed to fetch plans',err);
    }
}

export default async function PricingPage() {
  const plans=await getPlans();
  console.log(plans);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Pricing Plans
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Choose the plan that's right for you, Start building your dream
            project today.
          </p>
        </div>

        {plans.length>0?(
            <div>
                {plans.map((plan)=>(
                    <PricingCard key={plan.id} plan={plan}/>
                ))}
            </div>
        ):(
            <div className="mt-6 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">No subscription plans are available at the moment. Please check back later.</p>
            </div>
        )}
      </div>
    </div>
  );
}
