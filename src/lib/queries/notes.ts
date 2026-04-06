import type { AppSchema, Tables } from '@/types/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataClient = any;

export async function getNotes(
  dataClient: DataClient,
  campaignId: string,
  isDM: boolean,
  filters?: { tag?: string; search?: string },
): Promise<Tables<'notes'>[]> {
  try {
    let query = dataClient
      .from('notes')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (!isDM) {
      query = query.eq('is_visible_to_players', true);
    }

    if (filters?.tag) {
      query = query.eq('tag', filters.tag);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getNotes error:', error);
    return [];
  }
}

export async function getNote(
  dataClient: DataClient,
  id: string,
): Promise<Tables<'notes'> | null> {
  try {
    const { data, error } = await dataClient
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('getNote error:', error);
    return null;
  }
}

export async function createNote(
  dataClient: DataClient,
  campaignId: string,
  userId: string,
): Promise<Tables<'notes'> | null> {
  try {
    const { data, error } = await dataClient
      .from('notes')
      .insert({
        campaign_id: campaignId,
        author_id: userId,
        title: 'New Note',
        content: '',
        tag: 'session_log' as AppSchema['public']['Enums']['note_tag'],
        is_visible_to_players: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('createNote error:', error);
    return null;
  }
}

export async function updateNote(
  dataClient: DataClient,
  id: string,
  data: AppSchema['public']['Tables']['notes']['Update'],
): Promise<Tables<'notes'> | null> {
  try {
    const { data: note, error } = await dataClient
      .from('notes')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return note;
  } catch (error) {
    console.error('updateNote error:', error);
    return null;
  }
}

export async function deleteNote(
  dataClient: DataClient,
  id: string,
): Promise<boolean> {
  try {
    const { error } = await dataClient.from('notes').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('deleteNote error:', error);
    return false;
  }
}

export async function searchNotes(
  dataClient: DataClient,
  campaignId: string,
  query: string,
): Promise<Tables<'notes'>[]> {
  try {
    const { data, error } = await dataClient
      .from('notes')
      .select('*')
      .eq('campaign_id', campaignId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('searchNotes error:', error);
    return [];
  }
}
