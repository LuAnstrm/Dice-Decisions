'use client';

import { useState } from 'react';
import { useTheme } from '@/components/providers/theme-provider';
import { Sparkles, Rocket, Star, Eye, Cog, Check } from 'lucide-react';

const THEMES = [
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Classic fantasy adventure',
    icon: Sparkles,
    gradient: 'from-purple-900 to-indigo-800',
  },
  {
    id: 'scifi',
    name: 'Sci-Fi',
    description: 'Futuristic space theme',
    icon: Rocket,
    gradient: 'from-cyan-900 to-blue-950',
  },
  {
    id: 'western',
    name: 'Western',
    description: 'Rugged frontier style',
    icon: Star,
    gradient: 'from-amber-900 to-yellow-800',
  },
  {
    id: 'eldritch',
    name: 'Eldritch',
    description: 'Dark cosmic horror',
    icon: Eye,
    gradient: 'from-emerald-900 to-gray-950',
  },
  {
    id: 'steampunk',
    name: 'Steampunk',
    description: 'Victorian industrial',
    icon: Cog,
    gradient: 'from-yellow-800 to-stone-900',
  },
];

interface ThemeSelectorProps {
  currentTheme: string;
}

export function ThemeSelector({ currentTheme }: ThemeSelectorProps) {
  const { setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    setTheme(themeId as any);
    // Fire-and-forget DB update (no await)
    // This would be handled in the parent component or a server action
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-2">Theme</h2>
      <p className="text-white/60 text-sm mb-6">Choose your visual experience</p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`relative p-6 rounded-lg h-40 flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'border-2 border-[#7c3aed] shadow-lg shadow-purple-500/50'
                  : 'border border-white/10 hover:border-white/20'
              } bg-gradient-to-br ${theme.gradient}`}
              style={{ opacity: isSelected ? 1 : 0.8 }}
            >
              {isSelected && (
                <Check className="absolute top-2 right-2 w-5 h-5 text-green-400" />
              )}
              <Icon className="w-8 h-8 text-white mb-2" />
              <p className="text-white font-bold text-sm">{theme.name}</p>
              <p className="text-white/60 text-xs text-center">{theme.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
