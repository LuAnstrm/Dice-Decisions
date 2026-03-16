import { Skull, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Enemy {
  name: string;
  hp?: number;
  ac?: number;
  attack_bonus?: number;
}

interface NextEncounterCardProps {
  encounter: {
    name: string;
    description: string | null;
    status: string;
    enemies: Enemy[];
  } | null;
}

export function NextEncounterCard({ encounter }: NextEncounterCardProps) {
  if (!encounter) {
    return (
      <div className="bg-[#0f0f23] border border-white/5 rounded-xl p-6 flex-1">
        <h2 className="text-xl font-bold text-white mb-6">Next Encounter</h2>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-white/40">
          <p>No encounters planned yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f23] border border-white/5 rounded-xl p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Next Encounter</h2>
        <span className="text-xs uppercase font-semibold px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full">
          {encounter.status}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{encounter.name}</h3>
      {encounter.description && (
        <p className="text-sm text-white/60 mb-4 line-clamp-2">
          {encounter.description}
        </p>
      )}

      <div className="space-y-3 mb-6">
        {encounter.enemies && encounter.enemies.length > 0 ? (
          encounter.enemies.map((enemy, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 pb-3 border-b border-white/5 last:border-0"
            >
              <Skull className="w-4 h-4 text-red-400" />
              <span className="text-white font-semibold flex-1">{enemy.name}</span>
              <span className="text-xs font-mono text-green-400">
                HP: {enemy.hp || '?'} | AC: {enemy.ac || '?'} | ATK: +
                {enemy.attack_bonus || '0'}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/40">No enemies added yet</p>
        )}
      </div>

      <Link
        href="/probability"
        className="inline-flex items-center gap-2 text-[#7c3aed] hover:text-[#a78bfa] text-sm font-semibold transition-colors"
      >
        View Probability Cards
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
