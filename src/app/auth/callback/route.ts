import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
}

