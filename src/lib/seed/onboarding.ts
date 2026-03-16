// =============================================================
// Onboarding — Tower of Fate Campaign Cloning
// =============================================================
// After signup, gives new users immediate access to the Tower of Fate
// campaign so they never land on an empty dashboard.

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Campaign,
  NPC,
  Encounter,
  Note,
  BayesScenario,
  CampaignMap,
  MapMarker,
  Character,
} from '@/types/database';
import { SEED_IDS } from './tower-of-fate';

/**
 * Clone the Tower of Fate template campaign for a new DM user.
 * Creates a personal copy with all NPCs, encounters, notes, scenarios, map, and markers.
 * The original template (is_template=true) remains unchanged.
 */
export async function cloneTowerOfFateForDM(
  supabase: SupabaseClient,
  newUserId: string
): Promise<{ campaignId: string | null; error: string | null }> {
  try {
    // Check if template exists
    const { data: templateData } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', SEED_IDS.campaign)
      .eq('is_template', true)
      .single();

    const template = templateData as Campaign | null;
    if (!template) {
      return { campaignId: null, error: 'Tower of Fate template not found' };
    }

    // Create the cloned campaign (NOT a template)
    const { data: newCampaignData, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        name: template.name,
        description: template.description,
        dm_user_id: newUserId,
        is_template: false,
        status: 'active' as const,
      })
      .select('id')
      .single();

    if (campaignError || !newCampaignData) {
      return { campaignId: null, error: campaignError?.message ?? 'Failed to clone campaign' };
    }

    const newCampaignId = (newCampaignData as { id: string }).id;

    // Clone NPCs
    const { data: npcsData } = await supabase
      .from('npcs')
      .select('*')
      .eq('campaign_id', SEED_IDS.campaign);

    const npcs = (npcsData ?? []) as NPC[];
    if (npcs.length > 0) {
      await supabase.from('npcs').insert(
        npcs.map((npc) => ({
          campaign_id: newCampaignId,
          name: npc.name,
          race: npc.race,
          role: npc.role,
          description: npc.description,
          hp: npc.hp,
          armor_class: npc.armor_class,
          attack_bonus: npc.attack_bonus,
          notes: npc.notes,
          status: npc.status,
          is_visible_to_players: npc.is_visible_to_players,
        }))
      );
    }

    // Clone Encounters
    const { data: encountersData } = await supabase
      .from('encounters')
      .select('*')
      .eq('campaign_id', SEED_IDS.campaign);

    const encounters = (encountersData ?? []) as Encounter[];
    if (encounters.length > 0) {
      await supabase.from('encounters').insert(
        encounters.map((enc) => ({
          campaign_id: newCampaignId,
          name: enc.name,
          description: enc.description,
          difficulty_class: enc.difficulty_class,
          enemies: enc.enemies,
          status: enc.status,
        }))
      );
    }

    // Clone Notes (set new user as author)
    const { data: notesData } = await supabase
      .from('notes')
      .select('*')
      .eq('campaign_id', SEED_IDS.campaign);

    const notes = (notesData ?? []) as Note[];
    if (notes.length > 0) {
      await supabase.from('notes').insert(
        notes.map((note) => ({
          campaign_id: newCampaignId,
          author_id: newUserId,
          title: note.title,
          content: note.content,
          tag: note.tag,
          is_visible_to_players: note.is_visible_to_players,
          session_number: note.session_number,
        }))
      );
    }

    // Clone Bayes Scenarios
    const { data: scenariosData } = await supabase
      .from('bayes_scenarios')
      .select('*')
      .eq('campaign_id', SEED_IDS.campaign);

    const scenarios = (scenariosData ?? []) as BayesScenario[];
    if (scenarios.length > 0) {
      await supabase.from('bayes_scenarios').insert(
        scenarios.map((scenario) => ({
          campaign_id: newCampaignId,
          title: scenario.title,
          description: scenario.description,
          prior_probability: scenario.prior_probability,
          likelihood: scenario.likelihood,
          marginal_false: scenario.marginal_false,
          is_template: scenario.is_template,
        }))
      );
    }

    // Clone Map + Markers
    const { data: mapsData } = await supabase
      .from('campaign_maps')
      .select('*')
      .eq('campaign_id', SEED_IDS.campaign);

    const maps = (mapsData ?? []) as CampaignMap[];
    if (maps.length > 0) {
      for (const originalMap of maps) {
        const { data: newMapData, error: mapError } = await supabase
          .from('campaign_maps')
          .insert({
            campaign_id: newCampaignId,
            name: originalMap.name,
            image_url: originalMap.image_url,
            sort_order: originalMap.sort_order,
          })
          .select('id')
          .single();

        const newMap = newMapData as { id: string } | null;
        if (newMap && !mapError) {
          const { data: markersData } = await supabase
            .from('map_markers')
            .select('*')
            .eq('map_id', originalMap.id);

          const markers = (markersData ?? []) as MapMarker[];
          if (markers.length > 0) {
            await supabase.from('map_markers').insert(
              markers.map((marker) => ({
                map_id: newMap.id,
                label: marker.label,
                description: marker.description,
                icon_type: marker.icon_type,
                pos_x: marker.pos_x,
                pos_y: marker.pos_y,
                is_visible_to_players: marker.is_visible_to_players,
              }))
            );
          }
        }
      }
    }

    return { campaignId: newCampaignId, error: null };
  } catch (e: unknown) {
    return {
      campaignId: null,
      error: e instanceof Error ? e.message : 'Unknown error cloning campaign',
    };
  }
}

