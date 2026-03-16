export type ThemeId = 'fantasy' | 'scifi' | 'western' | 'eldritch' | 'steampunk';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  emoji: string;
  description: string;
  accentPrimary: string;
  accentSecondary: string;
  bgBase: string;
  bgElevated: string;
  bgSidebar: string;
  borderDefault: string;
  glowColor: string;
  backdropImage: string;
  themeFont: string | null;
}

export const themes: Record<ThemeId, ThemeConfig> = {
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy',
    emoji: '🏰',
    description: 'Arcane, magical, medieval vibes for your quest.',
    accentPrimary: '#7c3aed',
    accentSecondary: '#06b6d4',
    bgBase: '#0a0a0f',
    bgElevated: '#12121a',
    bgSidebar: '#0d0d14',
    borderDefault: '#1e1e2e',
    glowColor: 'rgba(124,58,237,0.15)',
    backdropImage: '/images/themes/fantasy-backdrop.jpg',
    themeFont: 'Almendra Display',
  },
  scifi: {
    id: 'scifi',
    name: 'Sci-Fi',
    emoji: '🚀',
    description: 'Neon, holographic, futuristic interface.',
    accentPrimary: '#06b6d4',
    accentSecondary: '#3b82f6',
    bgBase: '#080d14',
    bgElevated: '#0d1520',
    bgSidebar: '#0a1120',
    borderDefault: '#1a2535',
    glowColor: 'rgba(6,182,212,0.15)',
    backdropImage: '/images/themes/scifi-backdrop.jpg',
    themeFont: null,
  },
  western: {
    id: 'western',
    name: 'Western',
    emoji: '🤠',
    description: 'Dusty, rugged, weathered frontier feel.',
    accentPrimary: '#d97706',
    accentSecondary: '#a16207',
    bgBase: '#0f0b08',
    bgElevated: '#1a1208',
    bgSidebar: '#130e06',
    borderDefault: '#2a1f14',
    glowColor: 'rgba(217,119,6,0.15)',
    backdropImage: '/images/themes/western-backdrop.jpg',
    themeFont: 'Rye',
  },
  eldritch: {
    id: 'eldritch',
    name: 'Eldritch Horror',
    emoji: '👁️',
    description: 'Unsettling, Lovecraftian, cosmic terror.',
    accentPrimary: '#16a34a',
    accentSecondary: '#15803d',
    bgBase: '#080d08',
    bgElevated: '#0d150d',
    bgSidebar: '#0a100a',
    borderDefault: '#1a2e1a',
    glowColor: 'rgba(22,163,74,0.15)',
    backdropImage: '/images/themes/eldritch-backdrop.jpg',
    themeFont: null,
  },
  steampunk: {
    id: 'steampunk',
    name: 'Steampunk',
    emoji: '⚙️',
    description: 'Brass, gears, Victorian mechanical aesthetic.',
    accentPrimary: '#ca8a04',
    accentSecondary: '#a16207',
    bgBase: '#0d0a06',
    bgElevated: '#181208',
    bgSidebar: '#130e06',
    borderDefault: '#2e2414',
    glowColor: 'rgba(202,138,4,0.15)',
    backdropImage: '/images/themes/steampunk-backdrop.jpg',
    themeFont: null,
  },
};

export const DEFAULT_THEME: ThemeId = 'fantasy';

export const THEME_LIST = Object.values(themes);
