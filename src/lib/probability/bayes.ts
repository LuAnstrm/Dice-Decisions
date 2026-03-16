import type { BayesInput, BayesResult } from '@/types/probability';

export function getRiskLevel(posterior: number): 'low' | 'medium' | 'high' {
  if (posterior < 0.33) return 'low';
  if (posterior <= 0.66) return 'medium';
  return 'high';
}

export function calculatePosterior(input: BayesInput): BayesResult {
  // Edge cases
  if (input.prior === 0) {
    return { posterior: 0, priorTimesLikelihood: 0, marginal: 0, riskLevel: 'low' };
  }
  if (input.prior === 1) {
    return { posterior: 1, priorTimesLikelihood: input.likelihood, marginal: input.likelihood, riskLevel: 'high' };
  }

  const priorTimesLikelihood = input.likelihood * input.prior;
  const marginal = priorTimesLikelihood + input.marginalFalse * (1 - input.prior);

  if (marginal === 0) {
    throw new Error('Impossible evidence — this observation cannot occur under either hypothesis.');
  }

  const posterior = priorTimesLikelihood / marginal;

  return {
    posterior,
    priorTimesLikelihood,
    marginal,
    riskLevel: getRiskLevel(posterior),
  };
}

export function chainBayes(
  previousPosterior: number,
  newLikelihood: number,
  newMarginalFalse: number,
): BayesResult {
  return calculatePosterior({
    prior: previousPosterior,
    likelihood: newLikelihood,
    marginalFalse: newMarginalFalse,
  });
}
