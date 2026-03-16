'use client';

import type { Tables } from '@/types/database';
import { NpcCard } from '@/components/npcs/npc-card';

interface NpcGridProps {
  npcs: Tables<'npcs'>[];
  isDM: boolean;
  onEdit: (npc: Tables<'npcs'>) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
}

export function NpcGrid({
  npcs,
  isDM,
  onEdit,
  onDelete,
  onToggleVisibility,
}: NpcGridProps) {
  if (npcs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-(--color-text-muted) text-sm">
          No NPCs match your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {npcs.map((npc) => (
        <NpcCard
          key={npc.id}
          npc={npc}
          isDM={isDM}
          onEdit={() => onEdit(npc)}
          onDelete={() => onDelete(npc.id)}
          onToggleVisibility={(visible) =>
            onToggleVisibility(npc.id, visible)
          }
        />
      ))}
    </div>
  );
}
