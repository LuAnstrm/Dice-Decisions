'use client';

import { useState } from 'react';
import { MoreHorizontal, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { MARKER_CONFIG, type MapMarkerData } from '@/types/maps';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MarkerPopupProps {
  marker: MapMarkerData;
  isDM: boolean;
  mapScale: number;
  onClose: () => void;
  onEdit: (marker: MapMarkerData) => void;
  onDelete: (markerId: string) => void;
  onToggleVisibility: (markerId: string, visible: boolean) => void;
}

export function MarkerPopup({
  marker,
  isDM,
  mapScale,
  onClose,
  onEdit,
  onDelete,
  onToggleVisibility,
}: MarkerPopupProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const config = MARKER_CONFIG[marker.icon_type];

  return (
    <div
      className="absolute z-20"
      onClick={(e) => e.stopPropagation()}
      style={{
        left: `${marker.pos_x * 100}%`,
        top: `${marker.pos_y * 100}%`,
        transform: `translate(-50%, calc(-100% - 24px)) scale(${1 / mapScale})`,
        transformOrigin: 'bottom center',
      }}
    >
      <div className="w-[280px] bg-[rgba(15,15,25,0.95)] backdrop-blur-sm border border-white/10 rounded-lg shadow-xl p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <span
            className={`inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider rounded text-white ${config.color}`}
          >
            {config.badgeLabel}
          </span>
          {isDM && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  />
                }
              >
                <MoreHorizontal size={14} className="text-[var(--color-text-muted)]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => onEdit(marker)}>
                  <Pencil size={14} className="mr-2" />
                  Edit Marker
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    onToggleVisibility(marker.id, !marker.is_visible_to_players)
                  }
                >
                  {marker.is_visible_to_players ? (
                    <>
                      <EyeOff size={14} className="mr-2" />
                      Hide from Players
                    </>
                  ) : (
                    <>
                      <Eye size={14} className="mr-2" />
                      Show to Players
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setConfirmDelete(true)}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete Marker
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Label */}
        <h4 className="text-base font-bold text-[var(--color-text-primary)] mb-1">
          {marker.label}
        </h4>

        {/* Description */}
        {marker.description && (
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            {marker.description}
          </p>
        )}

        {/* Delete confirmation */}
        {confirmDelete ? (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-red-400">Delete this marker?</span>
            <Button
              size="sm"
              variant="destructive"
              className="h-7 text-xs"
              onClick={() => onDelete(marker.id)}
            >
              Yes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => setConfirmDelete(false)}
            >
              No
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              className="h-8 text-xs bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white"
              disabled
              title="Coming soon"
            >
              Open Log
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-[var(--color-text-muted)]"
              onClick={onClose}
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Arrow pointing down to marker */}
        <div
          className="absolute left-1/2 -bottom-2 w-0 h-0 -translate-x-1/2"
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid rgba(15,15,25,0.95)',
          }}
        />
      </div>
    </div>
  );
}
