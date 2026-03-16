'use client';

import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { Swords } from 'lucide-react';

export default function EncountersPage() {
  return (
    <>
      <Topbar title="Encounters" />
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={Swords}
          title="No Encounters"
          description="Create encounters with auto-generated probability cards."
        />
      </div>
    </>
  );
}
