import { createServerClient } from '@supabase/ssr';
import type { Database, Tables } from '@/types/database';

/**
 * Get all NPCs for a campaign.
 * Filters by is_visible_to_players for non-DM users (optional parameter).
 */
export async function getCampaignNPCs(
  supabase: ReturnType<typeof createServerClient>,
  campaignId: string,
  isDM: boolean = true
): Promise<Tables<'npcs'>[]> {
  try {
    let query = supabase
      .from('npcs')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('name');

    // If player, only show NPCs marked as visible
    if (!isDM) {
      query = query.eq('is_visible_to_players', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getCampaignNPCs error:', error);
    return [];
  }
}

/**
 * Get a single NPC by ID.
 */
export async function getNPCById(
  supabase: ReturnType<typeof createServerClient>,
  npcId: string
): Promise<Tables<'npcs'> | null> {
  try {
    const { data, error } = await supabase
      .from('npcs')
      .select('*')
      .eq('id', npcId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getNPCById error:', error);
    return null;
  }
}

/**
 * Get all player notes for the current user in a campaign.
 */
export async function getPlayerNotes(
  supabase: ReturnType<typeof createServerClient>,
  campaignId: string,
  userId: string
): Promise<Tables<'player_notes'>[]> {
  try {
    const { data, error } = await supabase
      .from('player_notes')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getPlayerNotes error:', error);
    return [];
  }
}

/**
 * Get a single player note by ID.
 */
export async function getPlayerNoteById(
  supabase: ReturnType<typeof createServerClient>,
  noteId: string
): Promise<Tables<'player_notes'> | null> {
  try {
    const { data, error } = await supabase
      .from('player_notes')
      .select('*')
      .eq('id', noteId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getPlayerNoteById error:', error);
    return null;
  }
}
