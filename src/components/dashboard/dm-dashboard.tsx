import React from 'react';
import { HeroBanner } from './hero-banner';
import { QuickStats } from './quick-stats';
import { NextEncounterCard } from './next-encounter-card';
import { PartyOverview } from './party-overview';
import { RecentNotesRow } from './recent-notes-row';

interface Enemy {
  name: string;
  hp: number;
  ac: number;
  atk: string | number;
  dmg?: string;
}

interface Encounter {
  name: string;
  description: string;
  status: string;
  enemies: Enemy[];
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

interface RecentNote {
  id: string;
  title: string;
  content: string | null;
  tag: string;
  created_at: string;
  author_name: string;
}

interface CampaignStats {
  playerCount: number;
  npcCount: number;
  encounterCount: number;
  avgDC: number;
}

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

interface DMDashboardProps {
  campaign: Campaign;
  stats: CampaignStats;
  encounter: Encounter | null;
  partyMembers: PartyMember[];
  recentNotes: RecentNote[];
}

export const DMDashboard: React.FC<DMDashboardProps> = ({
  campaign,
  stats,
  encounter,
  partyMembers,
  recentNotes,
}) => {
  // Map stats to QuickStats format
  const quickStats = {
    playerCount: stats.playerCount,
    npcCount: stats.npcCount,
    encounterCount: stats.encounterCount,
    avgSuccessRate: stats.avgDC,
  };

  // Map party members to PartyOverview format
  const mappedMembers = partyMembers.map((m) => ({
    name: m.name,
    class: m.char_class,
    level: m.level,
    currentHp: m.hp_current,
    maxHp: m.hp_max,
    avatarUrl: m.user_avatar ?? undefined,
  }));

  // Map notes to RecentNotesRow format
  const mappedNotes = recentNotes.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content ?? '',
    tag: n.tag,
    createdAt: new Date(n.created_at),
    authorName: n.author_name,
  }));

  return (
    <div className="w-full space-y-6">
      <HeroBanner
        campaignName={campaign.name}
        sessionNumber={0}
        sessionTitle={campaign.description ?? ''}
      />

      <QuickStats stats={quickStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NextEncounterCard encounter={encounter ?? undefined} />
        <PartyOverview members={mappedMembers} />
      </div>

      <RecentNotesRow notes={mappedNotes} />
    </div>
  );
};
