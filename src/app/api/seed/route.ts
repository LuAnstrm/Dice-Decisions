import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runSeed } from '@/lib/seed/seed-runner';

/**
 * POST /api/seed
 * Triggers the Tower of Fate seed script.
 * 
 * Authorization: Either pass X-Seed-Secret header matching SEED_SECRET env var,
 * or be an authenticated user (who becomes the DM).
 */
export async function POST(request: NextRequest) {
  try {
    // ── Auth: secret header OR authenticated user ──────
    const seedSecret = request.headers.get('x-seed-secret');
    const envSecret = process.env.SEED_SECRET;
    let dmUserId: string | null = null;

    if (envSecret && seedSecret === envSecret) {
      // Secret-based auth — need a dm_user_id in the body
      const body = await request.json().catch(() => ({}));
      dmUserId = body.dm_user_id ?? null;
      if (!dmUserId) {
        return NextResponse.json(
          { error: 'dm_user_id is required in body when using X-Seed-Secret auth' },
          { status: 400 }
        );
      }
    } else {
      // User-based auth — use the authenticated user as DM
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      dmUserId = user.id;
    }

    // ── Run seed ───────────────────────────────────────
    const result = await runSeed(dmUserId);

    if (!result.success && result.errors[0]?.includes('already exists')) {
      return NextResponse.json(
        { error: 'Tower of Fate already seeded', details: result },
        { status: 409 }
      );
    }

    return NextResponse.json(result, { status: result.success ? 201 : 207 });
  } catch (error: unknown) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
