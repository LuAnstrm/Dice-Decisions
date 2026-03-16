import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/seed/seed-runner';
import { cloneTowerOfFateForDM, createDemoCharacterForPlayer } from '@/lib/seed/onboarding';

/**
 * POST /api/onboarding
 * Triggers Tower of Fate onboarding for a new user.
 * Requires authentication. Reads preferred_role from profile to determine
 * whether to clone the full campaign (DM) or create a demo character (Player).
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a campaign (skip if already onboarded)
    const { data: existingCampaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('dm_user_id', user.id)
      .limit(1);

    const { data: existingChars } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (
      (existingCampaigns && existingCampaigns.length > 0) ||
      (existingChars && existingChars.length > 0)
    ) {
      return NextResponse.json(
        { message: 'User already onboarded', skipped: true },
        { status: 200 }
      );
    }

    // Get user's preferred role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('preferred_role')
      .eq('id', user.id)
      .single();

    const role = (profile as { preferred_role?: string } | null)?.preferred_role ?? 'dm';

    // Use admin client to bypass RLS for onboarding operations
    const adminClient = createAdminClient();

    if (role === 'dm') {
      const result = await cloneTowerOfFateForDM(adminClient, user.id);
      if (result.error) {
        return NextResponse.json(
          { error: result.error, role },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: 'Tower of Fate campaign cloned', campaignId: result.campaignId, role },
        { status: 201 }
      );
    } else {
      const result = await createDemoCharacterForPlayer(adminClient, user.id);
      if (result.error) {
        return NextResponse.json(
          { error: result.error, role },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: 'Demo character created', characterId: result.characterId, role },
        { status: 201 }
      );
    }
  } catch (error: unknown) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
