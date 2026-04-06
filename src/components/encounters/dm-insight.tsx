'use client';

import type { Tables } from '@/types/schema';
import type { EncounterFormData, EnemyEntry } from '@/lib/validations/encounter';
import {
  calcHitProbability,
  getPlayerAttackBonus,
} from '@/components/encounters/probability-stream';
import { Sparkles } from 'lucide-react';

interface DmInsightProps {
  encounterData: EncounterFormData | null;
  partyCharacters: Tables<'characters'>[];
}

function getDifficultyRating(avg: number): string {
  if (avg > 0.8) return 'TRIVIAL';
  if (avg >= 0.65) return 'EASY';
  if (avg >= 0.5) return 'MODERATE';
  if (avg >= 0.35) return 'CHALLENGING';
  return 'DEADLY';
}

function getAdvice(rating: string): string {
  switch (rating) {
    case 'DEADLY':
      return 'Consider reducing enemy count or providing party buffs.';
    case 'CHALLENGING':
      return 'Consider adjusting enemy AC or adding healing options.';
    default:
      return 'This encounter is well-balanced for the party.';
  }
}

export function DmInsight({ encounterData, partyCharacters }: DmInsightProps) {
  const hasData = encounterData && partyCharacters.length > 0;

  if (!hasData) {
    return (
      <div className="border-l-4 border-(--color-accent-purple) rounded-r bg-(--color-surface-elevated) p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-(--color-accent-purple)" />
          <h3 className="text-sm font-semibold text-(--color-accent-purple)">
            DM Insight
          </h3>
        </div>
        <p className="text-sm text-(--color-text-muted) italic">
          Save an encounter and generate probability to see DM insights.
        </p>
      </div>
    );
  }

  const enemies = encounterData.enemies as EnemyEntry[];

  const totalEnemyHP = enemies.reduce((sum, e) => sum + e.hp, 0);
  const totalPartyHP = partyCharacters.reduce((sum, c) => sum + c.hp_current, 0);

  const matchups = partyCharacters.flatMap((char) =>
    enemies.map((enemy) => {
      const atkBonus = getPlayerAttackBonus(char);
      return calcHitProbability(atkBonus, enemy.ac);
    }),
  );

  const avgProb = matchups.length > 0
    ? matchups.reduce((a, b) => a + b, 0) / matchups.length
    : 0;

  const rating = getDifficultyRating(avgProb);
  const advice = getAdvice(rating);
  const avgPct = Math.round(avgProb * 100);

  return (
    <div className="border-l-4 border-(--color-accent-purple) rounded-r bg-(--color-surface-elevated) p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-(--color-accent-purple)" />
        <h3 className="text-sm font-semibold text-(--color-accent-purple)">
          DM Insight
        </h3>
      </div>
      <p className="text-sm text-(--color-text-secondary) italic leading-relaxed">
        This encounter is rated{' '}
        <strong className="text-(--color-text-primary) not-italic">{rating}</strong>.
        Your party has a {avgPct}% average chance of hitting, and the enemies have{' '}
        {totalEnemyHP} combined HP against the party&apos;s {totalPartyHP}. {advice}
      </p>
    </div>
  );
}
