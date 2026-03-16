'use client';

import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { RpgCard } from '@/components/shared/rpg-card';
import type { BayesInput, BayesScenario } from '@/types/probability';

interface BayesInputsProps {
  input: BayesInput;
  onChange: (input: BayesInput) => void;
  scenario: BayesScenario | null;
}

export function BayesInputs({ input, onChange, scenario }: BayesInputsProps) {
  const hypothesisLabel = scenario?.hypothesis ?? 'H';
  const evidenceLabel = scenario?.evidence ?? 'E';

  const sliders = [
    {
      key: 'prior' as const,
      label: `Prior Probability P(${hypothesisLabel})`,
      helper: scenario
        ? undefined
        : 'The initial probability before considering evidence.',
      value: input.prior,
    },
    {
      key: 'likelihood' as const,
      label: `Likelihood P(${evidenceLabel} | ${hypothesisLabel})`,
      helper: scenario
        ? undefined
        : 'How likely the evidence is if the hypothesis is true.',
      value: input.likelihood,
    },
    {
      key: 'marginalFalse' as const,
      label: `False Positive P(${evidenceLabel} | NOT ${hypothesisLabel})`,
      helper: scenario
        ? undefined
        : 'How likely the evidence is if the hypothesis is false.',
      value: input.marginalFalse,
    },
  ];

  return (
    <RpgCard
      variant="default"
      header={{
        title: 'Model Inputs',
        icon: (
          <div className="relative h-8 w-8 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white/5">
            <Image src="/images/icons/fantasy/magic-swirl.png" alt="" fill className="object-contain p-1.5 opacity-95" />
          </div>
        ),
      }}
      className="border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(15,18,24,0.95),rgba(10,12,18,0.98))]"
    >
      <div className="space-y-6">
        {sliders.map((s) => (
          <div key={s.key} className="rounded-[18px] border border-white/8 bg-black/18 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-(--color-text-secondary)">
                {s.label}
              </label>
              <span className="font-mono text-sm font-bold text-(--color-accent)">
                {Math.round(s.value * 100)}%
              </span>
            </div>
            <Slider
              value={[s.value * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => {
                const val = Array.isArray(value) ? value[0] ?? 0 : value;
                onChange({ ...input, [s.key]: val / 100 });
              }}
            />
            {s.helper && (
              <p className="mt-1.5 text-[11px] italic text-(--color-text-muted)">
                {s.helper}
              </p>
            )}
          </div>
        ))}
        {scenario && (
          <p className="border-t border-(--color-border) pt-3 text-[11px] italic text-(--color-text-muted)">
            {scenario.educationalText}
          </p>
        )}
      </div>
    </RpgCard>
  );
}
