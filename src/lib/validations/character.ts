import { z } from 'zod';

const weaponSchema = z.object({
  name: z.string().min(1, 'Weapon name is required'),
  damage_dice: z.string().min(1, 'Damage dice is required'),
  modifier: z.number().int('Must be a whole number'),
  ability: z.enum(['str', 'dex']).default('str'),
});

const abilitySchema = z.object({
  name: z.string().min(1, 'Ability name is required'),
  usage: z.enum(['at_will', 'long_rest', 'short_rest']),
  description: z.string().min(1, 'Description is required'),
});

const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().int('Must be a whole number').min(1, 'At least 1'),
  weight: z.number().min(0).optional(),
});

export const characterSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be under 50 characters'),
  race: z.string().min(1, 'Race is required'),
  char_class: z.string().min(1, 'Class is required'),
  level: z
    .number({ message: 'Level is required' })
    .int('Must be a whole number')
    .min(1, 'Minimum level is 1')
    .max(20, 'Maximum level is 20')
    .default(1),
  strength: z
    .number({ message: 'Required' })
    .int()
    .min(1, 'Min 1')
    .max(30, 'Max 30')
    .default(10),
  dexterity: z
    .number({ message: 'Required' })
    .int()
    .min(1, 'Min 1')
    .max(30, 'Max 30')
    .default(10),
  constitution: z
    .number({ message: 'Required' })
    .int()
    .min(1, 'Min 1')
    .max(30, 'Max 30')
    .default(10),
  intelligence: z
    .number({ message: 'Required' })
    .int()
    .min(1, 'Min 1')
    .max(30, 'Max 30')
    .default(10),
  wisdom: z
    .number({ message: 'Required' })
    .int()
    .min(1, 'Min 1')
    .max(30, 'Max 30')
    .default(10),
  charisma: z
    .number({ message: 'Required' })
    .int()
    .min(1, 'Min 1')
    .max(30, 'Max 30')
    .default(10),
  hp_current: z
    .number({ message: 'HP current is required' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  hp_max: z
    .number({ message: 'HP max is required' })
    .int('Must be a whole number')
    .min(1, 'Minimum 1'),
  ac: z
    .number({ message: 'AC is required' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  speed: z
    .number({ message: 'Speed is required' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .default(30),
  weapons: z.array(weaponSchema).default([]),
  abilities: z.array(abilitySchema).max(4, 'Maximum 4 abilities').default([]),
  inventory: z.array(inventoryItemSchema).max(15, 'Maximum 15 items').default([]),
});

export type CharacterFormData = z.infer<typeof characterSchema>;
