'use client';

import Image from 'next/image';
import { useTheme } from '@/hooks/use-theme';
import { themes } from '@/styles/themes';
import { cn } from '@/lib/utils';

type WorkbenchTone = 'accent' | 'success' | 'warning' | 'muted';

interface WorkbenchStat {
  label: string;
  value: string;
  hint?: string;
  tone?: WorkbenchTone;
}

interface ProbabilityWorkbenchProps {
  section: string;
  title: string;
  description: string;
  moduleDescription?: string;
  artPath: string;
  stampPath: string;
  stats?: WorkbenchStat[];
  toolbar?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

const toneClasses: Record<WorkbenchTone, string> = {
  accent: 'text-[var(--color-accent)]',
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  muted: 'text-[var(--color-text-secondary)]',
};

export function ProbabilityWorkbench({
  section,
  title,
  description,
  artPath,
  stats = [],
  toolbar,
  className,
  contentClassName,
  children,
}: ProbabilityWorkbenchProps) {
  const { theme } = useTheme();
  const themeConfig = themes[theme];

  return (
    <section className={cn('px-4 py-6 md:px-6 md:py-8 xl:px-8', className)}>
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 shadow-[0_24px_120px_rgba(0,0,0,0.42)] backdrop-blur-sm">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${themeConfig.backdropImage})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(var(--color-accent-rgb),0.22),transparent_28%),linear-gradient(180deg,rgba(5,7,12,0.38),rgba(5,7,12,0.88)_58%,rgba(5,7,12,0.96))]" />
        <div className="absolute -left-16 top-16 h-44 w-44 rounded-full bg-[var(--color-glow)] blur-3xl" />
        <div className="absolute -right-10 top-10 h-32 w-32 rounded-full bg-[var(--color-glow)] blur-3xl" />

        <div className="relative z-10 p-5 md:p-8">
          <div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-black/20 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">
                <span>{section}</span>
              </div>

              <div className="mt-5 flex items-start gap-4">
                <div className="relative hidden h-18 w-18 overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-black/25 shadow-[0_12px_32px_rgba(0,0,0,0.32)] sm:block">
                  <Image src={artPath} alt="" fill className="object-contain p-3 opacity-95" />
                </div>

                <div className="min-w-0 flex-1">
                  <h1
                    className="max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-secondary)] md:text-base">
                    {description}
                  </p>
                </div>
              </div>

              {toolbar && <div className="mt-5">{toolbar}</div>}
            </div>
          </div>

          {stats.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[20px] border border-[var(--color-border)] bg-black/20 px-4 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm"
                >
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                    {stat.label}
                  </p>
                  <p className={cn('mt-2 text-2xl font-semibold text-white', toneClasses[stat.tone ?? 'accent'])}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className={cn('mt-6', contentClassName)}>{children}</div>
        </div>
      </div>
    </section>
  );
}