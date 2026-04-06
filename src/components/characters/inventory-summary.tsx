import type { Tables } from '@/types/schema';
import { RpgCard } from '@/components/shared/rpg-card';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryItem {
  name: string;
  quantity: number;
  weight?: number;
}

interface InventorySummaryProps {
  character: Tables<'characters'>;
}

const MAX_WEIGHT = 150; // 15 * 10 placeholder

export function InventorySummary({ character }: InventorySummaryProps) {
  const items = (character.inventory as unknown as InventoryItem[]) || [];
  const totalWeight = items.reduce((sum, item) => sum + (item.weight ?? 0) * item.quantity, 0);
  const weightRatio = totalWeight / MAX_WEIGHT;

  const weightColor =
    weightRatio >= 1
      ? 'text-(--color-accent-red)'
      : weightRatio >= 0.8
        ? 'text-(--color-accent-amber)'
        : 'text-(--color-accent-green)';

  return (
    <RpgCard
      header={{
        title: 'INVENTORY SUMMARY',
        icon: (
          <span className={cn('text-xs font-mono', weightColor)}>
            {totalWeight} / {MAX_WEIGHT} lbs
          </span>
        ),
      }}
    >
      {items.length === 0 ? (
        <p className="text-sm text-(--color-text-muted)">No items in inventory</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Package size={16} className="text-(--color-text-muted) shrink-0" />
              <span className="text-sm text-(--color-text-primary) flex-1 truncate">
                {item.name}
              </span>
              <span className="text-sm text-(--color-text-muted) shrink-0">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-(--color-border-default)">
        <button
          type="button"
          className="text-(--color-accent-purple) text-sm hover:underline"
        >
          VIEW ALL EQUIPMENT
        </button>
      </div>
    </RpgCard>
  );
}
