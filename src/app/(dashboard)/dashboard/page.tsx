import { redirect } from 'next/navigation';
import { createClient } from '@/lib/data-client/server';
import type { Tables } from '@/types/schema';
import { Topbar } from '@/components/layout/topbar';
import { DMDashboard } from '@/components/dashboard/dm-dashboard';
import { PlayerDashboard } from '@/components/dashboard/player-dashboard';
import { EmptyState } from '@/components/shared/empty-state';
import { Sparkles } from 'lucide-react';
import {
  getActiveCampaign,
  getCampaignStats,
  getNextEncounter,
  getPartyMembers,
  getRecentNotes,
  getPlayerCharacter,
} from '@/lib/queries/dashboard';

export default async function DashboardPage() {
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
        <Topbar title="Dashboard" />
        <div className="p-6 lg:p-8">
          <EmptyState
            icon={Sparkles}
            title="No Campaign Yet"
            description="Create a campaign to unlock dashboard widgets and campaign tools."
            action={{
              label: 'Create Campaign',
              href: '/campaign/create',
            }}
          />
        </div>
      </>
    );
  }

  if (isDM) {
    const [stats, encounter, partyMembers, recentNotes] = await Promise.all([
      getCampaignStats(dataClient, campaign.id),
      getNextEncounter(dataClient, campaign.id),
      getPartyMembers(dataClient, campaign.id),
      getRecentNotes(dataClient, campaign.id, 3),
    ]);

    return (
      <>
        <Topbar title="Dashboard" />
        <div className="p-6 lg:p-8">
          <DMDashboard
            campaign={campaign}
            stats={stats}
            encounter={encounter
              ? {
                  name: encounter.name,
                  description: encounter.description ?? '',
                  status: encounter.status,
                  enemies: Array.isArray((encounter as any).enemies)
                    ? (encounter as any).enemies
                    : [],
                }
              : null}
            partyMembers={partyMembers}
            recentNotes={recentNotes}
          />
        </div>
      </>
    );
  }

  const [character, recentNotes] = await Promise.all([
    getPlayerCharacter(dataClient, user.id, campaign.id),
    getRecentNotes(dataClient, campaign.id, 3),
  ]);

  const feedItems = recentNotes.map((note) => ({
    id: note.id,
    type: 'session_log' as const,
    title: note.title,
    description: note.content ?? 'No summary available.',
    category: 'Session Log',
    timestamp: note.created_at,
  }));

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6 lg:p-8">
        <PlayerDashboard
          character={character as any}
          feedItems={feedItems}
          hasInspiration={false}
        />
      </div>
    </>
  );
}
