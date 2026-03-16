import React from 'react';
import { Shield } from 'lucide-react';

interface PartyMember {
  name: string;
  class: string;
  level: number;
  currentHp: number;
  maxHp: number;
  avatarUrl?: string;
}

interface PartyOverviewProps {
  members: PartyMember[];
}

const getHpBarColor = (percentage: number): string => {
  if (percentage > 60) return 'bg-green-500';
  if (percentage > 30) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const PartyOverview: React.FC<PartyOverviewProps> = ({ members }) => {
  if (!members || members.length === 0) {
    return (
      <div className="card-base p-8 h-full flex items-center justify-center">
        <p className="text-[var(--color-text-muted)] text-center">No party members yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-bold text-lg text-[var(--color-text-primary)] flex items-center gap-2">
        <Shield size={20} className="text-[var(--color-accent)]" />
        Party Overview
      </h4>

      <div className="card-base p-6 flex flex-col gap-6">
        {members.map((member, index) => {
          const hpPercentage = Math.round((member.currentHp / member.maxHp) * 100);
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)]">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                      Lv. {member.level} {member.class}
                    </p>
                  </div>
                </div>
                <p className="font-mono text-sm text-[var(--color-text-primary)]">
                  {member.currentHp}/{member.maxHp} HP
                </p>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getHpBarColor(hpPercentage)}`}
                  style={{ width: `${hpPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
