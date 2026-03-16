'use client';

import { Topbar } from '@/components/layout/topbar';
import { useTheme } from '@/hooks/use-theme';
import { useRole } from '@/hooks/use-role';
import { themes } from '@/styles/themes';
import { Palette, User, Sliders, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { role, setRole } = useRole();

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 lg:p-8 max-w-4xl space-y-8">
        {/* Theme Selection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold text-white">Theme</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(themes).map(([id, t]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id as any)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  theme === id
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                    : 'border-white/8 bg-black/20 hover:border-white/15'
                }`}
              >
                <span className="text-sm font-medium text-white">{t.name}</span>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{t.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Role Selection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Sliders className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold text-white">Preferred Role</h2>
          </div>
          <div className="flex gap-3">
            {(['dm', 'player'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-xl border px-6 py-3 text-sm font-medium transition-all ${
                  role === r
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white'
                    : 'border-white/8 bg-black/20 text-[var(--color-text-secondary)] hover:border-white/15'
                }`}
              >
                {r === 'dm' ? 'Dungeon Master' : 'Player'}
              </button>
            ))}
          </div>
        </section>

        {/* Profile placeholder */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Profile editing will be available in a future update.
            </p>
          </div>
        </section>

        {/* Account placeholder */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold text-white">Account</h2>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Account management will be available in a future update.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
