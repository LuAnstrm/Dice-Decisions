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
  statusText?: string;
  statusColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, badge, statusText, statusColor }) => {
  return (
    <div className="card-base card-hover p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {statusText && (
          <span className={`text-[10px] ${statusColor} px-2 py-0.5 rounded font-bold`}>
            {statusText}
          </span>
        )}
      </div>

      <p className="text-[var(--color-text-secondary)] text-xs font-bold uppercase tracking-wider mb-1">
        {label}
      </p>

      <div className="flex items-baseline gap-1">
        <p className="text-3xl font-bold text-[var(--color-text-primary)] font-mono">
          {value}
        </p>
        {badge && (
          <span className="text-sm text-[var(--color-text-muted)] font-mono">
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
        icon={<Users size={24} className="text-green-400" />}
        label="Active Players"
        value={stats.playerCount}
        color="bg-green-500/20"
        statusText={stats.playerCount > 0 ? `${stats.playerCount} Active` : undefined}
        statusColor="text-green-500 bg-green-500/10"
      />
      <StatCard
        icon={<UserPlus size={24} className="text-blue-400" />}
        label="NPCs"
        value={stats.npcCount}
        color="bg-blue-500/20"
      />
      <StatCard
        icon={<Swords size={24} className="text-red-400" />}
        label="Encounters"
        value={stats.encounterCount}
        color="bg-red-500/20"
      />
      <StatCard
        icon={<TrendingUp size={24} className="text-[var(--color-accent)]" />}
        label="Avg Success Rate"
        value={stats.avgSuccessRate}
        color="bg-[var(--color-accent)]/20"
        badge="%"
      />
    </div>
  );
};
