import type { LucideIcon } from 'lucide-react';
import { RpgCard } from './rpg-card';

interface StatDisplayProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  color?: string;
  subtitle?: string;
}

function resolveColorClasses(color?: string): { iconClass: string; valueClass: string } {
  switch (color) {
    case '#a855f7':
      return { iconClass: 'text-purple-500', valueClass: 'text-purple-500' };
    case '#22c55e':
      return { iconClass: 'text-emerald-400', valueClass: 'text-emerald-400' };
    case '#eab308':
      return { iconClass: 'text-amber-400', valueClass: 'text-amber-400' };
    case '#475569':
      return { iconClass: 'text-slate-500', valueClass: 'text-slate-400' };
    default:
      return { iconClass: 'text-(--color-accent)', valueClass: 'text-(--color-text-primary)' };
  }
}

export function StatDisplay({ value, label, icon: Icon, color, subtitle }: StatDisplayProps) {
  const { iconClass, valueClass } = resolveColorClasses(color);

  return (
    <RpgCard variant="stat">
      {Icon && (
        <Icon size={20} className={`mx-auto mb-2 ${iconClass}`} />
      )}
      <p className={`font-mono text-[28px] font-bold leading-none ${valueClass}`}>
        {value}
      </p>
      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
        {label}
      </p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-(--color-text-secondary)">{subtitle}</p>
      )}
    </RpgCard>
  );
}
