'use client';

import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={Settings}
          title="Settings"
          description="Configure your theme, profile, and preferences."
        />
      </div>
    </>
  );
}
