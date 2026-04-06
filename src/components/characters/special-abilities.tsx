import type { Tables } from '@/types/schema';
import { RpgCard } from '@/components/shared/rpg-card';
import { cn } from '@/lib/utils';

interface AbilityEntry {
  name: string;
  usage: 'at_will' | 'long_rest' | 'short_rest';
  description: string;
}

interface SpecialAbilitiesProps {
  character: Tables<'characters'>;
}

const USAGE_STYLES: Record<string, string> = {
  at_will: 'bg-(--color-text-muted)/20 text-(--color-text-muted)',
  long_rest: 'bg-(--color-accent-green)/20 text-(--color-accent-green)',
  short_rest: 'bg-(--color-accent-red)/20 text-(--color-accent-red)',
};

const USAGE_LABELS: Record<string, string> = {
  at_will: 'AT WILL',
  long_rest: '1/LONG REST',
  short_rest: '1/SHORT REST',
};

export function SpecialAbilities({ character }: SpecialAbilitiesProps) {
  const abilities = (character.abilities as unknown as AbilityEntry[]) || [];

  return (
    <RpgCard header={{ title: 'SPECIAL ABILITIES' }}>
      {abilities.length === 0 ? (
        <p className="text-sm text-(--color-text-muted)">No special abilities</p>
      ) : (
        <div className="space-y-4">
          {abilities.map((ability, idx) => (
            <div key={idx} className="border-l-2 border-(--color-accent-purple) pl-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-(--color-accent-cyan) font-medium text-sm">
                  {ability.name}
                </span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded',
                    USAGE_STYLES[ability.usage] || USAGE_STYLES.at_will,
                  )}
                >
                  {USAGE_LABELS[ability.usage] || ability.usage}
                </span>
              </div>
              <p className="text-sm text-(--color-text-secondary)">{ability.description}</p>
            </div>
          ))}
        </div>
      )}
    </RpgCard>
  );
}
