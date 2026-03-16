'use client';

import type { MapData } from '@/types/maps';

interface MapSelectorProps {
  maps: MapData[];
  selectedMapId: string;
  onSelect: (mapId: string) => void;
}

export function MapSelector({ maps, selectedMapId, onSelect }: MapSelectorProps) {
  if (maps.length === 0) return null;

  return (
    <>
      {/* Desktop: horizontal tabs */}
      <div className="hidden md:flex items-center gap-1 px-4 py-1 border-b border-white/5 bg-[rgba(10,10,15,0.3)]">
        {maps.map((map) => (
          <button
            key={map.id}
            type="button"
            onClick={() => onSelect(map.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              map.id === selectedMapId
                ? 'text-[var(--color-text-primary)] bg-white/10 border-b-2 border-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/5'
            }`}
          >
            {map.name}
          </button>
        ))}
      </div>

      {/* Mobile: dropdown */}
      <div className="md:hidden px-4 py-2 border-b border-white/5 bg-[rgba(10,10,15,0.3)]">
        <select
          value={selectedMapId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-[rgba(20,20,30,0.8)] border border-white/10 rounded-md px-3 py-1.5 text-xs text-[var(--color-text-primary)] font-mono"
        >
          {maps.map((map) => (
            <option key={map.id} value={map.id}>
              {map.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
