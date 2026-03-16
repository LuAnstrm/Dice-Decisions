import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'role-dm'
  | 'role-player'
  | 'status-active'
  | 'status-deceased'
  | 'status-hidden'
  | 'status-planned'
  | 'note-session'
  | 'note-lore'
  | 'note-plot'
  | 'note-secret'
  | 'npc-villain'
  | 'npc-quest-giver'
  | 'npc-merchant'
  | 'npc-guide'
  | 'dice'
  | 'difficulty';

interface BadgeRpgProps {
  variant: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  'role-dm': 'bg-[#22c55e] text-[#052e16]',
  'role-player': 'bg-[#22c55e] text-[#052e16]',
  'status-active': 'border border-[#22c55e] text-[#22c55e] bg-transparent',
  'status-deceased': 'border border-[#475569] text-[var(--color-text-muted)] bg-transparent',
  'status-hidden': 'border border-[#475569] text-[var(--color-text-muted)] bg-transparent',
  'status-planned': 'border border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent',
  'note-session': 'bg-[#22c55e20] text-[#22c55e] border border-[#22c55e40]',
  'note-lore': 'bg-transparent border border-[var(--color-accent)] text-[var(--color-accent)]',
  'note-plot': 'bg-[var(--color-accent)] text-white',
  'note-secret': 'bg-[#ef444430] text-[#ef4444] border border-[#ef444460]',
  'npc-villain': 'bg-[#ef444420] text-[#ef4444]',
  'npc-quest-giver': 'bg-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] text-[var(--color-accent)]',
  'npc-merchant': 'bg-[#22c55e20] text-[#22c55e]',
  'npc-guide': 'bg-[#47556920] text-[var(--color-text-secondary)]',
  'dice': 'border border-[#22c55e] text-[#22c55e] bg-transparent',
  'difficulty': 'border border-[#eab308] text-[#eab308] bg-transparent',
};

export function BadgeRpg({ variant, children, icon, className }: BadgeRpgProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.05em] font-semibold',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {variant === 'note-secret' && <Lock size={12} />}
      {icon}
      {children}
    </span>
  );
}
