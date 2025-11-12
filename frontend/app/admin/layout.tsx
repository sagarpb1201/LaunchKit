import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your SaaS</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/products">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-base"
            >
              <Package className="h-5 w-5" />
              Products & Plans
            </Button>
          </Link>

          <Link href="/admin/settings">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-base"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <LogOut className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
