'use client';

import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { UserCircle } from 'lucide-react';

export default function CharactersPage() {
  return (
    <>
      <Topbar title="Character Sheet" />
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={UserCircle}
          title="No Characters"
          description="Create your character with ability scores, HP, weapons, and more."
        />
      </div>
    </>
  );
}
