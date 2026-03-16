'use client';

import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { ScrollText } from 'lucide-react';

export default function StoryNotesPage() {
  return (
    <>
      <Topbar title="Story Notes" />
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={ScrollText}
          title="No Story Notes"
          description="Start writing session notes, world lore, and DM secrets."
        />
      </div>
    </>
  );
}
