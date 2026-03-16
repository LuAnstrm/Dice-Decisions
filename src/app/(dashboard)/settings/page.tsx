'use client';

import { Topbar } from '@/components/layout/topbar';
import { useTheme } from '@/hooks/use-theme';
import { useRole } from '@/hooks/use-role';
import { useAuth } from '@/hooks/use-auth';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { ProfileForm } from '@/components/settings/profile-form';
import { SystemPreferences } from '@/components/settings/system-preferences';
import { AccountManagement } from '@/components/settings/account-management';

export default function SettingsPage() {
  const { theme } = useTheme();
  const { role } = useRole();
  const { user, profile } = useAuth();

  const fallbackName = profile?.display_name ?? 'Dungeon Master';
  const fallbackEmail = user?.email ?? 'master@diceanddecisions.com';
  const fallbackAvatar = profile?.avatar_url ?? null;

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 lg:p-8">
        <div className="max-w-6xl space-y-8 rounded-2xl border border-white/8 bg-black/15 p-6 lg:p-8">
          <ThemeSelector currentTheme={theme} />
          <ProfileForm
            profile={{
              display_name: fallbackName,
              email: fallbackEmail,
              avatar_url: fallbackAvatar,
            }}
          />
          <SystemPreferences currentRole={role} />
          <AccountManagement />
        </div>
      </div>
    </>
  );
}
