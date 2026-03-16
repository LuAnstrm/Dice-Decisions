'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RpgCard } from '@/components/shared/rpg-card';
import { ProbabilityBar } from '@/components/shared/probability-bar';
import type { BayesInput, BayesResult } from '@/types/probability';

interface BayesFormulaProps {
  result: BayesResult;
  input: BayesInput;
}

export function BayesFormula({ result, input }: BayesFormulaProps) {
  const [expanded, setExpanded] = useState(false);

  const priorTimesLikelihood = input.likelihood * input.prior;
  const falsePositive = input.marginalFalse * (1 - input.prior);
  const marginal = priorTimesLikelihood + falsePositive;

  // Evidence weight bar segments
  const tpPercent = marginal > 0 ? (priorTimesLikelihood / marginal) * 100 : 0;
  const fpPercent = marginal > 0 ? (falsePositive / marginal) * 100 : 0;

  return (
    <div className="space-y-4">
      <RpgCard variant="default">
        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
          Theorem Breakdown
        </p>

        <div className="space-y-1 font-mono text-sm">
          <p className="text-(--color-text-secondary)">
            P(H|E) = <span className="text-(--color-accent)">{result.posterior.toFixed(3)}</span>
          </p>
          <p className="text-(--color-text-secondary)">
            P(H)P(E|H) = <span className="text-(--color-accent)">{priorTimesLikelihood.toFixed(3)}</span>
          </p>
          <p className="text-(--color-text-secondary)">
            P(E) = <span className="text-(--color-accent)">{marginal.toFixed(3)}</span>
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text-secondary)"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {expanded ? 'Hide' : 'Show'} full derivation
        </button>

        {expanded && (
          <div className="mt-3 space-y-1.5 rounded-lg bg-(--color-bg-base) p-3 font-mono text-xs text-(--color-text-secondary)">
            <p>P(H|E) = P(E|H) * P(H) / [P(E|H) * P(H) + P(E|~H) * P(~H)]</p>
            <p>
              P(H|E) = {input.likelihood.toFixed(2)} * {input.prior.toFixed(2)} / [{input.likelihood.toFixed(2)} * {input.prior.toFixed(2)} + {input.marginalFalse.toFixed(2)} * {(1 - input.prior).toFixed(2)}]
            </p>
            <p>
              P(H|E) = {priorTimesLikelihood.toFixed(3)} / [{priorTimesLikelihood.toFixed(3)} + {falsePositive.toFixed(3)}]
            </p>
            <p>
              P(H|E) = {priorTimesLikelihood.toFixed(3)} / {marginal.toFixed(3)}
            </p>
            <p>
              P(H|E) = <span className="text-(--color-accent)">{result.posterior.toFixed(3)}</span>
            </p>
          </div>
        )}
      </RpgCard>

      {/* Evidence Weight Bar */}
      <RpgCard variant="default">
        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
          Likelihood Distribution Scale
        </p>
        <ProbabilityBar
          segments={[
            { percentage: tpPercent, color: 'var(--color-accent)' },
            { percentage: fpPercent, color: '#ef4444' },
          ]}
          height={12}
          className="mb-2"
        />
        <div className="flex justify-between font-mono text-[10px] text-(--color-text-muted)">
          <span>True Positive: {priorTimesLikelihood.toFixed(3)}</span>
          <span>False Positive: {falsePositive.toFixed(3)}</span>
        </div>
      </RpgCard>
    </div>
  );
}
