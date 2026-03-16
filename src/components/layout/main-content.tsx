'use client';

import { useSidebarCollapse } from '@/components/providers/sidebar-provider';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { isCollapsed } = useSidebarCollapse();

  return (
    <main
      className={cn(
        'flex-1 transition-all duration-300 pb-32 md:pb-10',
        isCollapsed ? 'md:ml-[64px]' : 'md:ml-[260px]',
      )}
    >
      {children}
    </main>
  );
}
