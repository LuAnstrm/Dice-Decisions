import React from 'react';
import { Users, UserPlus, Swords, TrendingUp } from 'lucide-react';

interface StatsObject {
  playerCount: number;
  npcCount: number;
  encounterCount: number;
  avgSuccessRate: number;
}

interface QuickStatsProps {
  stats: StatsObject;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  badge?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, badge }) => {
  return (
    <div className="bg-[#0f0f23] border border-white/5 rounded-lg p-6">
      {/* Icon Container */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>

      {/* Label */}
      <p className="text-white/60 text-xs uppercase tracking-widest mb-3">
        {label}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white font-mono">
          {value}
        </p>
        {badge && (
          <span className="text-xs text-white/50 font-mono">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <StatCard
        icon={<Users size={24} className="text-white" />}
        label="Active Players"
        value={stats.playerCount}
        color="bg-green-500/20"
      />
      <StatCard
        icon={<UserPlus size={24} className="text-white" />}
        label="NPCs"
        value={stats.npcCount}
        color="bg-blue-500/20"
      />
      <StatCard
        icon={<Swords size={24} className="text-white" />}
        label="Encounters"
        value={stats.encounterCount}
        color="bg-red-500/20"
      />
      <StatCard
        icon={<TrendingUp size={24} className="text-white" />}
        label="Avg Success Rate"
        value={stats.avgSuccessRate}
        color="bg-purple-500/20"
        badge="%"
      />
    </div>
  );
};
