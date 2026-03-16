'use client';

import Image from 'next/image';
import { RpgCard } from '@/components/shared/rpg-card';
import { ProbabilityBar } from '@/components/shared/probability-bar';
import type { ProbabilityCardData } from '@/types/probability';

interface RecentSimulationsProps {
  cards: ProbabilityCardData[];
  onClear: () => void;
}

function getResultTone(probability: number): {
  accentClass: string;
  textClass: string;
  barColor: string;
} {
  const pct = probability * 100;
  if (pct < 30) {
    return {
      accentClass: 'border-l-4 border-l-red-500',
      textClass: 'text-red-400',
      barColor: '#ef4444',
    };
  }
  if (pct <= 60) {
    return {
      accentClass: 'border-l-4 border-l-amber-500',
      textClass: 'text-amber-400',
      barColor: '#eab308',
    };
  }
  return {
    accentClass: 'border-l-4 border-l-emerald-500',
    textClass: 'text-emerald-400',
    barColor: '#22c55e',
  };
}

function formatDiceNotation(card: ProbabilityCardData): string {
  const { count, type, modifier } = card.diceConfig;
  const diceNum = type.replace('d', '');
  let notation = `${count}D${diceNum}`;
  if (modifier > 0) notation += ` + ${modifier}`;
  else if (modifier < 0) notation += ` - ${Math.abs(modifier)}`;
  return notation;
}

export function RecentSimulations({ cards, onClear }: RecentSimulationsProps) {
  if (cards.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] uppercase tracking-[0.05em] text-(--color-text-muted) font-semibold font-mono">
          Recent Simulations
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text-secondary)"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.slice(0, 8).map((card) => {
          const pct = card.result.successProbability * 100;
          const tone = getResultTone(card.result.successProbability);

          return (
            <RpgCard key={card.id} variant="probability" className={`overflow-hidden border-white/8 bg-[linear-gradient(180deg,rgba(13,16,24,0.95),rgba(9,11,17,0.98))] ${tone.accentClass}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="mb-1 text-xs font-bold text-(--color-text-primary)">
                    {card.actionName}
                  </p>
                  <span className="inline-block rounded-full border border-(--color-border) px-2 py-0.5 text-[10px] font-mono text-(--color-text-muted)">
                    {formatDiceNotation(card)}
                  </span>
                </div>
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/5">
                  <Image src="/images/icons/fantasy/card-ace-spades.png" alt="" fill className="object-contain p-2 opacity-90" />
                </div>
              </div>

              <p className={`mb-2 font-mono text-3xl font-bold ${tone.textClass}`}>
                {Math.round(pct)}%
              </p>
              <ProbabilityBar
                segments={[
                  { percentage: pct, color: tone.barColor },
                  { percentage: 100 - pct, color: '#1e293b' },
                ]}
                height={6}
              />
            </RpgCard>
          );
        })}
      </div>
    </div>
  );
}
