import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';
import { DmDashboard } from '@/components/dashboard/dm-dashboard';
import { PlayerDashboard } from '@/components/dashboard/player-dashboard';
import {
  getActiveCampaign,
  getCampaignStats,
  getNextEncounter,
  getPartyMembers,
  getRecentNotes,
  getPlayerCharacter,
} from '@/lib/queries/dashboard';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard | Dice & Decisions',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Tables<'profiles'>>();

  if (!profile) {
    redirect('/login');
  }

  const preferredRole = profile.preferred_role || 'player';

  // Get active campaign
  const activeCampaign = await getActiveCampaign(supabase, user.id);

  // No campaign found - show onboarding
  if (!activeCampaign) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center text-center max-w-md">
          <Sparkles className="w-16 h-16 text-[#7c3aed] mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Create Your First Campaign</h1>
          <p className="text-white/60 mb-8">
            Begin your adventure by creating a new campaign or joining an existing one.
          </p>
          <Link href="/campaign/create">
            <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold">
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // DM Dashboard
  if (preferredRole === 'dm') {
    const [stats, nextEncounter, partyMembers, recentNotes] = await Promise.all([
      getCampaignStats(supabase, activeCampaign.id),
      getNextEncounter(supabase, activeCampaign.id),
      getPartyMembers(supabase, activeCampaign.id),
      getRecentNotes(supabase, activeCampaign.id),
    ]);

    return (
      <div className="space-y-6">
        <DmDashboard
          campaign={activeCampaign}
          stats={stats}
          encounter={nextEncounter}
          partyMembers={partyMembers}
          recentNotes={recentNotes}
        />
      </div>
    );
  }

  // Player Dashboard
  const [playerCharacter, recentNotes] = await Promise.all([
    getPlayerCharacter(supabase, user.id, activeCampaign.id),
    getRecentNotes(supabase, activeCampaign.id, 5),
  ]);

  // Convert notes to feed items for now (simplified)
  const feedItems = recentNotes.map((note) => ({
    id: note.id,
    type: 'session_log' as const,
    title: note.title,
    description: note.content || '',
    category: note.tag.replace('_', ' '),
    timestamp: note.created_at,
  }));

  if (!playerCharacter) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Character</h1>
          <p className="text-white/60 mb-8">
            Design your hero to join &quot;{activeCampaign.name}&quot;.
          </p>
          <Link href={`/campaign/${activeCampaign.id}/character/create`}>
            <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold">
              Create Character
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlayerDashboard
        character={playerCharacter}
        feedItems={feedItems}
        hasInspiration={false}
      />
    </div>
  );
}
