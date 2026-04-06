import { redirect } from 'next/navigation';
import { createClient } from '@/lib/data-client/server';
import type { Tables } from '@/types/schema';
import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { Swords } from 'lucide-react';
import { getActiveCampaign } from '@/lib/queries/dashboard';
import { getEncounters } from '@/lib/queries/encounters';
import { getPartyCharacters } from '@/lib/queries/characters';
import { getNPCs } from '@/lib/queries/npcs';
import { EncountersClient } from './encounters-client';

export default async function EncountersPage() {
  const dataClient = await createClient();
  const {
    data: { user },
  } = await dataClient.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await dataClient
    .from('profiles')
    .select('preferred_role')
    .eq('id', user.id)
    .single();

  const isDM = profile?.preferred_role === 'dm';

  const campaign = await getActiveCampaign(dataClient, user.id);

  if (!campaign) {
    return (
      <>
        <Topbar title="Encounters" />
        <div className="p-6 lg:p-8">
          <EmptyState
            icon={Swords}
            title="No Campaign"
            description="You need to be in a campaign to manage encounters."
          />
        </div>
      </>
    );
  }

  const [encounters, partyCharacters, npcs] = await Promise.all([
    getEncounters(dataClient, campaign.id),
    getPartyCharacters(dataClient, campaign.id),
    getNPCs(dataClient, campaign.id, isDM),
  ]);

  return (
    <>
      <Topbar title="Encounters" />
      <EncountersClient
        encounters={encounters}
        partyCharacters={partyCharacters}
        npcs={npcs}
        campaignId={campaign.id}
      />
    </>
  );
}
