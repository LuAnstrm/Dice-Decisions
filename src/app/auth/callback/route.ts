import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/seed/seed-runner';
import { cloneTowerOfFateForDM } from '@/lib/seed/onboarding';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/dashboard';

  // Security: Validate 'next' is a relative path to prevent open redirects
  if (next && !next.startsWith('/')) {
    next = '/dashboard';
  }

  // Security: Validate code is non-empty and reasonable length
  if (!code || typeof code !== 'string' || code.length < 10 || code.length > 1000) {
    return NextResponse.redirect(new URL('/login?error=invalid_code', request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    // Auto-onboard new users with the Tower of Fate demo campaign
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: campaigns } = await supabase
          .from('campaigns')
          .select('id')
          .eq('dm_user_id', user.id)
          .limit(1);

        // If user has no campaigns, clone Tower of Fate for them
        if (!campaigns || campaigns.length === 0) {
          const adminClient = createAdminClient();
          await cloneTowerOfFateForDM(adminClient, user.id);
        }
      }
    } catch (onboardingError) {
      // Don't block login if onboarding fails — user can still access the app
      console.error('Auto-onboarding failed:', onboardingError);
    }

    return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
}

