export function calculateMean(distribution: Map<number, number>): number {
  let mean = 0;
  for (const [value, prob] of distribution) {
    mean += value * prob;
  }
  return mean;
}

export function calculateVariance(distribution: Map<number, number>, mean: number): number {
  let variance = 0;
  for (const [value, prob] of distribution) {
    variance += (value - mean) ** 2 * prob;
  }
  return variance;
}

export function calculateStandardDeviation(distribution: Map<number, number>, mean: number): number {
  return Math.sqrt(calculateVariance(distribution, mean));
}

export function calculateCDF(distribution: Map<number, number>, targetValue: number): number {
  let cumulative = 0;
  for (const [value, prob] of distribution) {
    if (value <= targetValue) {
      cumulative += prob;
    }
  }
  return cumulative;
}

function getMode(distribution: Map<number, number>): number {
  let maxProb = -1;
  let mode = 0;
  for (const [value, prob] of distribution) {
    if (prob > maxProb) {
      maxProb = prob;
      mode = value;
    }
  }
  return mode;
}

export function compareDelta(
  dist1: Map<number, number>,
  dist2: Map<number, number>,
): { meanDelta: number; varianceDelta: number; modeDelta: number } {
  const mean1 = calculateMean(dist1);
  const mean2 = calculateMean(dist2);
  const var1 = calculateVariance(dist1, mean1);
  const var2 = calculateVariance(dist2, mean2);
  const mode1 = getMode(dist1);
  const mode2 = getMode(dist2);

  return {
    meanDelta: mean1 - mean2,
    varianceDelta: var1 - var2,
    modeDelta: mode1 - mode2,
  };
}
