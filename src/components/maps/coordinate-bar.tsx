'use client';

interface CoordinateBarProps {
  x: number | null;
  y: number | null;
  scale: number;
}

export function CoordinateBar({ x, y, scale }: CoordinateBarProps) {
  return (
    <div className="h-8 flex items-center justify-center border-b border-white/5 bg-[rgba(10,10,15,0.5)]">
      <span className="font-mono text-xs text-[var(--color-text-muted)]">
        X: {x !== null ? x.toFixed(3) : '—'} · Y:{' '}
        {y !== null ? y.toFixed(3) : '—'} · Scale: {scale.toFixed(2)}x
      </span>
    </div>
  );
}
