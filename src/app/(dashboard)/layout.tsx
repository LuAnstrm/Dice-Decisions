import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { RoleProvider } from '@/components/providers/role-provider';
import { SidebarProvider } from '@/components/providers/sidebar-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { MainContent } from '@/components/layout/main-content';
import { MobileNav } from '@/components/layout/mobile-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth guard: redirect to login if not authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Tables<'profiles'>>();

  const initialTheme = (profile?.selected_theme as any) ?? 'fantasy';
  const initialRole = (profile?.preferred_role as any) ?? 'player';

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <RoleProvider initialRole={initialRole}>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <MainContent>{children}</MainContent>
            <MobileNav />
          </div>
        </SidebarProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
