'use client';

import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tables } from '@/types/schema';

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

const TAG_DEFAULT = {
  bg: 'bg-(--color-accent-cyan)/20',
  text: 'text-(--color-accent-cyan)',
  label: 'Session Log',
};

const tagStyles = {
  session_log: TAG_DEFAULT,
  world_lore: {
    bg: 'bg-(--color-accent-purple)/20',
    text: 'text-(--color-accent-purple)',
    label: 'World Lore',
  },
  plot: {
    bg: 'bg-(--color-accent-amber)/20',
    text: 'text-(--color-accent-amber)',
    label: 'Plot',
  },
  dm_secret: {
    bg: 'bg-(--color-accent-red)/20',
    text: 'text-(--color-accent-red)',
    label: 'DM Secret',
  },
} as const satisfies Record<string, { bg: string; text: string; label: string }>;

interface NoteCardProps {
  note: Tables<'notes'>;
  isSelected: boolean;
  onClick: () => void;
}

export function NoteCard({ note, isSelected, onClick }: NoteCardProps) {
  const tag = tagStyles[note.tag as keyof typeof tagStyles] ?? TAG_DEFAULT;
  const preview = note.content ? stripHtml(note.content).slice(0, 80) : '';

  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer p-3 rounded-lg transition-all',
        isSelected
          ? 'bg-(--color-surface-elevated) border border-(--color-accent-purple)/50 border-l-4 border-l-(--color-accent-purple)'
          : 'hover:bg-(--color-surface-elevated)/50 border border-transparent hover:border-(--color-border-default)',
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-badge font-medium',
            tag.bg,
            tag.text,
          )}
        >
          {tag.label}
        </span>
        {note.tag === 'dm_secret' && (
          <Lock size={10} className="text-(--color-accent-red)" />
        )}
      </div>
      <p className="font-semibold text-(--color-text-primary) text-sm truncate">
        {note.title}
      </p>
      {preview && (
        <p className="text-xs text-(--color-text-muted) line-clamp-2 mt-0.5">
          {preview}
        </p>
      )}
      <div className="flex justify-end mt-1.5">
        <span className="text-[10px] text-(--color-text-muted)">
          {relativeTime(note.created_at)}
        </span>
      </div>
    </div>
  );
}
