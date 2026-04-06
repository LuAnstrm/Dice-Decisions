import type { Tables } from '@/types/schema';
import { RpgCard } from '@/components/shared/rpg-card';
import { cn } from '@/lib/utils';

interface AbilityScoresProps {
  character: Tables<'characters'>;
}

const ABILITIES = [
  { key: 'strength', label: 'STR' },
  { key: 'dexterity', label: 'DEX' },
  { key: 'constitution', label: 'CON' },
  { key: 'intelligence', label: 'INT' },
  { key: 'wisdom', label: 'WIS' },
  { key: 'charisma', label: 'CHA' },
] as const;

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function formatModifier(mod: number): string {
  if (mod > 0) return `+${mod}`;
  if (mod === 0) return '0';
  return `${mod}`;
}

export function AbilityScores({ character }: AbilityScoresProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {ABILITIES.map(({ key, label }) => {
        const score = character[key];
        const mod = getModifier(score);
        const formatted = formatModifier(mod);

        return (
          <RpgCard key={key} variant="stat" className="flex-1 min-w-[80px]">
            <p className="text-xs text-(--color-text-muted) uppercase tracking-wider mb-2">
              {label}
            </p>
            <div
              className={cn(
                'w-16 h-16 rounded-full border-2 border-(--color-accent-purple) flex items-center justify-center mx-auto'
              )}
            >
              <span
                className={cn(
                  'font-mono font-bold text-lg',
                  mod > 0 && 'text-(--color-accent-green)',
                  mod < 0 && 'text-(--color-accent-red)',
                  mod === 0 && 'text-(--color-text-muted)',
                )}
              >
                {formatted}
              </span>
            </div>
            <p className="text-sm text-(--color-text-muted) mt-2">{score}</p>
          </RpgCard>
        );
      })}
    </div>
  );
}
