import React from 'react';
import { Skull, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
      <div className="card-base p-8 h-full flex items-center justify-center">
        <p className="text-[var(--color-text-muted)] text-center">No encounter planned</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-base text-[var(--color-text-primary)]">
          Next Encounter
        </h4>
        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 font-mono font-medium text-[10px] rounded-full tracking-wider uppercase">
          {encounter.status.toUpperCase()}
        </span>
      </div>

      <div className="card-base p-6 flex flex-col gap-4">
        <div>
          <h5 className="font-semibold text-lg text-[var(--color-text-primary)]">
            {encounter.name}
          </h5>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
            {encounter.description}
          </p>
        </div>

        {/* Enemies List */}
        <div className="flex flex-col gap-3 my-2">
          {encounter.enemies.map((enemy, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skull size={18} className="text-red-400 shrink-0" />
              <span className="font-medium text-[13px] text-[var(--color-text-primary)]">
                {enemy.name}
              </span>
              <span className="font-mono text-xs text-[var(--color-text-muted)] ml-auto">
                HP: {enemy.hp} | AC: {enemy.ac} | ATK: {enemy.atk}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/probability/cards"
          className="flex items-center gap-1 font-medium text-[13px] text-[var(--color-accent)] hover:underline w-fit"
        >
          View Probability Cards
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
