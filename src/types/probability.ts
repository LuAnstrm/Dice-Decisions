export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export interface DiceConfig {
  type: DiceType;
  count: number;
  modifier: number;
}

export interface ProbabilityResult {
  successProbability: number;
  critSuccessProb: number;
  critFailProb: number;
  distribution: Array<{ value: number; probability: number }>;
  mean: number;
  standardDeviation: number;
  min: number;
  max: number;
}

export interface ProbabilityCardData {
  id: string;
  actionName: string;
  diceConfig: DiceConfig;
  targetDC: number;
  result: ProbabilityResult;
}

export interface BayesInput {
  prior: number;
  likelihood: number;
  marginalFalse: number;
}

export interface BayesResult {
  posterior: number;
  priorTimesLikelihood: number;
  marginal: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface BayesScenario {
  id: string;
  title: string;
  description: string;
  hypothesis: string;
  evidence: string;
  input: BayesInput;
  educationalText: string;
}
