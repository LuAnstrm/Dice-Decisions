import { z } from 'zod';

export const probabilityCardSchema = z.object({
  actionName: z
    .string()
    .min(1, 'Action name is required')
    .max(50, 'Action name must be under 50 characters'),
  diceType: z.enum(['d4', 'd6', 'd8', 'd10', 'd12', 'd20'], {
    message: 'Select a dice type',
  }),
  diceCount: z
    .number({ message: 'Dice count is required' })
    .int('Must be a whole number')
    .min(1, 'At least 1 die')
    .max(10, 'Maximum 10 dice'),
  modifier: z
    .number({ message: 'Modifier is required' })
    .int('Must be a whole number')
    .min(-20, 'Minimum modifier is -20')
    .max(20, 'Maximum modifier is +20'),
  targetDC: z
    .number({ message: 'Target DC is required' })
    .int('Must be a whole number')
    .min(1, 'Minimum DC is 1')
    .max(40, 'Maximum DC is 40'),
});

export const bayesInputSchema = z.object({
  prior: z.number().min(0, 'Minimum is 0').max(1, 'Maximum is 1'),
  likelihood: z.number().min(0, 'Minimum is 0').max(1, 'Maximum is 1'),
  marginalFalse: z.number().min(0, 'Minimum is 0').max(1, 'Maximum is 1'),
});

export type ProbabilityCardFormData = z.infer<typeof probabilityCardSchema>;
export type BayesInputFormData = z.infer<typeof bayesInputSchema>;
