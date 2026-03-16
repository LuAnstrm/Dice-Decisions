'use client';

import { Heart, Shield, Zap, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CharacterBannerProps {
  character: {
    name: string;
    race: string;
    char_class: string;
    level: number;
    hp_current: number;
    hp_max: number;
    armor_class: number;
    speed: number;
  } | null;
  campaignId?: string;
}

export function CharacterBanner({ character, campaignId }: CharacterBannerProps) {
  if (!character) {
    return (
      <div className="card-base p-12 flex flex-col items-center justify-center min-h-[250px]">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Create Your Character</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 text-center max-w-sm">
          Design your hero and begin your adventure in this campaign.
        </p>
        <Button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white">
          Get Started
        </Button>
      </div>
    );
  }

  const statPills = [
    {
      icon: Heart,
      label: `HP: ${character.hp_current}/${character.hp_max}`,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
    },
    {
      icon: Shield,
      label: `AC: ${character.armor_class}`,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
    },
    {
      icon: Zap,
      label: 'INIT: +2',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
    },
    {
      icon: Footprints,
      label: `SPD: ${character.speed}ft`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
    },
  ];

  return (
    <div className="card-base p-8 mb-6">
      <div className="flex gap-8 mb-6">
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center flex-shrink-0 border border-[var(--color-border)]">
          <span className="text-2xl font-bold text-white">
            {character.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] font-[family-name:var(--font-display)] mb-1">{character.name}</h1>
          <p className="text-[var(--color-text-secondary)]">
            {character.race} {character.char_class}{' '}
            <span className="text-[var(--color-accent)]">Level {character.level}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {statPills.map((pill, idx) => {
          const Icon = pill.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${pill.bg}`}
            >
              <Icon className={`w-4 h-4 ${pill.color}`} />
              <span className="text-sm font-semibold text-white">{pill.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-white/10">
          Edit Character
        </Button>
        <Button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white shadow-lg shadow-[var(--color-glow)]">
          View Full Sheet
        </Button>
      </div>
    </div>
  );
}
