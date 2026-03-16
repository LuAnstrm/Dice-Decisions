import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { BookOpen } from 'lucide-react';
import { getActiveCampaign } from '@/lib/queries/dashboard';
import { getPlayerNotes } from '@/lib/queries/campaign';
import { PlayerNotesClientContent } from './player-notes-client';

export default async function PlayerNotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get active campaign
  const campaign = await getActiveCampaign(supabase, user.id);

  if (!campaign) {
    return (
      <>
        <Topbar title="Player Notes" />
        <div className="p-6 lg:p-8">
          <EmptyState
            icon={BookOpen}
            title="No Campaign"
            description="You need to be in a campaign to create notes."
          />
        </div>
      </>
    );
  }

  // Get player's notes
  const notes = await getPlayerNotes(supabase, campaign.id, user.id);

  return (
    <>
      <Topbar title="Player Notes" />
      <PlayerNotesClientContent notes={notes} campaignId={campaign.id} userId={user.id} />
    </>
  );
}
