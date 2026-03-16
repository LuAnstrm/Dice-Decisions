export const DICE_TYPES = [
  { type: 'd4' as const, label: 'D4', sides: 4 },
  { type: 'd6' as const, label: 'D6', sides: 6 },
  { type: 'd8' as const, label: 'D8', sides: 8 },
  { type: 'd10' as const, label: 'D10', sides: 10 },
  { type: 'd12' as const, label: 'D12', sides: 12 },
  { type: 'd20' as const, label: 'D20', sides: 20 },
  { type: 'd100' as const, label: 'D100', sides: 100 },
];

export const ABILITY_SCORES = [
  { key: 'strength' as const, label: 'Strength', abbreviation: 'STR' as const },
  { key: 'dexterity' as const, label: 'Dexterity', abbreviation: 'DEX' as const },
  { key: 'constitution' as const, label: 'Constitution', abbreviation: 'CON' as const },
  { key: 'intelligence' as const, label: 'Intelligence', abbreviation: 'INT' as const },
  { key: 'wisdom' as const, label: 'Wisdom', abbreviation: 'WIS' as const },
  { key: 'charisma' as const, label: 'Charisma', abbreviation: 'CHA' as const },
];

export const NPC_ROLES = [
  'Quest Giver',
  'Villain',
  'Merchant',
  'Guide',
  'Ally',
  'Neutral',
  'Rival',
] as const;

export const NOTE_TAGS = [
  { value: 'session-log', label: 'Session Log', color: '#22c55e' },
  { value: 'world-lore', label: 'World Lore', color: '#7c3aed' },
  { value: 'plot', label: 'Plot', color: '#7c3aed' },
  { value: 'dm-secret', label: 'DM Secret', color: '#ef4444' },
] as const;

export const ENCOUNTER_STATUSES = [
  'planned',
  'active',
  'completed',
] as const;

export const NPC_STATUSES = [
  'active',
  'deceased',
  'hidden',
] as const;

export const MARKER_ICON_TYPES = [
  { type: 'pin', label: 'Pin', icon: 'MapPin', color: '#ef4444' },
  { type: 'skull', label: 'Danger', icon: 'Skull', color: '#ef4444' },
  { type: 'home', label: 'Settlement', icon: 'Home', color: '#22c55e' },
  { type: 'sword', label: 'Combat', icon: 'Swords', color: '#eab308' },
  { type: 'treasure', label: 'Treasure', icon: 'Gem', color: '#ca8a04' },
  { type: 'quest', label: 'Quest', icon: 'ScrollText', color: '#7c3aed' },
] as const;

export const STATUS_BAR_ITEMS: Record<string, string[]> = {
  '/dashboard': ['SYSTEM_STATUS: NOMINAL', 'SESSION: ACTIVE', 'PLAYERS: 4', 'ENCOUNTERS: 7'],
  '/probability': ['CALC_ENGINE: v4.2', 'PRECISION: 10^-6', 'MODE: COMBINATORICS', 'SEED: 0x8F2A'],
  '/probability/bayes-analyzer': ['INFERENCE_MODE: LAPLACE_SMOOTHING_OFF', 'DUNGEON_BIAS: MINIMAL', 'ROGUE_BONUS: +2 PROFICIENCY'],
  '/campaign': ['INK_LEVEL: FULL', 'SCROLL_CONDITION: PRISTINE', 'SESSION_NOTES: AUTO_SAVE'],
  '/maps': ['SYNCED', 'MAP_VERSION: 1.0.4-BETA', 'GRID: 32px', 'OVERLAY_OPACITY: 0.8'],
  '/characters': ['LEVEL_CAP: 20', 'STAT_ROLLER: STANDARD_ARRAY', 'HP_CALC: AVERAGE'],
  '/settings': ['PREFERENCES: SAVED', 'THEME_ENGINE: CSS_VARS_V3', 'LATENCY: 12ms'],
};
