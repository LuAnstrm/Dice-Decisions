import React from 'react';

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

const getClassColor = (classType: string): string => {
  const colorMap: Record<string, string> = {
    rogue: 'bg-purple-500/20 text-purple-300',
    warrior: 'bg-red-500/20 text-red-300',
    mage: 'bg-blue-500/20 text-blue-300',
    cleric: 'bg-yellow-500/20 text-yellow-300',
    ranger: 'bg-green-500/20 text-green-300',
    paladin: 'bg-orange-500/20 text-orange-300',
    bard: 'bg-pink-500/20 text-pink-300',
  };
  return colorMap[classType.toLowerCase()] || 'bg-white/10 text-white/80';
};

export const PartyOverview: React.FC<PartyOverviewProps> = ({ members }) => {
  if (!members || members.length === 0) {
    return (
      <div className="bg-[#0f0f23] border border-white/5 rounded-lg p-8 h-full flex items-center justify-center">
        <p className="text-white/50 text-center">No party members yet</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f23] border border-white/5 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4">
        <h2 className="text-lg font-bold text-white">Party Overview</h2>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {members.map((member, index) => {
            const hpPercentage = (member.currentHp / member.maxHp) * 100;
            return (
              <div key={index} className="border-b border-white/5 pb-4 last:border-b-0">
                {/* Avatar & Name */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]">
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
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getClassColor(member.class)}`}
                      >
                        {member.class}
                      </span>
                      <span className="text-xs text-white/50 font-mono">
                        Lvl {member.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* HP Display */}
                <div className="pl-15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60 font-mono">HP</span>
                    <span className="text-sm font-mono text-white">
                      {member.currentHp} / {member.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getHpBarColor(hpPercentage)}`}
                      style={{ width: `${hpPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
