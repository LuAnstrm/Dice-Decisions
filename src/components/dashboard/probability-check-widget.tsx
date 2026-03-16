'use client';

import { useState } from 'react';
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProbabilityCheckWidget() {
  const [diceType, setDiceType] = useState('d20');
  const [modifier, setModifier] = useState(0);
  const [targetDC, setTargetDC] = useState(15);

  // Calculate success probability
  // TODO: Replace with Phase 3 probability engine
  const calculateSuccessProbability = (): number => {
    const dieSize = parseInt(diceType.substring(1), 10);
    const neededRoll = targetDC - modifier;
    if (neededRoll <= 1) return 100;
    if (neededRoll > dieSize) return 0;
    return Math.round(((dieSize - neededRoll + 1) / dieSize) * 100);
  };

  const probability = calculateSuccessProbability();

  return (
    <div className="card-base p-6 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <Dices className="w-5 h-5 text-[var(--color-accent)]" />
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Probability Check</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block">
            Dice Type
          </label>
          <select
            value={diceType}
            onChange={(e) => setDiceType(e.target.value)}
            className="w-full bg-[var(--color-surface-input)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
          >
            {['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block">
            Modifier
          </label>
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-[var(--color-surface-input)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block">
            Target DC
          </label>
          <input
            type="number"
            value={targetDC}
            onChange={(e) => setTargetDC(parseInt(e.target.value, 10) || 15)}
            className="w-full bg-[var(--color-surface-input)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
          Success Probability
        </p>
        <p className="text-5xl font-bold text-amber-400 font-mono mb-2">
          {probability}%
          <span className="text-lg text-[var(--color-text-muted)] ml-2 font-sans font-normal">Success</span>
        </p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
            style={{ width: `${probability}%` }}
          />
        </div>
      </div>

      <Button className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white shadow-lg shadow-[var(--color-glow)]">
        Run Full Simulation
      </Button>
    </div>
  );
}
