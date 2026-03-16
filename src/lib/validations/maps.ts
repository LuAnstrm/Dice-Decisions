import { z } from 'zod';

export const MAX_MAP_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const mapUploadSchema = z.object({
  name: z
    .string()
    .min(1, 'Map name is required')
    .max(100, 'Map name must be 100 characters or fewer'),
});

export const markerSchema = z.object({
  label: z
    .string()
    .min(1, 'Label is required')
    .max(100, 'Label must be 100 characters or fewer'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or fewer')
    .optional()
    .or(z.literal('')),
  icon_type: z.enum(['combat', 'quest', 'shop', 'danger', 'safe']),
  pos_x: z.number().min(0).max(1),
  pos_y: z.number().min(0).max(1),
  is_visible_to_players: z.boolean(),
});

export const mapUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  sort_order: z.number().int().min(0).optional(),
});

export type MapUploadFormValues = z.infer<typeof mapUploadSchema>;
export type MarkerFormValues = z.infer<typeof markerSchema>;
export type MapUpdateFormValues = z.infer<typeof mapUpdateSchema>;
