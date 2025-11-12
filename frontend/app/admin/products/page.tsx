'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  active: boolean;
  productId: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  plans: Plan[];
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/payment/plans');
        
        // Group plans by product
        const groupedProducts: { [key: string]: Product } = {};
        
        response.data.data.forEach((plan: Plan) => {
          if (!groupedProducts[plan.productId]) {
            groupedProducts[plan.productId] = {
              id: plan.productId,
              name: 'Product',
              description: null,
              active: true,
              plans: [],
              createdAt: new Date().toISOString(),
            };
          }
          groupedProducts[plan.productId].plans.push(plan);
        });

        setProducts(Object.values(groupedProducts));
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch products';
        toast.error(errorMessage);
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          <p className="text-slate-600 dark:text-slate-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Products & Plans
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage your subscription products and pricing plans
            </p>
          </div>
          <Link href="/admin/products/create">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Product
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No products yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Create your first product and subscription plan to get started.
                </p>
                <Link href="/admin/products/create">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Product
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{product.name}</CardTitle>
                      {product.description && (
                        <CardDescription className="mt-2">{product.description}</CardDescription>
                      )}
                    </div>
                    <Badge variant={product.active ? 'default' : 'secondary'}>
                      {product.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Plans ({product.plans.length})
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {product.plans.map((plan) => (
                        <Card key={plan.id} className="border">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{plan.name}</CardTitle>
                                <p className="text-2xl font-bold mt-2">
                                  {plan.currency} {plan.price.toFixed(2)}
                                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                                    /{plan.interval}
                                  </span>
                                </p>
                              </div>
                              <Badge variant={plan.active ? 'default' : 'secondary'} size="sm">
                                {plan.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {plan.features.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  Features:
                                </p>
                                <ul className="space-y-1">
                                  {plan.features.map((feature, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                                    >
                                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
