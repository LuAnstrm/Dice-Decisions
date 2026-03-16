'use client';

import { ProbabilityBar } from '@/components/shared/probability-bar';
import type { ProbabilityCardData } from '@/types/probability';

interface LiveCalculationProps {
  card: ProbabilityCardData | null;
}

function getDescriptor(probability: number): string {
  const pct = probability * 100;
  if (pct === 0) return 'Impossible';
  if (pct <= 15) return 'Nearly Impossible';
  if (pct <= 30) return 'Unlikely';
  if (pct <= 50) return 'Likely Success';
  if (pct <= 70) return 'Good Chance';
  if (pct <= 90) return 'Very Likely';
  if (pct < 100) return 'Almost Certain';
  return 'Guaranteed';
}

function formatDiceNotation(card: ProbabilityCardData): string {
  const { count, type, modifier } = card.diceConfig;
  const diceNum = type.replace('d', '').toUpperCase();
  let notation = `${count}D${diceNum}`;
  if (modifier > 0) notation += ` + ${modifier}`;
  else if (modifier < 0) notation += ` - ${Math.abs(modifier)}`;
  return notation;
}

function getStatBreakdown(card: ProbabilityCardData) {
  const isSingleD20 = card.diceConfig.count === 1 && card.diceConfig.type === 'd20';
  const dc = card.targetDC;
  const mod = card.diceConfig.modifier;

  if (isSingleD20) {
    // Fail range: 2 to (dc - mod - 1), Success range: (dc - mod) to 19
    const failLow = 2 + mod;
    const failHigh = dc - 1;
    const succLow = dc;
    const succHigh = 19 + mod;
    const failPct = Math.max(0, Math.min(18, failHigh - failLow + 1)) * 5;
    const succPct = Math.max(0, Math.min(18, succHigh - succLow + 1)) * 5;
    return [
      { label: 'Nat 1', value: '5%', color: 'text-red-400' },
      { label: `${failLow}-${failHigh}`, value: `${failPct}%`, color: 'text-slate-300' },
      { label: `${succLow}-${succHigh}`, value: `${succPct}%`, color: 'text-emerald-400' },
      { label: 'Nat 20', value: '5%', color: 'text-[#7c3aed]' },
    ];
  }

  const successPct = Math.round(card.result.successProbability * 100);
  return [
    { label: 'Fail', value: `${100 - successPct}%`, color: 'text-slate-300' },
    { label: 'Success', value: `${successPct}%`, color: 'text-emerald-400' },
    { label: 'Mean', value: card.result.mean.toFixed(1), color: 'text-slate-300' },
    { label: 'Std Dev', value: card.result.standardDeviation.toFixed(2), color: 'text-slate-300' },
  ];
}

export function LiveCalculation({ card }: LiveCalculationProps) {
  if (!card) {
    return (
      <div className="rounded-xl border border-border-default bg-[#111119] p-7 shadow-2xl">
        <p className="text-center text-slate-500 py-12">
          Configure a roll above to see probabilities
        </p>
      </div>
    );
  }

  const { result } = card;
  const isSingleD20 = card.diceConfig.count === 1 && card.diceConfig.type === 'd20';
  const successPct = result.successProbability * 100;
  const critFailPct = result.critFailProb * 100;
  const critSuccPct = result.critSuccessProb * 100;

  const segments = isSingleD20
    ? [
        { percentage: critFailPct, color: 'rgba(239, 68, 68, 0.8)' },
        { percentage: Math.max(0, 100 - successPct - critFailPct), color: '#1e293b' },
        { percentage: Math.max(0, successPct - critSuccPct), color: 'rgba(16, 185, 129, 0.8)' },
        { percentage: critSuccPct, color: '#7c3aed' },
      ]
    : [
        { percentage: 100 - successPct, color: '#1e293b' },
        { percentage: successPct, color: 'rgba(16, 185, 129, 0.8)' },
      ];

  const stats = getStatBreakdown(card);

  return (
    <div className="relative rounded-xl border border-border-default bg-[#111119] p-7 shadow-2xl">
      {/* Header row */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-sans text-xl font-semibold text-slate-100 mb-2">
            {card.actionName}
          </h3>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] text-[10px] font-mono font-bold tracking-tighter">
            {formatDiceNotation(card)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Target</p>
          <p className="font-mono text-xl font-bold text-slate-100">DC {card.targetDC}</p>
        </div>
      </div>

      {/* Success probability */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
          Success Probability
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-6xl font-bold text-amber-400">
            {Math.round(successPct)}%
          </span>
          <span className="text-slate-500 text-sm font-medium italic">
            {getDescriptor(result.successProbability)}
          </span>
        </div>
      </div>

      {/* Probability bar */}
      <div className="mb-10">
        <ProbabilityBar segments={segments} height={16} className="border border-white/5 rounded-full" />
        {isSingleD20 && (
          <div className="flex justify-between mt-3 px-1">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-red-500">Crit Fail</span>
              <span className="font-mono text-xs text-slate-300">5%</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase font-bold text-[#7c3aed]">Crit Succ</span>
              <span className="font-mono text-xs text-slate-300">5%</span>
            </div>
          </div>
        )}
      </div>

      {/* Outcome breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border-default bg-surface-overlay/50 p-3 text-center"
          >
            <p className="text-[8px] uppercase font-bold text-slate-500 mb-1">{stat.label}</p>
            <p className={`font-mono text-sm font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
