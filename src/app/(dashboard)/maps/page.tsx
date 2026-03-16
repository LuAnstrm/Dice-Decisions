'use client';

import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { MapPin } from 'lucide-react';

export default function MapsPage() {
  return (
    <>
      <Topbar title="Maps" />
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={MapPin}
          title="No Maps"
          description="Upload campaign maps and place interactive markers."
        />
      </div>
    </>
  );
}
