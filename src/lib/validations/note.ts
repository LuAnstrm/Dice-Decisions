import { z } from 'zod';

export const noteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be under 200 characters'),
  content: z.string(),
  tag: z.enum(['session_log', 'world_lore', 'plot', 'dm_secret']),
  is_visible_to_players: z.boolean(),
  session_number: z.number().int('Must be a whole number').optional(),
});

export type NoteFormData = z.infer<typeof noteSchema>;
