import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string | null;
  tag: string;
  created_at: string;
  author_name: string;
}

interface RecentNotesRowProps {
  notes: Note[];
}

function getTagColor(tag: string): { bg: string; text: string } {
  const tagColorMap: { [key: string]: { bg: string; text: string } } = {
    session_log: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
    world_lore: { bg: 'bg-purple-500/20', text: 'text-purple-300' },
    plot: { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
    dm_secret: { bg: 'bg-red-500/20', text: 'text-red-300' },
  };
  return tagColorMap[tag] || { bg: 'bg-gray-500/20', text: 'text-gray-300' };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function RecentNotesRow({ notes }: RecentNotesRowProps) {
  if (notes.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Notes</h2>
        </div>
        <div className="bg-[#0f0f23] border border-white/5 rounded-xl p-12 flex items-center justify-center min-h-[200px] text-white/40">
          <p>Start documenting your campaign</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Recent Notes</h2>
        <Link
          href="/campaign/story-notes"
          className="inline-flex items-center gap-2 text-[#7c3aed] hover:text-[#a78bfa] text-sm font-semibold transition-colors"
        >
          VIEW ALL
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note) => {
          const tagColor = getTagColor(note.tag);
          return (
            <div
              key={note.id}
              className="bg-[#0f0f23] border border-white/5 rounded-xl p-4 flex flex-col"
            >
              <div className="mb-3">
                <span
                  className={`text-xs uppercase font-semibold px-2 py-1 rounded ${tagColor.bg} ${tagColor.text}`}
                >
                  {note.tag.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">
                {note.title}
              </h3>
              {note.content && (
                <p className="text-xs text-white/60 mb-3 line-clamp-2">
                  {note.content}
                </p>
              )}
              <div className="mt-auto text-xs text-white/40">
                {formatDate(note.created_at)} by {note.author_name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
