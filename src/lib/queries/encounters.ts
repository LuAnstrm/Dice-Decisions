import type { AppSchema, Tables } from '@/types/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataClient = any;

export interface EnemyEntry {
  name: string;
  hp: number;
  ac: number;
  attack_bonus: number;
  damage_dice: string;
}

export async function getEncounters(
  dataClient: DataClient,
  campaignId: string,
  status?: AppSchema['public']['Enums']['encounter_status'],
): Promise<Tables<'encounters'>[]> {
  try {
    let query = dataClient
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
  dataClient: DataClient,
  id: string,
): Promise<Tables<'encounters'> | null> {
  try {
    const { data, error } = await dataClient
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
  dataClient: DataClient,
  data: AppSchema['public']['Tables']['encounters']['Insert'],
): Promise<Tables<'encounters'> | null> {
  try {
    const { data: encounter, error } = await dataClient
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
  dataClient: DataClient,
  id: string,
  data: AppSchema['public']['Tables']['encounters']['Update'],
): Promise<Tables<'encounters'> | null> {
  try {
    const { data: encounter, error } = await dataClient
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
  dataClient: DataClient,
  id: string,
): Promise<boolean> {
  try {
    const { error } = await dataClient
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
  dataClient: DataClient,
  id: string,
  status: AppSchema['public']['Enums']['encounter_status'],
): Promise<Tables<'encounters'> | null> {
  try {
    const { data: encounter, error } = await dataClient
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
