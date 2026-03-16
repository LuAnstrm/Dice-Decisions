import { Users, UserPlus, Swords, TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  stats: {
    playerCount: number;
    npcCount: number;
    encounterCount: number;
    avgDC: number;
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  const cards = [
    {
      label: 'ACTIVE PLAYERS',
      value: stats.playerCount,
      icon: Users,
      color: 'bg-green-500/20',
      iconColor: 'text-green-400',
      badge: '+1 Active',
    },
    {
      label: 'NPCS CREATED',
      value: stats.npcCount,
      icon: UserPlus,
      color: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'ENCOUNTERS',
      value: stats.encounterCount,
      icon: Swords,
      color: 'bg-red-500/20',
      iconColor: 'text-red-400',
    },
    {
      label: 'AVG. DC',
      value: stats.avgDC,
      icon: TrendingUp,
      color: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-[#0f0f23] border border-white/5 rounded-xl p-6 flex flex-col items-start"
          >
            <div className={`${card.color} p-3 rounded-full mb-4`}>
              <Icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
              {card.label}
            </p>
            <p className="text-4xl font-bold text-white font-mono mb-2">
              {card.value}
            </p>
            {card.badge && (
              <p className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                {card.badge}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
