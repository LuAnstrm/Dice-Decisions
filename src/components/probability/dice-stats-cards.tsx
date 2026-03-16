'use client';

import { BarChart3, Percent, Zap } from 'lucide-react';
import { StatDisplay } from '@/components/shared/stat-display';
import { calculateMean, calculateVariance, calculateStandardDeviation, calculateCDF, compareDelta } from '@/lib/probability/distributions';
import type { DiceConfig } from '@/types/probability';

interface DiceStatsCardsProps {
  primaryDistribution: Map<number, number>;
  comparisonDistribution?: Map<number, number>;
  primaryConfig: DiceConfig;
  comparisonConfig?: DiceConfig;
}

export function DiceStatsCards({
  primaryDistribution,
  comparisonDistribution,
  primaryConfig,
  comparisonConfig,
}: DiceStatsCardsProps) {
  const mean = calculateMean(primaryDistribution);
  const stdDev = calculateStandardDeviation(primaryDistribution, mean);
  const threshold = Math.ceil(mean);
  const cumulativeAbove = 1 - calculateCDF(primaryDistribution, threshold - 1);

  const delta = comparisonDistribution
    ? compareDelta(primaryDistribution, comparisonDistribution)
    : null;

  return (
    <div className="grid grid-cols-1 gap-4 self-start sm:grid-cols-3 xl:grid-cols-1">
      <StatDisplay
        icon={BarChart3}
        color="#a855f7"
        value={mean.toFixed(4)}
        label="Mean Variance"
        subtitle={`Standard deviation: ${stdDev.toFixed(4)}`}
      />
      <StatDisplay
        icon={Percent}
        color="#22c55e"
        value={`${(cumulativeAbove * 100).toFixed(2)}%`}
        label={`Probability of ${threshold}+`}
        subtitle="Cumulative distribution peak"
      />
      {delta ? (
        <StatDisplay
          icon={Zap}
          color="#eab308"
          value={`${delta.meanDelta >= 0 ? '+' : ''}${delta.meanDelta.toFixed(1)}`}
          label="Comparison Delta"
          subtitle={`Variance delta: ${delta.varianceDelta >= 0 ? '+' : ''}${delta.varianceDelta.toFixed(2)}`}
        />
      ) : (
        <StatDisplay
          icon={Zap}
          color="#475569"
          value="--"
          label="Comparison Delta"
          subtitle="Enable comparison to see delta"
        />
      )}
    </div>
  );
}
