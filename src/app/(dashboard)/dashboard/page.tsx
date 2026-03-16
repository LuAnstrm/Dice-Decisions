'use client';

import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={LayoutDashboard}
          title="Welcome to Dice & Decisions"
          description="Your campaign command center. Data will appear here once you set up your campaign."
        />
      </div>
    </>
  );
}
