'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { RpgCard } from '@/components/shared/rpg-card';
import { PROBABILITY_DICE_TYPES } from '@/lib/probability/constants';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DiceConfig, DiceType } from '@/types/probability';

interface DiceSelectorProps {
  primaryConfig: DiceConfig;
  comparisonConfig: DiceConfig | null;
  onPrimaryChange: (config: DiceConfig) => void;
  onComparisonChange: (config: DiceConfig) => void;
  onComparisonToggle: () => void;
}

export function DiceSelector({
  primaryConfig,
  comparisonConfig,
  onPrimaryChange,
  onComparisonChange,
  onComparisonToggle,
}: DiceSelectorProps) {
  const isComparing = comparisonConfig !== null;

  function formatNotation(config: DiceConfig): string {
    const num = config.type.replace('d', '');
    return `${config.count}d${num}`;
  }

  return (
    <RpgCard variant="default" className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(16,18,28,0.96),rgba(11,13,20,0.98))]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <Image src="/images/icons/fantasy/rolling-dices.png" alt="" fill className="object-contain p-2.5 opacity-95" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-(--color-text-muted)">
              Distribution Controls
            </p>
            <h2 className="text-base font-bold text-(--color-text-primary)">
              Dice Distribution Visualizer
            </h2>
            <p className="mt-0.5 text-xs text-(--color-text-muted)">
              Comparing distributions across variance types
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-(--color-accent)" />
            Primary
          </span>
          {isComparing && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Comparison
            </span>
          )}
        </div>
      </div>

      {/* Primary dice row */}
      <div className="flex items-center gap-4 mt-4 flex-wrap rounded-[20px] border border-white/8 bg-black/20 p-4">
        <div className="flex items-center gap-2">
          {PROBABILITY_DICE_TYPES.map((d) => (
            <button
              key={d.type}
              onClick={() => onPrimaryChange({ ...primaryConfig, type: d.type })}
              className={cn(
                'w-12 h-12 rounded-full border-2 text-xs font-bold transition-all shadow-[0_10px_22px_rgba(0,0,0,0.18)]',
                primaryConfig.type === d.type
                  ? 'border-transparent bg-(--color-accent) text-white'
                  : 'border-accent/40 text-(--color-text-secondary) hover:border-(--color-accent)',
              )}
              aria-label={`Set primary dice to ${d.label}`}
              title={`Set primary dice to ${d.label}`}
            >
              {d.label.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
            Dice Count
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                onPrimaryChange({ ...primaryConfig, count: Math.max(1, primaryConfig.count - 1) })
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-(--color-border) text-(--color-text-muted) hover:border-(--color-border-hover)"
              aria-label="Decrease primary dice count"
              title="Decrease primary dice count"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-mono text-sm text-(--color-text-primary)">
              {primaryConfig.count}
            </span>
            <button
              onClick={() =>
                onPrimaryChange({ ...primaryConfig, count: Math.min(10, primaryConfig.count + 1) })
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-(--color-border) text-(--color-text-muted) hover:border-(--color-border-hover)"
              aria-label="Increase primary dice count"
              title="Increase primary dice count"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="px-3 py-1 rounded-full border border-emerald-500/40 text-xs font-mono text-emerald-400">
            SELECTED: {formatNotation(primaryConfig)}
          </span>
        </div>
      </div>

      {/* Compare toggle */}
      <div className="mt-4 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onComparisonToggle}
          className={cn(
            'rounded-full text-xs',
            isComparing && 'border-amber-400/50 text-amber-400',
          )}
        >
          {isComparing ? 'Disable Comparison' : 'Compare'}
        </Button>
      </div>

      {/* Comparison row */}
      {isComparing && comparisonConfig && (
        <div className="mt-3 flex items-center gap-4 flex-wrap rounded-[20px] border border-amber-400/15 bg-amber-400/6 p-4">
          <div className="flex items-center gap-2">
            {PROBABILITY_DICE_TYPES.map((d) => (
              <button
                key={d.type}
                onClick={() => onComparisonChange({ ...comparisonConfig, type: d.type })}
                className={cn(
                  'w-12 h-12 rounded-full border-2 text-xs font-bold transition-all shadow-[0_10px_22px_rgba(0,0,0,0.18)]',
                  comparisonConfig.type === d.type
                    ? 'bg-amber-400 text-black border-transparent'
                    : 'border-amber-400/40 text-(--color-text-secondary) hover:border-amber-400',
                )}
                aria-label={`Set comparison dice to ${d.label}`}
                title={`Set comparison dice to ${d.label}`}
              >
                {d.label.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() =>
                onComparisonChange({
                  ...comparisonConfig,
                  count: Math.max(1, comparisonConfig.count - 1),
                })
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-(--color-border) text-(--color-text-muted) hover:border-(--color-border-hover)"
              aria-label="Decrease comparison dice count"
              title="Decrease comparison dice count"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-mono text-sm text-(--color-text-primary)">
              {comparisonConfig.count}
            </span>
            <button
              onClick={() =>
                onComparisonChange({
                  ...comparisonConfig,
                  count: Math.min(10, comparisonConfig.count + 1),
                })
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-(--color-border) text-(--color-text-muted) hover:border-(--color-border-hover)"
              aria-label="Increase comparison dice count"
              title="Increase comparison dice count"
            >
              <Plus size={14} />
            </button>
            <span className="ml-2 px-3 py-1 rounded-full border border-amber-400/40 text-xs font-mono text-amber-400">
              COMPARE: {formatNotation(comparisonConfig)}
            </span>
          </div>
        </div>
      )}
    </RpgCard>
  );
}
