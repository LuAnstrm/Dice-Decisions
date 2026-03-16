import type { Enums } from '@/types/database';

// Re-export the database enum for convenience
export type MarkerIconType = Enums<'marker_icon_type'>;

export const MARKER_CONFIG: Record<
  MarkerIconType,
  {
    label: string;
    icon: string;
    color: string;
    borderColor: string;
    badgeLabel: string;
  }
> = {
  combat: {
    label: 'Combat',
    icon: '⚔️',
    color: 'bg-red-600',
    borderColor: 'border-[var(--color-accent)]',
    badgeLabel: 'COMBAT',
  },
  quest: {
    label: 'Quest',
    icon: '❗',
    color: 'bg-amber-500',
    borderColor: 'border-[var(--color-accent)]',
    badgeLabel: 'QUEST',
  },
  shop: {
    label: 'Shop',
    icon: '🏪',
    color: 'bg-cyan-500',
    borderColor: 'border-[var(--color-accent)]',
    badgeLabel: 'SHOP',
  },
  danger: {
    label: 'Danger',
    icon: '☠️',
    color: 'bg-red-900',
    borderColor: 'border-[var(--color-accent)]',
    badgeLabel: 'DANGER',
  },
  safe: {
    label: 'Safe Zone',
    icon: '🏠',
    color: 'bg-emerald-500',
    borderColor: 'border-[var(--color-accent)]',
    badgeLabel: 'SAFE',
  },
};

export interface MapMarkerData {
  id: string;
  map_id: string;
  label: string;
  description: string | null;
  icon_type: MarkerIconType;
  pos_x: number;
  pos_y: number;
  is_visible_to_players: boolean;
  created_at: string;
}

export interface MapData {
  id: string;
  campaign_id: string;
  name: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  markers: MapMarkerData[];
}

export interface MapViewState {
  scale: number;
  translateX: number;
  translateY: number;
  isDragging: boolean;
}

export interface MarkerFormData {
  label: string;
  description: string;
  icon_type: MarkerIconType;
  pos_x: number;
  pos_y: number;
  is_visible_to_players: boolean;
}

export interface MapUploadFormData {
  name: string;
  file: File | null;
}
