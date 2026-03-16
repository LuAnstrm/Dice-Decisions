'use client';

import { useState, useMemo, useCallback } from 'react';
import { DiceSelector } from '@/components/probability/dice-selector';
import { DistributionChart } from '@/components/probability/distribution-chart';
import { DiceStatsCards } from '@/components/probability/dice-stats-cards';
import { ProbabilityWorkbench } from '@/components/probability/probability-workbench';
import { calculateDiceDistribution, getDiceMax } from '@/lib/probability/dice-math';
import type { DiceConfig } from '@/types/probability';

export default function DiceVisualizerPage() {
  const [primaryConfig, setPrimaryConfig] = useState<DiceConfig>({
    type: 'd6',
    count: 2,
    modifier: 0,
  });
  const [comparisonConfig, setComparisonConfig] = useState<DiceConfig | null>(null);

  const primaryDist = useMemo(() => calculateDiceDistribution(primaryConfig), [primaryConfig]);
  const comparisonDist = useMemo(
    () => (comparisonConfig ? calculateDiceDistribution(comparisonConfig) : undefined),
    [comparisonConfig],
  );

  const primaryData = useMemo(
    () =>
      Array.from(primaryDist.entries())
        .map(([value, probability]) => ({ value, probability }))
        .sort((a, b) => a.value - b.value),
    [primaryDist],
  );

  const comparisonData = useMemo(
    () =>
      comparisonDist
        ? Array.from(comparisonDist.entries())
            .map(([value, probability]) => ({ value, probability }))
            .sort((a, b) => a.value - b.value)
        : undefined,
    [comparisonDist],
  );

  const primaryTotalCombos = Math.pow(getDiceMax(primaryConfig.type), primaryConfig.count);
  const comparisonTotalCombos = comparisonConfig
    ? Math.pow(getDiceMax(comparisonConfig.type), comparisonConfig.count)
    : undefined;

  const handleComparisonToggle = useCallback(() => {
    setComparisonConfig((prev) =>
      prev ? null : { type: 'd8', count: 2, modifier: 0 },
    );
  }, []);

  function formatNotation(config: DiceConfig): string {
    const num = config.type.replace('d', '');
    return `${config.count}d${num}`;
  }

  return (
    <ProbabilityWorkbench
      section="Dice Visualizer"
      title="Read the full shape of a roll before anyone picks up the dice."
      description="Compare pools, inspect spread, and visualize how probability mass moves across outcomes with the denser chart-first treatment from the supplied visual references."
      moduleDescription="Compare dice pools, inspect outcome spread, and see how likely each total is before you commit to a roll."
      artPath="/images/icons/fantasy/rolling-dices.png"
      stampPath="/images/icons/fantasy/chart.png"
      stats={[
        {
          label: 'Primary Pool',
          value: formatNotation(primaryConfig).toUpperCase(),
          hint: 'Baseline distribution shown in the main accent curve.',
          tone: 'accent',
        },
        {
          label: 'Compare Pool',
          value: comparisonConfig ? formatNotation(comparisonConfig).toUpperCase() : 'Disabled',
          hint: 'Optional overlay rendered as the dashed comparison curve.',
          tone: comparisonConfig ? 'warning' : 'muted',
        },
        {
          label: 'Combinations',
          value: primaryTotalCombos.toLocaleString(),
          hint: 'Exact size of the currently selected sample space.',
          tone: 'success',
        },
        {
          label: 'Curve Points',
          value: String(primaryData.length).padStart(2, '0'),
          hint: 'Number of distinct summed outcomes in the active series.',
          tone: 'accent',
        },
      ]}
    >
      <div className="space-y-6">
        <DiceSelector
          primaryConfig={primaryConfig}
          comparisonConfig={comparisonConfig}
          onPrimaryChange={setPrimaryConfig}
          onComparisonChange={setComparisonConfig}
          onComparisonToggle={handleComparisonToggle}
        />

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.18fr)_360px]">
          <DistributionChart
            primaryData={primaryData}
            comparisonData={comparisonData}
            primaryLabel={formatNotation(primaryConfig)}
            comparisonLabel={comparisonConfig ? formatNotation(comparisonConfig) : undefined}
            totalCombinations={primaryTotalCombos}
            comparisonTotalCombinations={comparisonTotalCombos}
          />

          <DiceStatsCards
            primaryDistribution={primaryDist}
            comparisonDistribution={comparisonDist}
            primaryConfig={primaryConfig}
            comparisonConfig={comparisonConfig ?? undefined}
          />
        </div>
      </div>
    </ProbabilityWorkbench>
  );
}
