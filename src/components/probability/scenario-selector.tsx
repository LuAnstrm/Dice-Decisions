'use client';

import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BayesScenario } from '@/types/probability';

interface ScenarioSelectorProps {
  scenarios: BayesScenario[];
  selected: BayesScenario | null;
  onSelect: (scenario: BayesScenario | null) => void;
}

export function ScenarioSelector({ scenarios, selected, onSelect }: ScenarioSelectorProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white/5">
          <Image src="/images/icons/fantasy/eye-target.png" alt="" fill className="object-contain p-2 opacity-95" />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-[0.05em] text-[var(--color-text-muted)] font-semibold font-mono">
            Scenario
          </span>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Swap between guided examples or run a custom belief model.
          </p>
        </div>
      </div>
      <Select
        value={selected?.id ?? 'custom'}
        onValueChange={(val) => {
          if (val === 'custom') {
            onSelect(null);
          } else {
            const scenario = scenarios.find((s) => s.id === val);
            onSelect(scenario ?? null);
          }
        }}
      >
        <SelectTrigger className="w-full min-w-[260px] bg-black/25 border-[var(--color-border)] text-[var(--color-text-primary)] sm:ml-auto sm:w-[340px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {scenarios.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.title}
            </SelectItem>
          ))}
          <SelectItem value="custom">Custom Scenario</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
