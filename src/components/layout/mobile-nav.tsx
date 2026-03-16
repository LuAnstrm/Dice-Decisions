'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Dices, ScrollText, MapPin, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole } from '@/components/providers/role-provider';

const MOBILE_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Probability', href: '/probability/cards', icon: Dices },
  { label: 'Campaign', href: '/campaign/story-notes', icon: ScrollText, dmOnly: true },
  { label: 'Maps', href: '/maps', icon: MapPin },
  { label: 'Character', href: '/characters', icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isDM } = useRole();

  const visibleItems = MOBILE_NAV_ITEMS.filter((item) => !item.dmOnly || isDM);

  return (
    <nav className="md:hidden fixed bottom-8 left-0 right-0 z-40 h-16 flex items-center justify-around px-2 bg-[rgba(10,10,15,0.9)] backdrop-blur-md border-t border-white/5" style={{ bottom: '32px' }}>
      {visibleItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href.split('/').slice(0, 2).join('/')));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 py-2 px-3 flex-1 justify-center"
            title={item.label}
          >
            <Icon
              size={24}
              className={cn(
                'transition-colors',
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)]',
              )}
            />
            <span
              className={cn(
                'text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)]',
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
