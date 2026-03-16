import type { DiceType, DiceConfig, ProbabilityResult } from '@/types/probability';
import { calculateMean, calculateStandardDeviation } from './distributions';

export function getDiceMax(type: DiceType): number {
  const lookup: Record<DiceType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
  };
  return lookup[type];
}

export function getDiceRange(config: DiceConfig): { min: number; max: number } {
  return {
    min: config.count + config.modifier,
    max: config.count * getDiceMax(config.type) + config.modifier,
  };
}

export function calculateSingleDieDistribution(diceMax: number): Map<number, number> {
  const dist = new Map<number, number>();
  const prob = 1 / diceMax;
  for (let i = 1; i <= diceMax; i++) {
    dist.set(i, prob);
  }
  return dist;
}

export function convolveDistributions(
  dist1: Map<number, number>,
  dist2: Map<number, number>,
): Map<number, number> {
  const result = new Map<number, number>();
  for (const [v1, p1] of dist1) {
    for (const [v2, p2] of dist2) {
      const sum = v1 + v2;
      result.set(sum, (result.get(sum) ?? 0) + p1 * p2);
    }
  }
  return result;
}

export function calculateDiceDistribution(config: DiceConfig): Map<number, number> {
  if (config.count < 1) {
    throw new Error('Dice count must be at least 1');
  }

  const diceMax = getDiceMax(config.type);
  let dist = calculateSingleDieDistribution(diceMax);

  for (let i = 1; i < config.count; i++) {
    dist = convolveDistributions(dist, calculateSingleDieDistribution(diceMax));
  }

  // Apply modifier by shifting all keys
  if (config.modifier !== 0) {
    const shifted = new Map<number, number>();
    for (const [value, prob] of dist) {
      shifted.set(value + config.modifier, prob);
    }
    dist = shifted;
  }

  return dist;
}

export function calculateSuccessProbability(
  config: DiceConfig,
  targetDC: number,
): ProbabilityResult {
  const dist = calculateDiceDistribution(config);
  const range = getDiceRange(config);
  const mean = calculateMean(dist);
  const stdDev = calculateStandardDeviation(dist, mean);

  const isSingleD20 = config.count === 1 && config.type === 'd20';

  // Calculate raw success probability (sum of P where value >= DC)
  let successProbability = 0;
  for (const [value, prob] of dist) {
    if (value >= targetDC) {
      successProbability += prob;
    }
  }

  let critFailProb = 0;
  let critSuccessProb = 0;

  if (isSingleD20) {
    critFailProb = 0.05; // Natural 1
    critSuccessProb = 0.05; // Natural 20

    // Natural 1 always fails: if 1 + modifier >= DC, remove that success
    const nat1Value = 1 + config.modifier;
    if (nat1Value >= targetDC) {
      successProbability -= 1 / 20;
    }

    // Natural 20 always succeeds: if 20 + modifier < DC, add that success
    const nat20Value = 20 + config.modifier;
    if (nat20Value < targetDC) {
      successProbability += 1 / 20;
    }
  }

  // Clamp to [0, 1]
  successProbability = Math.max(0, Math.min(1, successProbability));

  // Convert distribution Map to sorted array
  const distribution = Array.from(dist.entries())
    .map(([value, probability]) => ({ value, probability }))
    .sort((a, b) => a.value - b.value);

  return {
    successProbability,
    critSuccessProb,
    critFailProb,
    distribution,
    mean,
    standardDeviation: stdDev,
    min: range.min,
    max: range.max,
  };
}
