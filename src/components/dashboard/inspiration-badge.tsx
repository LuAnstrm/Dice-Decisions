import { Star } from 'lucide-react';

interface InspirationBadgeProps {
  hasInspiration: boolean;
}

export function InspirationBadge({ hasInspiration }: InspirationBadgeProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg mb-6 border ${
        hasInspiration
          ? 'bg-green-500/10 border-green-500/20'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <Star
        className={`w-5 h-5 ${hasInspiration ? 'text-green-400 fill-green-400' : 'text-white/40'}`}
      />
      <span className={`text-sm font-semibold ${hasInspiration ? 'text-green-300' : 'text-white/40'}`}>
        {hasInspiration ? 'Inspiration Available' : 'No Inspiration'}
      </span>
    </div>
  );
}
