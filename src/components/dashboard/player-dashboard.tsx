import { CharacterBanner } from './character-banner';
import { InspirationBadge } from './inspiration-badge';
import { CampaignFeed } from './campaign-feed';
import { ProbabilityCheckWidget } from './probability-check-widget';
import type { Tables } from '@/types/schema';

interface FeedItem {
  id: string;
  type: 'session_log' | 'quest' | 'map_update';
  title: string;
  description: string;
  category: string;
  timestamp: string;
}

interface PlayerDashboardProps {
  character: Tables<'characters'> | null;
  feedItems: FeedItem[];
  hasInspiration: boolean;
}

export function PlayerDashboard({
  character,
  feedItems,
  hasInspiration,
}: PlayerDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <CharacterBanner character={character as any} />

      <InspirationBadge hasInspiration={hasInspiration} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CampaignFeed feedItems={feedItems} />
        </div>
        <ProbabilityCheckWidget />
      </div>
    </div>
  );
}
