"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Plan } from "@/types/payment";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface PricingCardProps {
  plan: Plan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("You must be logged in to subscribe");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/payment/create-checkout-session", {
        priceId: plan.stripePriceId,
      });

      const { url } = response.data.data;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Checkout URL not found");
      }
    } catch (error: any) {
      console.error("Failed to create checkout session:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Could not initiate subscription. please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul role="list" className="space-y-4">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start">
              <div className="flex-shrink-0">
                <CheckIcon className="h-6 w-6 text-green-500" aria-hidden="true"/>
              </div>
              <p className="ml-3 text-base font-medium text-gray-500 dark:text-gray-400">{feature}</p>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubscribe} disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
}
