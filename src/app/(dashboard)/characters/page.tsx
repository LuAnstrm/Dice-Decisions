import { createClient } from '@/lib/data-client/server';
import { redirect } from 'next/navigation';
import type { Tables } from '@/types/schema';
import { getActiveCampaign } from '@/lib/queries/dashboard';
import { getCharacter, getPartyCharacters } from '@/lib/queries/characters';
import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { CharactersClientContent } from './characters-client';
import { UserCircle } from 'lucide-react';

export default async function CharactersPage() {
  const dataClient = await createClient();
  const { data: { user } } = await dataClient.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await dataClient
    .from('profiles')
    .select('preferred_role')
    .eq('id', user.id)
    .single() as { data: { preferred_role: string } | null };
  const isDM = profile?.preferred_role === 'dm';

  const campaign = await getActiveCampaign(dataClient, user.id);
  if (!campaign) {
    return (
      <>
        <Topbar title="Character Sheet" />
        <div className="p-6 lg:p-8">
          <EmptyState
            icon={UserCircle}
            title="No Campaign"
            description="You need to be in a campaign to view characters."
          />
        </div>
      </>
    );
  }

  let characters: Tables<'characters'>[] = [];
  if (isDM) {
    characters = await getPartyCharacters(dataClient, campaign.id);
  } else {
    const char = await getCharacter(dataClient, user.id, campaign.id);
    if (char) characters = [char];
  }

  return (
    <>
      <Topbar title="Character Sheet" />
      <CharactersClientContent
        characters={characters}
        isDM={isDM}
        campaignId={campaign.id}
        userId={user.id}
      />
    </>
  );
}
