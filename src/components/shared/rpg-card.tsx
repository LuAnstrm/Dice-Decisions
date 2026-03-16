import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RpgCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'stat' | 'probability' | 'hero' | 'interactive';
  glow?: boolean;
  header?: { title: string; icon?: ReactNode };
}

export const RpgCard = forwardRef<HTMLDivElement, RpgCardProps>(
  (
    {
      className,
      variant = 'default',
      glow = false,
      header,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-card border border-(--color-border) bg-(--color-bg-elevated) transition-all duration-150',
          variant === 'default' && 'p-6 shadow-card hover:border-(--color-border-hover) hover:shadow-card-hover hover:-translate-y-0.5',
          variant === 'stat' && 'p-4 text-center shadow-card',
          variant === 'probability' && 'p-6 shadow-card hover:border-(--color-border-hover) hover:shadow-card-hover hover:-translate-y-0.5',
          variant === 'hero' && 'relative overflow-hidden p-6 shadow-card',
          variant === 'interactive' && 'cursor-pointer p-6 shadow-card hover:border-(--color-border-hover) hover:shadow-card-hover hover:-translate-y-1',
          glow && 'shadow-[0_0_20px_var(--color-glow)]',
          className,
        )}
        {...props}
      >
        {header && (
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-(--color-text-muted)">
              {header.title}
            </h3>
            {header.icon}
          </div>
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);

RpgCard.displayName = 'RpgCard';
