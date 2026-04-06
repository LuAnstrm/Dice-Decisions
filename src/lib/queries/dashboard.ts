import type { Tables } from '@/types/schema';

type DataClient = any;

interface CampaignStats {
  playerCount: number;
  npcCount: number;
  encounterCount: number;
  avgDC: number;
}

interface PartyMember {
  id: string;
  name: string;
  char_class: string;
  level: number;
  hp_current: number;
  hp_max: number;
  user_name: string;
  user_avatar: string | null;
}

interface RecentNote {
  id: string;
  title: string;
  content: string | null;
  tag: string;
  created_at: string;
  author_name: string;
}

/**
 * Get the active campaign for a user.
 * First checks if user is a DM, then checks if user has a character in any campaign.
 */
export async function getActiveCampaign(
  dataClient: DataClient,
  userId: string
): Promise<Tables<'campaigns'> | null> {
  try {
    // First, check if user is a DM (exclude templates)
    const { data: dmCampaigns, error: dmError } = await dataClient
      .from('campaigns')
      .select('*')
      .eq('dm_user_id', userId)
      .eq('is_template', false)
      .limit(1);

    if (dmError) throw dmError;
    if (dmCampaigns && dmCampaigns.length > 0) {
      return dmCampaigns[0];
    }

    // If not a DM, check if user has a character in any campaign
    const { data: characterCampaigns, error: charError } = await dataClient
      .from('characters')
      .select('campaign_id')
      .eq('user_id', userId)
      .limit(1);

    if (charError) throw charError;
    if (!characterCampaigns || characterCampaigns.length === 0) {
      return null;
    }

    // Get the campaign the character belongs to
    const { data: campaign, error: campaignError } = await dataClient
      .from('campaigns')
      .select('*')
      .eq('id', characterCampaigns[0].campaign_id)
      .single();

    if (campaignError) {
      if (campaignError.code === 'PGRST116') return null; // No rows found
      throw campaignError;
    }
    return campaign;
  } catch (error: unknown) {
    console.error('getActiveCampaign error:', error);
    return null;
  }
}

/**
 * Get campaign statistics: player count, NPC count, encounter count, and average DC.
 */
export async function getCampaignStats(
  dataClient: DataClient,
  campaignId: string
): Promise<CampaignStats> {
  try {
    // Count active players (distinct users with characters)
    const { count: playerCount } = await dataClient
      .from('characters')
      .select('user_id', { count: 'exact', head: true })
      .eq('campaign_id', campaignId);

    // Count NPCs
    const { count: npcCount } = await dataClient
      .from('npcs')
      .select('id', { count: 'exact', head: true })
      .eq('campaign_id', campaignId);

    // Count encounters
    const { count: encounterCount } = await dataClient
      .from('encounters')
      .select('id', { count: 'exact', head: true })
      .eq('campaign_id', campaignId);

    // Get average DC
    const { data: encounters } = await dataClient
      .from('encounters')
      .select('difficulty_class')
      .eq('campaign_id', campaignId);

    let avgDC = 0;
    if (encounters && encounters.length > 0) {
      const validDCs = encounters
        .map((e: any) => e.difficulty_class as number | null)
        .filter((dc: number | null): dc is number => dc !== null);
      if (validDCs.length > 0) {
        avgDC = Math.round(
          validDCs.reduce((a: number, b: number) => a + b, 0) / validDCs.length
        );
      }
    }

    return {
      playerCount: playerCount ?? 0,
      npcCount: npcCount ?? 0,
      encounterCount: encounterCount ?? 0,
      avgDC,
    };
  } catch (error) {
    console.error('getCampaignStats error:', error);
    return { playerCount: 0, npcCount: 0, encounterCount: 0, avgDC: 0 };
  }
}

/**
 * Get the next planned encounter in a campaign.
 */
export async function getNextEncounter(
  dataClient: DataClient,
  campaignId: string
): Promise<Tables<'encounters'> | null> {
  try {
    const { data, error } = await dataClient
      .from('encounters')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', 'planned')
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('getNextEncounter error:', error);
    return null;
  }
}

/**
 * Get all party members in a campaign with profile information.
 */
export async function getPartyMembers(
  dataClient: DataClient,
  campaignId: string
): Promise<PartyMember[]> {
  try {
    const { data, error } = await dataClient
      .from('characters')
      .select(
        `
        id,
        name,
        char_class,
        level,
        hp_current,
        hp_max,
        user_id,
        profiles(display_name, avatar_url)
      `
      )
      .eq('campaign_id', campaignId)
      .order('name');

    if (error) throw error;
    if (!data) return [];

    return data.map((char: any) => ({
      id: char.id,
      name: char.name,
      char_class: char.char_class,
      level: char.level,
      hp_current: char.hp_current,
      hp_max: char.hp_max,
      user_name: char.profiles?.display_name || 'Unknown',
      user_avatar: char.profiles?.avatar_url || null,
    }));
  } catch (error) {
    console.error('getPartyMembers error:', error);
    return [];
  }
}

/**
 * Get recent notes in a campaign.
 */
export async function getRecentNotes(
  dataClient: DataClient,
  campaignId: string,
  limit: number = 3
): Promise<RecentNote[]> {
  try {
    const { data, error } = await dataClient
      .from('notes')
      .select(
        `
        id,
        title,
        content,
        tag,
        created_at,
        profiles(display_name)
      `
      )
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!data) return [];

    return data.map((note: any) => ({
      id: note.id,
      title: note.title,
      content: note.content
        ? note.content.substring(0, 120)
        : null,
      tag: note.tag,
      created_at: note.created_at,
      author_name: note.profiles?.display_name || 'Unknown',
    }));
  } catch (error) {
    console.error('getRecentNotes error:', error);
    return [];
  }
}

/**
 * Get the player's character in a specific campaign.
 */
export async function getPlayerCharacter(
  dataClient: DataClient,
  userId: string,
  campaignId: string
): Promise<Tables<'characters'> | null> {
  try {
    const { data, error } = await dataClient
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .eq('campaign_id', campaignId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - this is expected
        return null;
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('getPlayerCharacter error:', error);
    return null;
  }
}
