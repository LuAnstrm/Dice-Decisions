import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Onboarding API is disabled because AppSchema integration was removed.' },
    { status: 410 },
  );
}
