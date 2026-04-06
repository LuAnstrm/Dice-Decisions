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
  const initialTheme = 'fantasy';
  const initialRole = 'player';

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
