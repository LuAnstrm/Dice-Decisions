'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { RpgCard } from '@/components/shared/rpg-card';
import type { BayesResult, BayesScenario } from '@/types/probability';

interface BayesResultDisplayProps {
  result: BayesResult;
  scenario: BayesScenario | null;
  onChain?: () => void;
}

function getRiskConfig(level: 'low' | 'medium' | 'high') {
  switch (level) {
    case 'high':
      return { badgeClass: 'border border-red-500 bg-red-500/15 text-red-400', label: 'HIGH RISK — DISARM REQUIRED' };
    case 'medium':
      return { badgeClass: 'border border-amber-500 bg-amber-500/15 text-amber-400', label: 'MODERATE RISK — PROCEED WITH CAUTION' };
    case 'low':
      return { badgeClass: 'border border-emerald-500 bg-emerald-500/15 text-emerald-400', label: 'LOW RISK — LIKELY SAFE' };
  }
}

export function BayesResultDisplay({ result, scenario, onChain }: BayesResultDisplayProps) {
  const hypothesisLabel = scenario?.hypothesis ?? 'H';
  const evidenceLabel = scenario?.evidence ?? 'E';
  const risk = getRiskConfig(result.riskLevel);

  // Animated number
  const [displayValue, setDisplayValue] = useState(result.posterior * 100);
  const prevRef = useRef(result.posterior * 100);

  useEffect(() => {
    const target = result.posterior * 100;
    const start = prevRef.current;
    const diff = target - start;
    if (Math.abs(diff) < 0.01) {
      setDisplayValue(target);
      prevRef.current = target;
      return;
    }

    const duration = 300;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevRef.current = target;
      }
    }

    requestAnimationFrame(animate);
  }, [result.posterior]);

  return (
    <RpgCard variant="default" className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(17,20,28,0.95),rgba(10,12,18,0.98))]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
            Posterior Probability P({hypothesisLabel} | {evidenceLabel})
          </p>
          <p className="text-sm text-(--color-text-secondary)">
            Updated belief after processing the selected observation.
          </p>
        </div>
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <Image src="/images/icons/fantasy/third-eye.png" alt="" fill className="object-contain p-2.5 opacity-95" />
        </div>
      </div>

      <p className="mb-4 font-mono text-[92px] font-bold leading-none text-(--color-text-primary) [font-family:var(--font-display)]">
        {displayValue.toFixed(1)}%
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className={`inline-flex items-center rounded-md px-3 py-1.5 font-mono text-xs font-bold ${risk.badgeClass}`}>
          {risk.label}
        </div>

        <div className="rounded-full border border-white/8 bg-black/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-(--color-text-secondary)">
          Bayes Update Active
        </div>
      </div>

      <p className="text-xs leading-6 text-(--color-text-secondary)">
        The posterior is proportional to the prior multiplied by the likelihood, then normalized by total evidence mass.
      </p>

      {onChain && (
        <button
          onClick={onChain}
          className="mt-4 block font-mono text-xs text-(--color-accent) underline transition-colors"
        >
          &#8594; Use as New Prior
        </button>
      )}
    </RpgCard>
  );
}
