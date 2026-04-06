import type { Tables } from '@/types/schema';
import { RpgCard } from '@/components/shared/rpg-card';
import { Shield, Zap, Footprints } from 'lucide-react';

interface SecondaryStatsProps {
  character: Tables<'characters'>;
}

function formatSign(value: number): string {
  if (value > 0) return `+${value}`;
  if (value === 0) return '0';
  return `${value}`;
}

export function SecondaryStats({ character }: SecondaryStatsProps) {
  const dexMod = Math.floor((character.dexterity - 10) / 2);

  const stats = [
    { label: 'ARMOR CLASS', icon: Shield, value: `${character.armor_class}` },
    { label: 'INITIATIVE', icon: Zap, value: formatSign(dexMod) },
    { label: 'SPEED', icon: Footprints, value: `${character.speed} ft` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, icon: Icon, value }) => (
        <RpgCard key={label} variant="stat">
          <Icon size={20} className="text-(--color-accent-purple) mx-auto mb-2" />
          <p className="font-mono text-2xl font-bold text-(--color-text-primary)">{value}</p>
          <p className="text-xs text-(--color-text-muted) uppercase tracking-wider mt-1">
            {label}
          </p>
        </RpgCard>
      ))}
    </div>
  );
}
