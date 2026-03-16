import type { Database, Tables } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface NPCFilters {
  roles?: string[];
  status?: string;
  search?: string;
}

export async function getNPCs(
  supabase: SupabaseClient,
  campaignId: string,
  isDM: boolean,
  filters?: NPCFilters,
): Promise<Tables<'npcs'>[]> {
  try {
    let query = supabase
      .from('npcs')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('name');

    if (!isDM) {
      query = query.eq('is_visible_to_players', true);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.roles && filters.roles.length > 0) {
      query = query.in('role', filters.roles);
    }

    if (filters?.search) {
      const term = `%${filters.search}%`;
      query = query.or(
        `name.ilike.${term},role.ilike.${term},description.ilike.${term}`,
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getNPCs error:', error);
    return [];
  }
}

export async function createNPC(
  supabase: SupabaseClient,
  data: Database['public']['Tables']['npcs']['Insert'],
): Promise<Tables<'npcs'> | null> {
  try {
    const { data: npc, error } = await supabase
      .from('npcs')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return npc;
  } catch (error) {
    console.error('createNPC error:', error);
    return null;
  }
}

export async function updateNPC(
  supabase: SupabaseClient,
  id: string,
  data: Database['public']['Tables']['npcs']['Update'],
): Promise<Tables<'npcs'> | null> {
  try {
    const { data: npc, error } = await supabase
      .from('npcs')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return npc;
  } catch (error) {
    console.error('updateNPC error:', error);
    return null;
  }
}

interface DeleteResult {
  success?: boolean;
  error?: 'NPC_IN_ENCOUNTER';
  encounterName?: string;
}

export async function deleteNPC(
  supabase: SupabaseClient,
  id: string,
): Promise<DeleteResult> {
  try {
    // Get the NPC name first
    const { data: npc, error: npcError } = await supabase
      .from('npcs')
      .select('name')
      .eq('id', id)
      .single();

    if (npcError) throw npcError;

    // Check if NPC is referenced in any encounter's enemies JSON
    const { data: encounters, error: encError } = await supabase
      .from('encounters')
      .select('name, enemies');

    if (encError) throw encError;

    if (encounters) {
      for (const encounter of encounters) {
        const enemies = encounter.enemies;
        if (Array.isArray(enemies)) {
          const found = enemies.some(
            (enemy) =>
              typeof enemy === 'object' &&
              enemy !== null &&
              'name' in enemy &&
              (enemy as { name: string }).name === npc.name,
          );
          if (found) {
            return { error: 'NPC_IN_ENCOUNTER', encounterName: encounter.name };
          }
        }
      }
    }

    const { error: deleteError } = await supabase
      .from('npcs')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    return { success: true };
  } catch (error) {
    console.error('deleteNPC error:', error);
    return { error: 'NPC_IN_ENCOUNTER' };
  }
}

export async function toggleNPCVisibility(
  supabase: SupabaseClient,
  id: string,
  isVisible: boolean,
): Promise<Tables<'npcs'> | null> {
  try {
    const { data: npc, error } = await supabase
      .from('npcs')
      .update({ is_visible_to_players: isVisible })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return npc;
  } catch (error) {
    console.error('toggleNPCVisibility error:', error);
    return null;
  }
}