/**
 * Create a copy of the demo character "Thorin" for a new Player user.
 * Links the character to the Tower of Fate template campaign.
 */
export async function createDemoCharacterForPlayer(
  supabase: SupabaseClient,
  newUserId: string
): Promise<{ characterId: string | null; error: string | null }> {
  try {
    // Check if template campaign exists
    const { data: templateData } = await supabase
      .from('campaigns')
      .select('id')
      .eq('id', SEED_IDS.campaign)
      .eq('is_template', true)
      .single();

    if (!templateData) {
      return { characterId: null, error: 'Tower of Fate template not found' };
    }

    // Check if user already has a character in this campaign
    const { data: existingData } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', newUserId)
      .eq('campaign_id', SEED_IDS.campaign)
      .maybeSingle();

    const existing = existingData as { id: string } | null;
    if (existing) {
      return { characterId: existing.id, error: null };
    }

    // Get the template Thorin character
    const { data: templateCharData } = await supabase
      .from('characters')
      .select('*')
      .eq('id', SEED_IDS.character)
      .single();

    const templateChar = templateCharData as Character | null;
    if (!templateChar) {
      return { characterId: null, error: 'Template character Thorin not found' };
    }

    // Create a copy for the new user
    const { data: newCharData, error } = await supabase
      .from('characters')
      .insert({
        user_id: newUserId,
        campaign_id: templateChar.campaign_id,
        name: templateChar.name,
        race: templateChar.race,
        char_class: templateChar.char_class,
        level: templateChar.level,
        strength: templateChar.strength,
        dexterity: templateChar.dexterity,
        constitution: templateChar.constitution,
        intelligence: templateChar.intelligence,
        wisdom: templateChar.wisdom,
        charisma: templateChar.charisma,
        hp_current: templateChar.hp_current,
        hp_max: templateChar.hp_max,
        armor_class: templateChar.armor_class,
        speed: templateChar.speed,
        weapons: templateChar.weapons,
        abilities: templateChar.abilities,
        inventory: templateChar.inventory,
        notes: templateChar.notes,
      })
      .select('id')
      .single();

    if (error) {
      return { characterId: null, error: error.message };
    }

    const newChar = newCharData as { id: string } | null;
    return { characterId: newChar?.id ?? null, error: null };
  } catch (e: unknown) {
    return {
      characterId: null,
      error: e instanceof Error ? e.message : 'Unknown error creating demo character',
    };
  }
}
