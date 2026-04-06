import { redirect } from 'next/navigation';
import { createClient } from '@/lib/data-client/server';
import type { Tables } from '@/types/schema';
import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { ScrollText } from 'lucide-react';
import { getActiveCampaign } from '@/lib/queries/dashboard';
import { getNotes } from '@/lib/queries/notes';
import { StoryNotesClient } from './story-notes-client';

export default async function StoryNotesPage() {
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
    .single<Tables<'profiles'>>();

  const isDM = profile?.preferred_role === 'dm';

  const campaign = await getActiveCampaign(dataClient, user.id);

  if (!campaign) {
    return (
      <>
        <Topbar title="Story Notes" />
        <div className="p-6 lg:p-8">
          <EmptyState
            icon={ScrollText}
            title="No Campaign"
            description="You need to be in a campaign to manage story notes."
          />
        </div>
      </>
    );
  }

  const notes = await getNotes(dataClient, campaign.id, isDM);

  return (
    <>
      <Topbar title="Story Notes" />
      <StoryNotesClient
        initialNotes={notes}
        isDM={isDM}
        campaignId={campaign.id}
        userId={user.id}
      />
    </>
  );
}
