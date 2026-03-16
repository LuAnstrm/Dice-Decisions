import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';
import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { Users } from 'lucide-react';
import { getActiveCampaign } from '@/lib/queries/dashboard';
import { getCampaignNPCs } from '@/lib/queries/campaign';
import { NPCsClientContent } from './npcs-client';

export default async function NpcsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('preferred_role')
    .eq('id', user.id)
    .single<Tables<'profiles'>>();

  const isDM = profile?.preferred_role === 'dm';

  // Get active campaign
  const campaign = await getActiveCampaign(supabase, user.id);

  if (!campaign) {
    return (
      <>
        <Topbar title="NPCs" />
        <div className="p-6 lg:p-8">
          <EmptyState
            icon={Users}
            title="No Campaign"
            description="You need to be in a campaign to view NPCs."
          />
        </div>
      </>
    );
  }

  // Get NPCs for this campaign
  const npcs = await getCampaignNPCs(supabase, campaign.id, isDM);

  return (
    <>
      <Topbar title="NPCs" />
      {npcs.length === 0 ? (
        <div className="p-6 lg:p-8">
          <EmptyState
            icon={Users}
            title="No NPCs"
            description={isDM ? "Create and manage your campaign's non-player characters." : 'No NPCs are visible in this campaign.'}
          />
        </div>
      ) : (
        <NPCsClientContent npcs={npcs} isDM={isDM} campaignId={campaign.id} />
      )}
    </>
  );
}
