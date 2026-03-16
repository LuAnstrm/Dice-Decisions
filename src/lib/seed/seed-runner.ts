// =============================================================
// Seed Runner — Tower of Fate Campaign
// =============================================================
// Executes all seed data insertions in the correct FK order.
// Requires a Supabase admin client (SERVICE_ROLE_KEY) to bypass RLS.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  SEED_IDS,
  buildCampaign,
  buildNPCs,
  buildEncounters,
  buildNotes,
  buildBayesScenarios,
  buildMap,
  buildMapMarkers,
  buildDemoCharacter,
} from './tower-of-fate';

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

/**
 * Create a Supabase admin client that bypasses RLS.
 * Uses the SERVICE_ROLE_KEY for elevated access.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Run the Tower of Fate seed script.
 *
 * @param dmUserId - UUID of the user who will own the campaign (DM).
 *                   Also used as the author for notes and character owner.
 * @returns SeedResult summary
 */
export async function runSeed(dmUserId: string): Promise<SeedResult> {
  const supabase = createAdminClient();
  const errors: string[] = [];
  const result: SeedResult = {
    success: false,
    campaignId: null,
    npcCount: 0,
    encounterCount: 0,
    noteCount: 0,
    scenarioCount: 0,
    mapId: null,
    markerCount: 0,
    characterId: null,
    errors,
  };

  // ── Idempotency check ────────────────────────────────
  const { data: existing } = await supabase
    .from('campaigns')
    .select('id')
    .eq('id', SEED_IDS.campaign)
    .maybeSingle();

  if (existing) {
    return {
      ...result,
      success: false,
      errors: ['Tower of Fate campaign already exists. Seed is idempotent — skipping.'],
    };
  }

  // ── 1. Campaign ──────────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(buildCampaign(dmUserId))
      .select('id')
      .single();
    if (error) throw error;
    result.campaignId = data.id;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push(`Campaign insert failed: ${msg}`);
    return { ...result, errors };
  }

  // ── 2. NPCs ──────────────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('npcs')
      .insert(buildNPCs())
      .select('id');
    if (error) throw error;
    result.npcCount = data?.length ?? 0;
  } catch (e: unknown) {
    errors.push(`NPCs insert failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── 3. Encounters ────────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('encounters')
      .insert(buildEncounters())
      .select('id');
    if (error) throw error;
    result.encounterCount = data?.length ?? 0;
  } catch (e: unknown) {
    errors.push(`Encounters insert failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── 4. Notes ─────────────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert(buildNotes(dmUserId))
      .select('id');
    if (error) throw error;
    result.noteCount = data?.length ?? 0;
  } catch (e: unknown) {
    errors.push(`Notes insert failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── 5. Bayes Scenarios ───────────────────────────────
  try {
    const { data, error } = await supabase
      .from('bayes_scenarios')
      .insert(buildBayesScenarios())
      .select('id');
    if (error) throw error;
    result.scenarioCount = data?.length ?? 0;
  } catch (e: unknown) {
    errors.push(`Bayes scenarios insert failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── 6. Campaign Map ──────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('campaign_maps')
      .insert(buildMap())
      .select('id')
      .single();
    if (error) throw error;
    result.mapId = data.id;
  } catch (e: unknown) {
    errors.push(`Map insert failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── 7. Map Markers ───────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('map_markers')
      .insert(buildMapMarkers())
      .select('id');
    if (error) throw error;
    result.markerCount = data?.length ?? 0;
  } catch (e: unknown) {
    errors.push(`Map markers insert failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── 8. Demo Character ────────────────────────────────
  try {
    const { data, error } = await supabase
      .from('characters')
      .insert(buildDemoCharacter(dmUserId))
      .select('id')
      .single();
    if (error) throw error;
    result.characterId = data.id;
  } catch (e: unknown) {
    errors.push(`Character insert failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  result.success = errors.length === 0;
  return result;
}
