import React from 'react';
import { Skull, Link as LinkIcon } from 'lucide-react';

interface Enemy {
  name: string;
  hp: number;
  ac: number;
  atk: string | number;
}

interface Encounter {
  name: string;
  description: string;
  status: string;
  enemies: Enemy[];
}

interface NextEncounterCardProps {
  encounter?: Encounter;
}

export const NextEncounterCard: React.FC<NextEncounterCardProps> = ({ encounter }) => {
  if (!encounter) {
    return (
      <div className="bg-[#0f0f23] border border-white/5 rounded-lg p-8 h-full flex items-center justify-center">
        <p className="text-white/50 text-center">No encounter planned</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f23] border border-white/5 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Next Encounter</h2>
        <span className="text-xs font-semibold px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
          {encounter.status.toUpperCase()}
        </span>
      </div>

      {/* Encounter Info */}
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-xl font-bold text-white mb-2">
          {encounter.name}
        </h3>
        <p className="text-white/60 text-sm">
          {encounter.description}
        </p>
      </div>

      {/* Enemies List */}
      <div className="flex-1 px-6 py-4">
        <h4 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-semibold">
          Enemies
        </h4>
        <div className="space-y-3">
          {encounter.enemies.map((enemy, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <Skull size={18} className="text-red-400" />
                <span className="font-semibold text-white">{enemy.name}</span>
              </div>
              <div className="flex gap-4 text-xs font-mono text-white/60">
                <span>HP: <span className="text-white">{enemy.hp}</span></span>
                <span>AC: <span className="text-white">{enemy.ac}</span></span>
                <span>ATK: <span className="text-white">{enemy.atk}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-white/5 px-6 py-4">
        <a
          href="#"
          className="flex items-center gap-2 text-[#7c3aed] hover:text-[#a78bfa] text-sm font-semibold transition-colors"
        >
          <LinkIcon size={16} />
          View Probability Cards
        </a>
      </div>
    </div>
  );
};
