'use client';

import type { Tables } from '@/types/database';
import { RpgCard } from '@/components/shared/rpg-card';
import { cn } from '@/lib/utils';

interface NPCCardProps {
  npc: Tables<'npcs'>;
  onClick?: () => void;
  isDM?: boolean;
}

const NPC_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-300',
  deceased: 'bg-red-500/20 text-red-300',
  hidden: 'bg-yellow-500/20 text-yellow-300',
};

export function NPCCard({ npc, onClick, isDM = false }: NPCCardProps) {
  const statusColor = NPC_STATUS_COLORS[npc.status as string] || 'bg-gray-500/20 text-gray-300';

  return (
    <RpgCard
      variant="interactive"
      onClick={onClick}
      className="flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] truncate">
            {npc.name}
          </h3>
          {npc.role && (
            <p className="text-sm text-[var(--color-text-secondary)] truncate">
              {npc.role}
            </p>
          )}
        </div>
        {!npc.is_visible_to_players && isDM && (
          <span className="ml-2 flex-shrink-0 text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
            DM Only
          </span>
        )}
      </div>

      {npc.race && (
        <p className="text-xs text-[var(--color-text-muted)] mb-2">
          {npc.race}
        </p>
      )}

      {npc.description && (
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3 flex-1">
          {npc.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
        <div className="flex gap-3 text-xs">
          {npc.hp !== null && (
            <div className="flex flex-col items-center">
              <span className="text-[var(--color-text-muted)]">HP</span>
              <span className="text-[var(--color-accent)] font-bold">{npc.hp}</span>
            </div>
          )}
          {npc.armor_class !== null && (
            <div className="flex flex-col items-center">
              <span className="text-[var(--color-text-muted)]">AC</span>
              <span className="text-[var(--color-accent)] font-bold">{npc.armor_class}</span>
            </div>
          )}
        </div>
        <span className={cn('text-xs py-1 px-2 rounded', statusColor)}>
          {npc.status}
        </span>
      </div>
    </RpgCard>
  );
}
