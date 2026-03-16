'use client';

import { useEffect, useRef } from 'react';
import { RpgCard } from '@/components/shared/rpg-card';

interface SystemLogProps {
  entries: string[];
}

export function SystemLog({ entries }: SystemLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <RpgCard variant="default" className="bg-[rgba(0,0,0,0.3)]">
      <p className="font-mono text-xs text-emerald-400 mb-3">
        [SYSTEM LOG] CALC_V4.2 READY
      </p>
      <div className="h-[260px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
        {entries.map((entry, i) => (
          <p
            key={i}
            className="font-mono text-[11px] text-[var(--color-text-muted)] animate-in fade-in-0 duration-300"
          >
            &gt; {entry}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>
    </RpgCard>
  );
}
