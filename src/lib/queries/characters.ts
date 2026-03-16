import { createServerClient } from '@supabase/ssr';
import type { Tables } from '@/types/database';

type SupabaseClient = ReturnType<typeof createServerClient>;

/**
 * Get a character by user and campaign.
 */
export async function getCharacter(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string
): Promise<Tables<'characters'> | null> {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .eq('campaign_id', campaignId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error('getCharacter error:', {
      message: err?.message,
      code: err?.code,
    });
    return null;
  }
}

/**
 * Create a new character.
 */
export async function createCharacter(
  supabase: SupabaseClient,
  data: Record<string, unknown>
): Promise<Tables<'characters'> | null> {
  try {
    const { data: character, error } = await supabase
      .from('characters')
      .insert(data as never)
      .select()
      .single();

    if (error) throw error;
    return character;
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error('createCharacter error:', {
      message: err?.message,
      code: err?.code,
    });
    return null;
  }
}

/**
 * Partial update a character by ID.
 */
export async function updateCharacter(
  supabase: SupabaseClient,
  id: string,
  data: Record<string, unknown>
): Promise<Tables<'characters'> | null> {
  try {
    const { data: character, error } = await supabase
      .from('characters')
      .update(data as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return character;
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error('updateCharacter error:', {
      message: err?.message,
      code: err?.code,
    });
    return null;
  }
}

/**
 * Hard delete a character by ID.
 */
export async function deleteCharacter(
  supabase: SupabaseClient,
  id: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error('deleteCharacter error:', {
      message: err?.message,
      code: err?.code,
    });
    return false;
  }
}

/**
 * Fetch all characters in a campaign.
 */
export async function getPartyCharacters(
  supabase: SupabaseClient,
  campaignId: string
): Promise<Tables<'characters'>[]> {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('name');

    if (error) throw error;
    if (!data) return [];

    return data as Tables<'characters'>[];
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error('getPartyCharacters error:', {
      message: err?.message,
      code: err?.code,
    });
    return [];
  }
}
