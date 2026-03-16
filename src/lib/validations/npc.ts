import { z } from 'zod';

export const NPC_ROLES = [
  'quest_giver',
  'villain',
  'merchant',
  'guide',
  'mercenary',
] as const;

export const NPC_ROLE_LABELS: Record<(typeof NPC_ROLES)[number], string> = {
  quest_giver: 'Quest Giver',
  villain: 'Villain',
  merchant: 'Merchant',
  guide: 'Guide',
  mercenary: 'Mercenary',
};

export const NPC_STATUSES = ['active', 'deceased', 'hidden'] as const;

export const npcSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be under 100 characters'),
  race: z.string().optional(),
  role: z.enum(NPC_ROLES, { message: 'Select a role' }),
  description: z.string().optional(),
  hp: z
    .number({ message: 'Must be a number' })
    .int('Must be a whole number')
    .min(0, 'HP cannot be negative')
    .optional(),
  ac: z
    .number({ message: 'Must be a number' })
    .int('Must be a whole number')
    .min(0, 'AC cannot be negative')
    .optional(),
  attack_bonus: z
    .number({ message: 'Must be a number' })
    .int('Must be a whole number')
    .optional(),
  notes: z.string().optional(),
  status: z.enum(NPC_STATUSES),
  is_visible_to_players: z.boolean(),
});

export type NPCFormData = z.infer<typeof npcSchema>;
