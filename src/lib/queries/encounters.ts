import type { Database, Tables } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

export interface EnemyEntry {
  name: string;
  hp: number;
  ac: number;
  attack_bonus: number;
  damage_dice: string;
}

export async function getEncounters(
  supabase: SupabaseClient,
  campaignId: string,
  status?: Database['public']['Enums']['encounter_status'],
): Promise<Tables<'encounters'>[]> {
  try {
    let query = supabase
      .from('encounters')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getEncounters error:', error);
    return [];
  }
}

export async function getEncounter(
  supabase: SupabaseClient,
  id: string,
): Promise<Tables<'encounters'> | null> {
  try {
    const { data, error } = await supabase
      .from('encounters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('getEncounter error:', error);
    return null;
  }
}

export async function createEncounter(
  supabase: SupabaseClient,
  data: Database['public']['Tables']['encounters']['Insert'],
): Promise<Tables<'encounters'> | null> {
  try {
    const { data: encounter, error } = await supabase
      .from('encounters')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return encounter;
  } catch (error) {
    console.error('createEncounter error:', error);
    return null;
  }
}

export async function updateEncounter(
  supabase: SupabaseClient,
  id: string,
  data: Database['public']['Tables']['encounters']['Update'],
): Promise<Tables<'encounters'> | null> {
  try {
    const { data: encounter, error } = await supabase
      .from('encounters')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return encounter;
  } catch (error) {
    console.error('updateEncounter error:', error);
    return null;
  }
}

export async function deleteEncounter(
  supabase: SupabaseClient,
  id: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('encounters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('deleteEncounter error:', error);
    return false;
  }
}

export async function updateEncounterStatus(
  supabase: SupabaseClient,
  id: string,
  status: Database['public']['Enums']['encounter_status'],
): Promise<Tables<'encounters'> | null> {
  try {
    const { data: encounter, error } = await supabase
      .from('encounters')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return encounter;
  } catch (error) {
    console.error('updateEncounterStatus error:', error);
    return null;
  }
}
