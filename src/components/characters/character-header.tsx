import type { Tables } from '@/types/schema';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharacterHeaderProps {
  character: Tables<'characters'>;
  onEditClick: () => void;
  isDM: boolean;
}

export function CharacterHeader({ character, onEditClick, isDM }: CharacterHeaderProps) {
  const initial = character.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-full bg-(--color-accent-purple) flex items-center justify-center">
          <span className="text-white text-[32px] font-bold leading-none">{initial}</span>
        </div>
        <button
          type="button"
          onClick={onEditClick}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-(--color-surface-elevated) border border-(--color-border-default) rounded-full flex items-center justify-center hover:border-(--color-border-hover) transition-colors"
          title="Edit character"
        >
          <Pencil size={14} className="text-(--color-text-secondary)" />
        </button>
      </div>

      {/* Name & Badges */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-(--color-text-primary) truncate">
          {character.name}
        </h1>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="border border-(--color-accent-purple) text-(--color-accent-purple) text-xs px-2 py-0.5 rounded-badge">
            {character.race}
          </span>
          <span className="border border-(--color-accent-purple) text-(--color-accent-purple) text-xs px-2 py-0.5 rounded-badge">
            {character.char_class}
          </span>
          <span className="border border-(--color-accent-purple) text-(--color-accent-purple) text-xs px-2 py-0.5 rounded-badge">
            Level {character.level}
          </span>
        </div>
      </div>

      {/* Stat Boxes */}
      <div className="flex gap-4 shrink-0">
        <div className="text-center">
          <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">HP</p>
          <p className="font-mono text-xl font-bold text-(--color-text-primary)">
            {character.hp_current}/{character.hp_max}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">XP</p>
          <p className="font-mono text-xl font-bold text-(--color-text-primary)">
            0 / 300
          </p>
        </div>
      </div>
    </div>
  );
}
