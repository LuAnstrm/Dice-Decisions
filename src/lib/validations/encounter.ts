import { z } from 'zod';

export const enemySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  hp: z
    .number({ message: 'Must be a number' })
    .int('Must be a whole number')
    .min(0, 'HP cannot be negative'),
  ac: z
    .number({ message: 'Must be a number' })
    .int('Must be a whole number')
    .min(0, 'AC cannot be negative'),
  attack_bonus: z
    .number({ message: 'Must be a number' })
    .int('Must be a whole number'),
  damage_dice: z.string().min(1, 'Damage dice is required'),
});

export const encounterSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be under 100 characters'),
  description: z.string().optional(),
  difficulty_class: z
    .number({ message: 'Must be a number' })
    .int('Must be a whole number')
    .min(1, 'Minimum DC is 1')
    .max(30, 'Maximum DC is 30'),
  enemies: z.array(enemySchema),
  status: z.enum(['planned', 'active', 'completed']),
});

export type EncounterFormData = z.infer<typeof encounterSchema>;
export type EnemyEntry = z.infer<typeof enemySchema>;
