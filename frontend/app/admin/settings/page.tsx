import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Settings
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Configure your admin panel and system settings
          </p>
        </div>

        <div className="grid gap-6">
          {/* Coming Soon Cards */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Stripe Configuration</CardTitle>
              <CardDescription>
                Manage your Stripe API keys and webhook settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-400">
                  Configure Stripe integration for payment processing
                </p>
                <Button disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Set up email templates and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-400">
                  Configure email service and templates
                </p>
                <Button disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-400">
                  View and manage all users in the system
                </p>
                <Button disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View system analytics and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-400">
                  Monitor revenue, subscriptions, and user metrics
                </p>
                <Button disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
