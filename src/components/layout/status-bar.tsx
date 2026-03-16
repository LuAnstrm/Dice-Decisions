'use client';

import { usePathname } from 'next/navigation';

export function StatusBar() {
  const pathname = usePathname();

  const getStatusText = (): string => {
    if (pathname === '/dashboard') {
      return 'SYSTEM_STATUS: NOMINAL -- SESSION: ACTIVE -- PLAYERS: 4 -- ENCOUNTERS: 7';
    }
    if (pathname.startsWith('/probability')) {
      return 'CALC_ENGINE: v4.2 -- PRECISION: 10^-6 -- MODE: COMBINATORICS';
    }
    if (pathname.startsWith('/campaign')) {
      return 'DUNGEON_BIAS: MINIMAL -- SEED: 0x8F2A -- INK_LEVEL: FULL';
    }
    if (pathname.startsWith('/maps')) {
      return 'SYNCED -- MAP_VERSION: 1.0.4-BETA -- GRID: 32px';
    }
    if (pathname.startsWith('/settings')) {
      return 'CONFIG_MODE: ACTIVE -- CHANGES: UNSAVED -- PROFILE: LOADED';
    }
    if (pathname.startsWith('/characters')) {
      return 'CHARACTER_SHEET: LOADED -- VERSION: 5E -- STATUS: ACTIVE';
    }
    return 'READY -- AWAITING INPUT';
  };

  return (
    <footer className="hidden md:flex fixed bottom-0 left-0 right-0 z-20 h-8 items-center px-4 bg-[var(--color-bg-sidebar)] border-t border-[var(--color-border)] pointer-events-none">
      <p className="font-mono text-[11px] text-gray-400 tracking-wide uppercase">
        {getStatusText()}
      </p>
    </footer>
  );
}
