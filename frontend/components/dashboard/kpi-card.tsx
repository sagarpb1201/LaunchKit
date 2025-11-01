import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideProps, icons } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  icon: keyof typeof icons;
}

export default function KpiCard({ title, value, change, icon }: KpiCardProps) {
  const LucideIcon = icons[icon];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {LucideIcon && <LucideIcon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}