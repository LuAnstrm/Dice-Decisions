'use client';

import type { Tables } from '@/types/database';
import { RpgCard } from '@/components/shared/rpg-card';

interface PlayerNoteCardProps {
  note: Tables<'player_notes'>;
  onClick?: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function PlayerNoteCard({ note, onClick }: PlayerNoteCardProps) {
  const timeAgo = formatDate(note.created_at);

  return (
    <RpgCard
      variant="interactive"
      onClick={onClick}
      className="flex flex-col h-full"
    >
      <div className="flex-1 mb-3">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] truncate">
          {note.title}
        </h3>

        {note.content && (
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mt-2">
            {note.content}
          </p>
        )}
      </div>

      <div className="text-xs text-[var(--color-text-muted)] pt-2 border-t border-white/5">
        {timeAgo}
      </div>
    </RpgCard>
  );
}

