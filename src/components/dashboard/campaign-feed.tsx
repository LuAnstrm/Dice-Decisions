import { Clock, BookOpen, Flag, Map, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeedItem {
  id: string;
  type: 'session_log' | 'quest' | 'map_update';
  title: string;
  description: string;
  category: string;
  timestamp: string;
}

interface CampaignFeedProps {
  feedItems: FeedItem[];
}

function getFeedItemIcon(type: string): React.ReactNode {
  const icons: { [key: string]: React.ReactNode } = {
    session_log: <BookOpen className="w-4 h-4" />,
    quest: <Flag className="w-4 h-4" />,
    map_update: <Map className="w-4 h-4" />,
  };
  return icons[type] || <Clock className="w-4 h-4" />;
}

function getFeedItemColor(type: string): string {
  const colors: { [key: string]: string } = {
    session_log: 'bg-blue-500/20 text-blue-300',
    quest: 'bg-green-500/20 text-green-300',
    map_update: 'bg-amber-500/20 text-amber-300',
  };
  return colors[type] || 'bg-white/5 text-white/60';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

export function CampaignFeed({ feedItems }: CampaignFeedProps) {
  if (feedItems.length === 0) {
    return (
      <div className="card-base p-6 flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-[var(--color-text-muted)]" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Campaign Feed</h2>
        </div>
        <div className="flex items-center justify-center min-h-[300px] text-[var(--color-text-muted)]">
          <p>No campaign activity yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base p-6 flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[var(--color-text-muted)]" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Campaign Feed</h2>
        </div>
        <Link href="/campaign" className="text-[var(--color-accent)] hover:underline text-sm font-semibold">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {feedItems.map((item, idx) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-text-secondary)]">
                {getFeedItemIcon(item.type)}
              </div>
              {idx < feedItems.length - 1 && (
                <div className="w-0.5 h-8 bg-[var(--color-border)] mt-2" />
              )}
            </div>
            <div className="pb-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{item.title}</h3>
                <span
                  className={`text-xs uppercase font-semibold px-2 py-0.5 rounded-full ${getFeedItemColor(item.type)}`}
                >
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">{formatDate(item.timestamp)}</p>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
