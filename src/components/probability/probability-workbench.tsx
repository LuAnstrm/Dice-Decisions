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
  moduleDescription,
  artPath,
  stampPath,
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
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:items-start">
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

            <div className="rounded-[24px] border border-[var(--color-border)] bg-black/25 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                    Active Theme
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{themeConfig.name}</p>
                </div>
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white/5">
                  <Image src={stampPath} alt="" fill className="object-contain p-2.5 opacity-90" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-[20px] border border-white/8 bg-black/20 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-glow)]/30">
                  <Image src={artPath} alt="" fill className="object-contain p-3 opacity-95" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                    Loaded Module
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">{section}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {moduleDescription ?? description}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[var(--color-text-secondary)]">
                <div className="rounded-2xl border border-white/8 bg-black/15 p-3">
                  <p className="font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                    Backdrop
                  </p>
                  <p className="mt-1">{themeConfig.description}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/15 p-3">
                  <p className="font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                    Accent Vector
                  </p>
                  <p className="mt-1">Primary glow follows the active theme token set.</p>
                </div>
              </div>
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
                  {stat.hint && (
                    <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{stat.hint}</p>
                  )}
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