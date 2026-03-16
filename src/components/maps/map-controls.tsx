'use client';

import { Plus, Minus, Maximize } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 4.0;

export function MapControls({ onZoomIn, onZoomOut, onReset, scale }: MapControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
      <button
        type="button"
        onClick={onZoomIn}
        disabled={scale >= MAX_SCALE}
        className="flex items-center justify-center w-9 h-9 rounded-md bg-[rgba(15,15,25,0.8)] backdrop-blur-sm border border-white/10 text-white hover:bg-[rgba(25,25,40,0.9)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        title="Zoom in"
      >
        <Plus size={16} />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        disabled={scale <= MIN_SCALE}
        className="flex items-center justify-center w-9 h-9 rounded-md bg-[rgba(15,15,25,0.8)] backdrop-blur-sm border border-white/10 text-white hover:bg-[rgba(25,25,40,0.9)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        title="Zoom out"
      >
        <Minus size={16} />
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex items-center justify-center w-9 h-9 rounded-md bg-[rgba(15,15,25,0.8)] backdrop-blur-sm border border-white/10 text-white hover:bg-[rgba(25,25,40,0.9)] transition-colors text-[10px] font-bold tracking-wide"
        title="Reset view"
      >
        <Maximize size={14} />
      </button>
    </div>
  );
}
