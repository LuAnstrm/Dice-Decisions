import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: Date;
  authorName: string;
}

interface RecentNotesRowProps {
  notes: Note[];
}

const getTagColor = (tag: string): string => {
  const colorMap: Record<string, string> = {
    combat: 'bg-red-500/20 text-red-300',
    story: 'bg-blue-500/20 text-blue-300',
    npc: 'bg-purple-500/20 text-purple-300',
    loot: 'bg-yellow-500/20 text-yellow-300',
    quest: 'bg-green-500/20 text-green-300',
    encounter: 'bg-orange-500/20 text-orange-300',
    note: 'bg-white/10 text-white/70',
  };
  return colorMap[tag.toLowerCase()] || 'bg-white/10 text-white/70';
};

const truncateContent = (content: string, maxLength: number = 120): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

export const RecentNotesRow: React.FC<RecentNotesRowProps> = ({ notes }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Recent Notes</h2>
        <a
          href="/campaign/story-notes"
          className="text-[var(--color-accent)] hover:underline text-sm font-semibold transition-colors"
        >
          VIEW ALL
        </a>
      </div>

      {/* Notes Grid */}
      {notes && notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              className="card-base card-hover p-6 cursor-pointer"
            >
              {/* Tag Badge */}
              <div className="mb-3">
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${getTagColor(note.tag)}`}
                >
                  {note.tag.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2">
                {note.title}
              </h3>

              {/* Content Preview */}
              <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-3">
                {truncateContent(note.content)}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span className="font-mono">
                  {note.authorName}
                </span>
                <span>
                  {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-base py-12 flex items-center justify-center">
          <p className="text-[var(--color-text-muted)] text-center">No notes yet. Start documenting your session!</p>
        </div>
      )}
    </div>
  );
};
