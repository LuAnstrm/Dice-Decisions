import { Users } from 'lucide-react';

interface PartyMember {
  id: string;
  name: string;
  char_class: string;
  level: number;
  hp_current: number;
  hp_max: number;
  user_name: string;
  user_avatar: string | null;
}

interface PartyOverviewProps {
  members: PartyMember[];
}

function getHPColor(current: number, max: number): string {
  const percentage = (current / max) * 100;
  if (percentage > 60) return 'bg-green-500';
  if (percentage >= 30) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getClassColor(charClass: string): string {
  const classColorMap: { [key: string]: string } = {
    rogue: 'text-purple-400',
    warrior: 'text-red-400',
    mage: 'text-blue-400',
    cleric: 'text-emerald-400',
    bard: 'text-pink-400',
    ranger: 'text-orange-400',
    paladin: 'text-yellow-400',
    barbarian: 'text-red-500',
  };
  return classColorMap[charClass.toLowerCase()] || 'text-[#7c3aed]';
}

export function PartyOverview({ members }: PartyOverviewProps) {
  if (members.length === 0) {
    return (
      <div className="bg-[#0f0f23] border border-white/5 rounded-xl p-6 flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-[#7c3aed]" />
          <h2 className="text-xl font-bold text-white">Party Overview</h2>
        </div>
        <div className="flex items-center justify-center min-h-[300px] text-white/40">
          <p>No party members yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f23] border border-white/5 rounded-xl p-6 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-5 h-5 text-[#7c3aed]" />
        <h2 className="text-xl font-bold text-white">Party Overview</h2>
      </div>

      <div className="space-y-4">
        {members.map((member) => {
          const hpPercentage = (member.hp_current / member.hp_max) * 100;
          return (
            <div key={member.id} className="pb-4 border-b border-white/5 last:border-0">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#16161f] border border-white/10 flex items-center justify-center flex-shrink-0">
                  {member.user_avatar ? (
                    <img
                      src={member.user_avatar}
                      alt={member.user_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white/60">
                      {member.user_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {member.name}
                  </p>
                  <p className={`text-xs font-semibold ${getClassColor(member.char_class)}`}>
                    LV.{member.level} {member.char_class.toUpperCase()}
                  </p>
                </div>
                <p className="text-xs text-white/60 font-mono flex-shrink-0">
                  {member.hp_current}/{member.hp_max} HP
                </p>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${getHPColor(member.hp_current, member.hp_max)}`}
                  style={{ width: `${hpPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
