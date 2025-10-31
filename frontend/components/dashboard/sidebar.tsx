'use client';

import Link from 'next/link';
import { Home, Package2, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function NavigationLink({
  href,
  icon,
  label,
  isActive
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
}) {
  const IconComponent = icon;
  const baseClasses = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
  const activeClasses = 'bg-muted text-primary';
  const inactiveClasses = 'text-muted-foreground hover:bg-accent hover:text-accent-foreground';

  return (
    <Link
      href={href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <IconComponent className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">LaunchKit</span>
          </Link>
        </div>
        <div className="flex-1 py-4">
          <div className="space-y-1 px-3 lg:px-4">
            {navItems.map((item) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}