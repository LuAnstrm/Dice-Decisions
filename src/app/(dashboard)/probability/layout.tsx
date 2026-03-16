'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Topbar } from '@/components/layout/topbar';
import { useTheme } from '@/hooks/use-theme';
import { themes } from '@/styles/themes';
import { cn } from '@/lib/utils';

const PROBABILITY_TABS = [
  {
    label: 'Cards',
    href: '/probability/cards',
    description: 'Instant success odds and recent action cards.',
    icon: '/images/icons/fantasy/card-play.png',
  },
  {
    label: 'Dice Visualizer',
    href: '/probability/dice-visualizer',
    description: 'Compare distributions, variance, and total roll space.',
    icon: '/images/icons/fantasy/rolling-dices.png',
  },
  {
    label: 'Bayes Analyzer',
    href: '/probability/bayes-analyzer',
    description: 'Update beliefs from evidence chains and posterior risk.',
    icon: '/images/icons/fantasy/all-seeing-eye.png',
  },
];

export default function ProbabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const themeConfig = themes[theme];

  return (
    <>
      <Topbar title="Probability Engine" />
      <div className="relative overflow-hidden border-b border-white/8 bg-[var(--color-bg-base)]/80">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${themeConfig.backdropImage})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.76),rgba(8,10,15,0.92))]" />

        <div className="relative z-10 px-4 py-5 md:px-6 xl:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                Phase 3 Probability Suite
              </p>
              <h2
                className="mt-2 text-2xl font-semibold text-white md:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Cards, distributions, and evidence chains in one workbench.
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                Theme {themeConfig.name}
              </span>
              <span className="rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1 font-mono uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                3 Modules Live
              </span>
            </div>
          </div>

          <nav className="mt-5 grid gap-3 lg:grid-cols-3">
            {PROBABILITY_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'group relative overflow-hidden rounded-[22px] border px-4 py-4 transition-all duration-200',
                    isActive
                      ? 'border-[var(--color-accent)]/45 bg-[var(--color-accent)]/12 shadow-[0_16px_40px_rgba(0,0,0,0.28)]'
                      : 'border-white/8 bg-black/20 hover:border-white/15 hover:bg-black/28',
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <Image src={tab.icon} alt="" fill className="object-contain p-2.5 opacity-95" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{tab.label}</span>
                        {isActive && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
                      </div>
                      <p className="mt-1 text-sm leading-5 text-[var(--color-text-secondary)]">
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {children}
    </>
  );
}
