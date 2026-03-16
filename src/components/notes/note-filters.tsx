'use client';

import { cn } from '@/lib/utils';

const tags = [
  { value: '', label: 'ALL' },
  { value: 'session_log', label: 'SESSION LOG' },
  { value: 'world_lore', label: 'WORLD LORE' },
  { value: 'plot', label: 'PLOT' },
  { value: 'dm_secret', label: 'DM SECRET' },
];

interface NoteFiltersProps {
  activeTag: string;
  onTagChange: (tag: string) => void;
}

export function NoteFilters({ activeTag, onTagChange }: NoteFiltersProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <button
          key={tag.value}
          onClick={() => onTagChange(tag.value)}
          className={cn(
            'text-xs px-3 py-1.5 rounded-badge font-medium transition-all cursor-pointer',
            activeTag === tag.value
              ? 'bg-(--color-accent-purple) text-white'
              : 'border border-(--color-border-default) text-(--color-text-muted) hover:border-(--color-border-hover) hover:text-(--color-text-secondary)',
          )}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}
