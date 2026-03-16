'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Flame,
  Dices,
  BrainCircuit,
  ScrollText,
  Swords,
  Users,
  MapPin,
  UserCircle,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole } from '@/components/providers/role-provider';
import { useSidebarCollapse } from '@/components/providers/sidebar-provider';
import { D20Logo } from '@/components/shared/d20-logo';
import { BadgeRpg } from '@/components/shared/badge-rpg';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { NavGroup } from '@/types';

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'PROBABILITY',
    items: [
      { label: 'Probability Cards', href: '/probability/cards', icon: Flame },
      { label: 'Dice Visualizer', href: '/probability/dice-visualizer', icon: Dices },
      { label: 'Bayes Analyzer', href: '/probability/bayes-analyzer', icon: BrainCircuit },
    ],
  },
  {
    title: 'CAMPAIGN',
    items: [
      { label: 'Story Notes', href: '/campaign/story-notes', icon: ScrollText, dmOnly: true },
      { label: 'Encounters', href: '/campaign/encounters', icon: Swords, dmOnly: true },
      { label: 'NPCs', href: '/campaign/npcs', icon: Users },
      { label: 'Player Notes', href: '/campaign/player-notes', icon: ScrollText },
    ],
  },
  {
    title: 'WORLD',
    items: [
      { label: 'Maps', href: '/maps', icon: MapPin },
    ],
  },
  {
    title: 'CHARACTERS',
    items: [
      { label: 'Party', href: '/characters', icon: UserCircle },
    ],
  },
];

export function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebarCollapse();
  const pathname = usePathname();
  const { role, isDM } = useRole();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)] transition-all duration-300 fixed left-0 top-0 z-30',
        isCollapsed ? 'w-[64px]' : 'w-[260px]',
      )}
    >
      {/* Header with logo and collapse button */}
      <div className="flex items-center justify-between px-4 py-5 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <D20Logo size={32} />
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                Dice & Decisions
              </h1>
              <BadgeRpg variant={isDM ? 'role-dm' : 'role-player'} className="text-xs">
                {isDM ? 'DM' : 'PLAYER'}
              </BadgeRpg>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-white/5 transition-colors flex-shrink-0"
          title={isCollapsed ? 'Expand' : 'Collapse'}
          type="button"
        >
          <ChevronLeft
            size={18}
            className={cn(
              'text-[var(--color-text-muted)] transition-transform duration-300',
              isCollapsed && 'rotate-180',
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.dmOnly || isDM,
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title}>
              {!isCollapsed && (
                <p className="uppercase text-[11px] font-semibold tracking-[0.15em] text-[var(--color-accent)] opacity-60 mt-6 mb-2 px-3 first:mt-3">
                  {group.title}
                </p>
              )}
              {visibleItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger
                      render={
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 relative group',
                            isActive
                              ? 'text-[var(--color-accent-secondary)] bg-[rgba(var(--color-accent-rgb),0.08)]'
                              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[#1a1a2e]',
                          )}
                        />
                      }
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-accent)] rounded-r" />
                      )}
                      <Icon
                        size={20}
                        className={cn(
                          'shrink-0',
                          isActive
                            ? 'text-[var(--color-accent-secondary)]'
                            : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]',
                        )}
                      />
                      {!isCollapsed && (
                        <span>
                          {role === 'player' && item.label === 'Party'
                            ? 'Character Sheet'
                            : item.label}
                        </span>
                      )}
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className={cn(
        'px-4 py-4 border-t border-[var(--color-border)] flex-shrink-0',
        isCollapsed ? 'flex flex-col items-center gap-3' : 'flex items-center gap-2'
      )}>
        {isCollapsed && (
          <Link
            href="/settings"
            className="hover:text-[var(--color-text-secondary)] transition-colors p-2 rounded-lg hover:bg-white/5"
            title="Settings"
          >
            <Settings
              size={20}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
            />
          </Link>
        )}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {isDM ? 'D' : 'P'}
        </div>
        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                {isDM ? 'Dungeon Master' : 'Player'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {isDM ? 'DM Mode' : 'Player Mode'}
              </p>
            </div>
            <Link
              href="/settings"
              className="hover:text-[var(--color-text-secondary)] transition-colors p-2 rounded-lg hover:bg-white/5 flex-shrink-0"
              title="Settings"
            >
              <Settings
                size={18}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              />
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
