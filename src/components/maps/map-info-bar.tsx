'use client';

interface MapInfoBarProps {
  mapName: string;
}

export function MapInfoBar({ mapName }: MapInfoBarProps) {
  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-full px-4 py-1.5 bg-[rgba(15,15,25,0.8)] backdrop-blur-sm border border-white/10">
      <span className="font-mono text-xs text-[var(--color-text-muted)]">
        Viewing:{' '}
        <span className="text-[var(--color-accent)]">{mapName}</span>
      </span>
    </div>
  );
}
