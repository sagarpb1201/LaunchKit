'use client';

import KpiCard from '@/components/dashboard/kpi-card';
import MainChart from '@/components/dashboard/main-chart';
import RecentSignupsTable from '@/components/dashboard/recent-signups-table';
import { chartData, kpiData, recentSignups } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <MainChart data={chartData} />
        <RecentSignupsTable users={recentSignups} />
      </div>
    </div>
  );
}