'use client';

import { RpgCard } from '@/components/shared/rpg-card';
import type { BayesInput, BayesResult, BayesScenario } from '@/types/probability';

interface BayesTreeProps {
  input: BayesInput;
  result: BayesResult;
  scenario: BayesScenario | null;
}

export function BayesTree({ input, result, scenario }: BayesTreeProps) {
  const h = scenario?.hypothesis ?? 'H';
  const e = scenario?.evidence ?? 'E';

  const pH = input.prior;
  const pNotH = 1 - pH;
  const pEGivenH = input.likelihood;
  const pNotEGivenH = 1 - pEGivenH;
  const pEGivenNotH = input.marginalFalse;
  const pNotEGivenNotH = 1 - pEGivenNotH;

  // Joint probabilities
  const hAndE = pH * pEGivenH;
  const hAndNotE = pH * pNotEGivenH;
  const notHAndE = pNotH * pEGivenNotH;
  const notHAndNotE = pNotH * pNotEGivenNotH;

  return (
    <RpgCard variant="default">
      <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-semibold font-mono mb-4">
        Probability Tree
      </p>

      <div className="font-mono text-xs overflow-x-auto">
        {/* Root */}
        <div className="flex justify-center mb-6">
          <Node label="Start" value="" accent />
        </div>

        {/* Level 1 branches */}
        <div className="flex justify-center gap-1 mb-1">
          <BranchLabel text={`P(${h})=${pH.toFixed(2)}`} />
          <div className="w-32" />
          <BranchLabel text={`P(¬${h})=${pNotH.toFixed(2)}`} />
        </div>
        <div className="flex justify-between px-8 mb-6">
          <Node label={h} value={pH.toFixed(2)} highlighted />
          <Node label={`¬${h}`} value={pNotH.toFixed(2)} />
        </div>

        {/* Level 2 branches */}
        <div className="grid grid-cols-4 gap-2 mb-1 px-2">
          <BranchLabel text={`P(${e}|${h})=${pEGivenH.toFixed(2)}`} small />
          <BranchLabel text={`P(¬${e}|${h})=${pNotEGivenH.toFixed(2)}`} small />
          <BranchLabel text={`P(${e}|¬${h})=${pEGivenNotH.toFixed(2)}`} small />
          <BranchLabel text={`P(¬${e}|¬${h})=${pNotEGivenNotH.toFixed(2)}`} small />
        </div>
        <div className="grid grid-cols-4 gap-2 px-2">
          <LeafNode value={hAndE.toFixed(3)} highlighted label={`${h}∧${e}`} />
          <LeafNode value={hAndNotE.toFixed(3)} label={`${h}∧¬${e}`} />
          <LeafNode value={notHAndE.toFixed(3)} label={`¬${h}∧${e}`} />
          <LeafNode value={notHAndNotE.toFixed(3)} label={`¬${h}∧¬${e}`} />
        </div>
      </div>
    </RpgCard>
  );
}

function Node({
  label,
  value,
  highlighted,
  accent,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className="px-4 py-2 rounded-lg border text-center min-w-[80px]"
      style={{
        borderColor: accent
          ? 'var(--color-accent)'
          : highlighted
            ? '#22c55e'
            : 'var(--color-border)',
        backgroundColor: highlighted
          ? 'rgba(34, 197, 94, 0.08)'
          : accent
            ? 'rgba(var(--color-accent-rgb, 139, 92, 246), 0.08)'
            : 'var(--color-bg-base)',
      }}
    >
      <p className="text-[var(--color-text-primary)] font-semibold">{label}</p>
      {value && <p className="text-[var(--color-text-muted)]">{value}</p>}
    </div>
  );
}

function LeafNode({
  value,
  highlighted,
  label,
}: {
  value: string;
  highlighted?: boolean;
  label: string;
}) {
  return (
    <div
      className="px-2 py-2 rounded-lg border text-center"
      style={{
        borderColor: highlighted ? '#22c55e' : 'var(--color-border)',
        backgroundColor: highlighted ? 'rgba(34, 197, 94, 0.08)' : 'var(--color-bg-base)',
      }}
    >
      <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">{label}</p>
      <p
        className="font-bold"
        style={{ color: highlighted ? '#22c55e' : 'var(--color-text-secondary)' }}
      >
        {value}
      </p>
    </div>
  );
}

function BranchLabel({ text, small }: { text: string; small?: boolean }) {
  return (
    <span
      className={`text-[var(--color-text-muted)] text-center block ${small ? 'text-[9px]' : 'text-[10px]'}`}
    >
      {text}
    </span>
  );
}
