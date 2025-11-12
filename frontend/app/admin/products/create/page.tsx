import CreateProductForm from '@/components/admin/create-product-form';

export default function CreateProductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Create Product & Plan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Set up a new product with subscription pricing and features
          </p>
        </div>

        <CreateProductForm />
      </div>
    </div>
  );
}
