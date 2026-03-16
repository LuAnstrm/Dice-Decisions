'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProbabilityCardForm } from '@/components/probability/probability-card-form';
import { LiveCalculation } from '@/components/probability/live-calculation';
import { ProbabilityWorkbench } from '@/components/probability/probability-workbench';
import { RecentSimulations } from '@/components/probability/recent-simulations';
import { SaveToEncounter } from '@/components/probability/save-to-encounter';
import { calculateSuccessProbability } from '@/lib/probability/dice-math';
import type { DiceType, ProbabilityCardData } from '@/types/probability';

const STORAGE_KEY = 'dice-decisions-recent-cards';

export default function ProbabilityCardsPage() {
  const [currentCard, setCurrentCard] = useState<ProbabilityCardData | null>(null);
  const [recentCards, setRecentCards] = useState<ProbabilityCardData[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentCards(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (recentCards.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentCards));
    }
  }, [recentCards]);

  const handleCalculate = useCallback(
    (data: {
      actionName: string;
      diceType: DiceType;
      diceCount: number;
      modifier: number;
      targetDC: number;
    }) => {
      const config = {
        type: data.diceType,
        count: data.diceCount,
        modifier: data.modifier,
      };
      const result = calculateSuccessProbability(config, data.targetDC);
      const card: ProbabilityCardData = {
        id: crypto.randomUUID(),
        actionName: data.actionName,
        diceConfig: config,
        targetDC: data.targetDC,
        result,
      };

      setCurrentCard(card);
      setRecentCards((prev) => [card, ...prev].slice(0, 8));
    },
    [],
  );

  const handleClear = useCallback(() => {
    setRecentCards([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ProbabilityWorkbench
      section="Probability Cards"
      title="Forge roll odds into ready-to-read action cards."
      description="Build encounter-facing probability cards with the provided iconography, backdrop treatment, and live success math behind every modifier, die count, and target DC."
      moduleDescription="Build quick probability cards for a roll, target DC, and modifier so the table can read the odds at a glance."
      artPath="/images/icons/fantasy/card-play.png"
      stampPath="/images/icons/fantasy/dice-target.png"
      stats={[
        {
          label: 'Current Odds',
          value: currentCard ? `${Math.round(currentCard.result.successProbability * 100)}%` : 'Awaiting Roll',
          hint: 'Updates the moment a new card is calculated.',
          tone: currentCard && currentCard.result.successProbability >= 0.6 ? 'success' : 'accent',
        },
        {
          label: 'Dice Pool',
          value: currentCard
            ? `${currentCard.diceConfig.count}${currentCard.diceConfig.type}${currentCard.diceConfig.modifier === 0 ? '' : currentCard.diceConfig.modifier > 0 ? ` +${currentCard.diceConfig.modifier}` : ` ${currentCard.diceConfig.modifier}`}`
            : 'Choose Dice',
          hint: 'The active roll formula reflected in the live card.',
          tone: 'warning',
        },
        {
          label: 'Target DC',
          value: currentCard ? `DC ${currentCard.targetDC}` : 'Unset',
          hint: 'Difficulty anchor used for the current success curve.',
          tone: 'muted',
        },
        {
          label: 'Recent Cards',
          value: String(recentCards.length).padStart(2, '0'),
          hint: 'Local quick-access history for the last eight simulations.',
          tone: 'accent',
        },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-6">
          <ProbabilityCardForm onCalculate={handleCalculate} />
          <RecentSimulations cards={recentCards} onClear={handleClear} />
        </div>

        <div className="space-y-6">
          <LiveCalculation card={currentCard} />
          <SaveToEncounter card={currentCard} />
        </div>
      </div>
    </ProbabilityWorkbench>
  );
}
