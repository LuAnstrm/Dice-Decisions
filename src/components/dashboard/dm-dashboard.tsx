import { HeroBanner } from './hero-banner';
import { QuickStats } from './quick-stats';
import { NextEncounterCard } from './next-encounter-card';
import { PartyOverview } from './party-overview';
import { RecentNotesRow } from './recent-notes-row';
import type { Tables } from '@/types/database';

interface CampaignStats {
  playerCount: number;
  npcCount: number;
  encounterCount: number;
  avgDC: number;
}

interface PartyMember {
  id: string;
  name: string;
  char_class: string;
  level: number;
  hp_current: number;
  hp_max: number;
  user_name: string;
  user_avatar: string | null;
}

interface Note {
  id: string;
  title: string;
  content: string | null;
  tag: string;
  created_at: string;
  author_name: string;
}

interface DmDashboardProps {
  campaign: Tables<'campaigns'>;
  stats: CampaignStats;
  encounter: Tables<'encounters'> | null;
  partyMembers: PartyMember[];
  recentNotes: Note[];
}

export function DmDashboard({
  campaign,
  stats,
  encounter,
  partyMembers,
  recentNotes,
}: DmDashboardProps) {
  const sessionNumber = Math.ceil(recentNotes.length / 2) || 1;
  const sessionTitle = 'Campaign Session';

  return (
    <div className="flex flex-col gap-6">
      <HeroBanner
        campaignName={campaign.name}
        sessionNumber={sessionNumber}
        sessionTitle={sessionTitle}
      />

      <QuickStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NextEncounterCard encounter={encounter as any} />
        </div>
        <PartyOverview members={partyMembers} />
      </div>

      <RecentNotesRow notes={recentNotes} />
    </div>
  );
}
