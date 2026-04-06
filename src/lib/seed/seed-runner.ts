// AppSchema seeding is intentionally disabled in local/no-DB mode.

export interface SeedResult {
  success: boolean;
  campaignId: string | null;
  npcCount: number;
  encounterCount: number;
  noteCount: number;
  scenarioCount: number;
  mapId: string | null;
  markerCount: number;
  characterId: string | null;
  errors: string[];
}

export function createAdminClient(): null {
  return null;
}

export async function runSeed(dmUserId: string): Promise<SeedResult> {
  return {
    success: false,
    campaignId: null,
    npcCount: 0,
    encounterCount: 0,
    noteCount: 0,
    scenarioCount: 0,
    mapId: null,
    markerCount: 0,
    characterId: null,
    errors: [
      `AppSchema seed is disabled. Skipped request for user ${dmUserId}.`,
    ],
  };
}
