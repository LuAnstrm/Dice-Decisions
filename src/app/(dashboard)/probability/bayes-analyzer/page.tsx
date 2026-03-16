'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { ScenarioSelector } from '@/components/probability/scenario-selector';
import { BayesInputs } from '@/components/probability/bayes-inputs';
import { BayesResultDisplay } from '@/components/probability/bayes-result';
import { BayesFormula } from '@/components/probability/bayes-formula';
import { SystemLog } from '@/components/probability/system-log';
import { BayesTree } from '@/components/probability/bayes-tree';
import { ProbabilityWorkbench } from '@/components/probability/probability-workbench';
import { calculatePosterior } from '@/lib/probability/bayes';
import { BAYES_SCENARIOS } from '@/lib/probability/constants';
import type { BayesInput, BayesResult, BayesScenario } from '@/types/probability';

export default function BayesAnalyzerPage() {
  const defaultScenario = BAYES_SCENARIOS[0]!;
  const [selectedScenario, setSelectedScenario] = useState<BayesScenario | null>(
    defaultScenario,
  );
  const [input, setInput] = useState<BayesInput>(defaultScenario.input);
  const [logEntries, setLogEntries] = useState<string[]>([
    'SYSTEM INITIALIZED',
    'LOADING PRIOR DISTRIBUTION...',
    `SCENARIO LOADED: ${defaultScenario.title.toUpperCase()}`,
  ]);
  const [chainHistory, setChainHistory] = useState<
    Array<{ round: number; prior: number; posterior: number }>
  >([]);
  const roundRef = useRef(0);

  const result: BayesResult = useMemo(() => {
    try {
      return calculatePosterior(input);
    } catch {
      return { posterior: 0, priorTimesLikelihood: 0, marginal: 0, riskLevel: 'low' as const };
    }
  }, [input]);

  const handleScenarioSelect = useCallback((scenario: BayesScenario | null) => {
    setSelectedScenario(scenario);
    if (scenario) {
      setInput(scenario.input);
      setChainHistory([]);
      roundRef.current = 0;
      setLogEntries((prev) => [
        ...prev,
        `SCENARIO LOADED: ${scenario.title.toUpperCase()}`,
        `OBSERVATION DETECTED: [${scenario.evidence.toUpperCase()}]`,
        'UPDATING BELIEF SYSTEM...',
      ]);
    }
  }, []);

  const handleInputChange = useCallback(
    (newInput: BayesInput) => {
      setInput(newInput);
      setLogEntries((prev) => [
        ...prev,
        'APPLYING BAYES THEOREM...',
        `POSTERIOR PROBABILITY UPDATED: ${calculatePosterior(newInput).posterior.toFixed(3)}`,
      ]);
    },
    [],
  );

  const handleChain = useCallback(() => {
    roundRef.current += 1;
    const round = roundRef.current;
    setChainHistory((prev) => [
      ...prev,
      { round, prior: input.prior, posterior: result.posterior },
    ]);
    setInput((prev) => ({
      ...prev,
      prior: result.posterior,
      likelihood: 0.5,
      marginalFalse: 0.5,
    }));
    setLogEntries((prev) => [
      ...prev,
      `CHAINING: POSTERIOR ${result.posterior.toFixed(3)} -> NEW PRIOR`,
      'RESET LIKELIHOOD & FALSE POSITIVE TO 50%',
      `CHAIN ROUND ${round + 1} STARTED`,
    ]);
  }, [input.prior, result.posterior]);

  const handleResetChain = useCallback(() => {
    setChainHistory([]);
    roundRef.current = 0;
    if (selectedScenario) {
      setInput(selectedScenario.input);
      setLogEntries((prev) => [...prev, 'CHAIN RESET — ORIGINAL VALUES RESTORED']);
    }
  }, [selectedScenario]);

  return (
    <ProbabilityWorkbench
      section="Bayes Analyzer"
      title="Interrogate evidence chains with a live posterior readout."
      description={
        selectedScenario?.description ??
        'Shift priors, test false positives, and examine how each clue changes the final belief state in real time.'
      }
      moduleDescription="Update a prior belief with new evidence and watch the posterior change step by step."
      artPath="/images/icons/fantasy/all-seeing-eye.png"
      stampPath="/images/icons/fantasy/tree-face.png"
      toolbar={
        <ScenarioSelector
          scenarios={BAYES_SCENARIOS}
          selected={selectedScenario}
          onSelect={handleScenarioSelect}
        />
      }
      stats={[
        {
          label: 'Posterior',
          value: `${(result.posterior * 100).toFixed(1)}%`,
          hint: 'Belief after updating the current prior with the selected evidence.',
          tone: result.riskLevel === 'high' ? 'warning' : result.riskLevel === 'medium' ? 'accent' : 'success',
        },
        {
          label: 'Risk Band',
          value: result.riskLevel.toUpperCase(),
          hint: 'Derived from the live posterior threshold in the analyzer.',
          tone: result.riskLevel === 'high' ? 'warning' : result.riskLevel === 'medium' ? 'accent' : 'success',
        },
        {
          label: 'Prior',
          value: `${Math.round(input.prior * 100)}%`,
          hint: 'Base-rate belief before the evidence is applied.',
          tone: 'muted',
        },
        {
          label: 'Chain Rounds',
          value: String(chainHistory.length).padStart(2, '0'),
          hint: 'Sequential posterior-to-prior handoffs recorded this session.',
          tone: 'accent',
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <BayesInputs
            input={input}
            onChange={handleInputChange}
            scenario={selectedScenario}
          />
          <SystemLog entries={logEntries} />
        </div>

        <div className="space-y-6">
          <BayesResultDisplay
            result={result}
            scenario={selectedScenario}
            onChain={handleChain}
          />
          <BayesFormula result={result} input={input} />
          <BayesTree input={input} result={result} scenario={selectedScenario} />
        </div>
      </div>

      {chainHistory.length > 0 && (
        <div className="mt-6 rounded-[22px] border border-[var(--color-border)] bg-black/20 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)] font-mono">
              Chain History
            </p>
            <button
              onClick={handleResetChain}
              className="text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Reset Chain
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {chainHistory.map((ch, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full border border-white/8 bg-black/15 px-3 py-1.5">
                <span className="text-[var(--color-text-muted)]">R{ch.round}: {(ch.prior * 100).toFixed(0)}%</span>
                <span style={{ color: 'var(--color-accent)' }}>→</span>
                <span style={{ color: 'var(--color-accent)' }}>{(ch.posterior * 100).toFixed(0)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </ProbabilityWorkbench>
  );
}
