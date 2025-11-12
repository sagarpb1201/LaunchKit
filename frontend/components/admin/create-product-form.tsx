'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TCreateProductAndPlanSchema, createProductAndPlanSchema } from '@/lib/validators/product';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CreateProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  const form = useForm<TCreateProductAndPlanSchema>({
    resolver: zodResolver(createProductAndPlanSchema),
    defaultValues: {
      productName: '',
      productDescription: '',
      planName: '',
      price: 0,
      currency: 'USD',
      interval: 'month',
      features: [],
    },
  });

  const addFeature = () => {
    if (featureInput.trim()) {
      const newFeatures = [...features, featureInput.trim()];
      setFeatures(newFeatures);
      form.setValue('features', newFeatures);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    form.setValue('features', newFeatures);
  };

  const onSubmit = async (data: TCreateProductAndPlanSchema) => {
    setIsLoading(true);
    try {
      const response = await api.post('/payment/products', {
        ...data,
        features: features,
      });

      toast.success('Product and plan created successfully!');
      form.reset();
      setFeatures([]);
      setFeatureInput('');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create product and plan';
      toast.error(errorMessage);
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Product & Plan</CardTitle>
          <CardDescription>
            Create a new product with a subscription plan and pricing details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Information</h3>

                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Pro Analytics"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product and its benefits..."
                          {...field}
                          disabled={isLoading}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Provide a detailed description of your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Plan Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Plan Details</h3>

                <FormField
                  control={form.control}
                  name="planName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Professional"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        The name of this subscription plan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="99.99"
                            step="0.01"
                            min="0"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                            <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Interval</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing interval" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="day">Daily</SelectItem>
                          <SelectItem value="week">Weekly</SelectItem>
                          <SelectItem value="month">Monthly</SelectItem>
                          <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often customers will be billed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Plan Features</h3>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature (e.g., Unlimited API calls)"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      disabled={isLoading || !featureInput.trim()}
                      variant="outline"
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-2 px-3 py-1"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            disabled={isLoading}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <FormDescription>
                    Add features that are included in this plan. Press Enter or click the + button to add.
                  </FormDescription>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Creating Product & Plan...' : 'Create Product & Plan'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
