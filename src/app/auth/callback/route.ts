import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get('next');

  if (next && next.startsWith('/')) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
