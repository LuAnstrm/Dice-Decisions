'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface BarSegment {
  percentage: number;
  color: string;
  label?: string;
}

interface ProbabilityBarProps {
  segments: BarSegment[];
  height?: number;
  animated?: boolean;
  className?: string;
}

export function ProbabilityBar({
  segments,
  height = 8,
  animated = true,
  className,
}: ProbabilityBarProps) {
  const [mounted, setMounted] = useState(!animated);

  useEffect(() => {
    if (animated) {
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animated]);

  return (
    <div
      className={cn('w-full rounded-full overflow-hidden bg-[var(--color-bg-base)] flex', className)}
      style={{ height }}
    >
      {segments.map((seg, i) => (
        <div
          key={i}
          className="transition-all duration-600 ease-out"
          style={{
            width: mounted ? `${seg.percentage}%` : '0%',
            backgroundColor: seg.color,
            transitionDuration: '600ms',
          }}
        />
      ))}
    </div>
  );
}
