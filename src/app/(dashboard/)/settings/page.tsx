import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';
import { Topbar } from '@/components/layout/topbar';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { ProfileForm } from '@/components/settings/profile-form';
import { SystemPreferences } from '@/components/settings/system-preferences';
import { AccountManagement } from '@/components/settings/account-management';

export const metadata = {
  title: 'Settings | Dice & Decisions',
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Tables<'profiles'>>();

  if (!profile) {
    redirect('/login');
  }

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 lg:p-8 max-w-4xl">
        <ThemeSelector currentTheme={profile.selected_theme || 'fantasy'} />
        <ProfileForm
          profile={{
            display_name: profile.display_name,
            email: profile.email,
            avatar_url: profile.avatar_url,
          }}
        />
        <SystemPreferences currentRole={profile.preferred_role || 'player'} />
        <AccountManagement />
      </div>
    </>
  );
}
