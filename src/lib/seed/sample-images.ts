// =============================================================
// Sample Image References for Tower of Fate Seed Data
// =============================================================
// Checks public/images/ for user-provided files, falls back to
// theme backdrops and gradient placeholders.

export const SAMPLE_IMAGES = {
  /** Hero banner for the Tower of Fate campaign on the DM Dashboard */
  heroBanner: '/images/heroes/tower-banner.jpg',

  /** Fallback hero banner — Fantasy theme backdrop (always present from Phase 0.22) */
  heroBannerFallback: '/images/themes/fantasy-backdrop.jpg',

  /** Tower of Fate Level 1 map image */
  mapLevel1: '/images/maps/tower-of-fate-level-1.jpg',

  /**
   * NPC placeholder headers use gradient backgrounds derived from theme accent.
   * No image file needed — handled by the NPC card component (Phase 4).
   */
  npcPlaceholder: null,
} as const;

/**
 * Resolve image path with fallback logic.
 * For production use, check if the file exists before returning the primary path.
 * The seed runner uses the fallback unconditionally since user-provided files may not exist.
 */
export function resolveHeroBanner(): string {
  return SAMPLE_IMAGES.heroBannerFallback;
}

export function resolveMapImage(): string {
  return SAMPLE_IMAGES.mapLevel1;
}
