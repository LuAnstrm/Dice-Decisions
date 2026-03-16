'use client';

import { EyeOff } from 'lucide-react';
import { MARKER_CONFIG, type MapMarkerData } from '@/types/maps';

interface MapMarkerProps {
  marker: MapMarkerData;
  mapScale: number;
  isDM: boolean;
  isActive: boolean;
  onClick: (marker: MapMarkerData) => void;
}

export function MapMarker({ marker, mapScale, isDM, isActive, onClick }: MapMarkerProps) {
  const config = MARKER_CONFIG[marker.icon_type];
  const isHidden = isDM && !marker.is_visible_to_players;

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${marker.pos_x * 100}%`,
        top: `${marker.pos_y * 100}%`,
        transform: `translate(-50%, -50%) scale(${1 / mapScale})`,
        transformOrigin: 'center center',
      }}
    >
      <button
        type="button"
        title={marker.label}
        onClick={(e) => {
          e.stopPropagation();
          onClick(marker);
        }}
        className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform duration-150 ease-out hover:scale-[1.2] ${config.color} ${
          isActive ? `ring-2 ring-[var(--color-accent)] ring-offset-1 ring-offset-transparent` : ''
        } ${isHidden ? 'opacity-50' : ''}`}
      >
        <span className="text-sm leading-none">{config.icon}</span>

        {isHidden && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-900 border border-gray-700">
            <EyeOff size={8} className="text-gray-400" />
          </span>
        )}
      </button>
    </div>
  );
}
