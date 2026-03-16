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
    <div className="bg-[#0f0f23] border border-white/5 rounded-xl p-6 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <Dices className="w-5 h-5 text-[#7c3aed]" />
        <h2 className="text-xl font-bold text-white">Probability Check</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
            Dice Type
          </label>
          <select
            value={diceType}
            onChange={(e) => setDiceType(e.target.value)}
            className="w-full bg-[#16161f] border border-white/10 text-white rounded-lg px-3 py-2 text-sm"
          >
            {['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
            Modifier
          </label>
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-[#16161f] border border-white/10 text-white rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
            Target DC
          </label>
          <input
            type="number"
            value={targetDC}
            onChange={(e) => setTargetDC(parseInt(e.target.value, 10) || 15)}
            className="w-full bg-[#16161f] border border-white/10 text-white rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
          Success Probability
        </p>
        <p className="text-5xl font-bold text-amber-400 mb-2">
          {probability}
          <span className="text-lg text-white/60 ml-2">Success</span>
        </p>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
          <div
            className="bg-red-500"
            style={{ width: `${Math.min(probability * 0.5, 50)}%` }}
          />
          <div className="bg-yellow-500 flex-1" />
          <div
            className="bg-green-500"
            style={{
              width: `${Math.max(100 - probability * 0.5, 50)}%`,
            }}
          />
        </div>
      </div>

      <Button className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white">
        Run Full Simulation
      </Button>
    </div>
  );
}
