'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MARKER_CONFIG, type MapMarkerData, type MarkerIconType } from '@/types/maps';

const ICON_TYPES: MarkerIconType[] = ['combat', 'quest', 'shop', 'danger', 'safe'];

interface MarkerFormProps {
  isOpen: boolean;
  onClose: () => void;
  mapId: string;
  position: { x: number; y: number };
  existingMarker: MapMarkerData | null;
  onMarkerSaved: (marker: MapMarkerData) => void;
  onSave: (data: {
    map_id: string;
    label: string;
    description: string;
    icon_type: MarkerIconType;
    pos_x: number;
    pos_y: number;
    is_visible_to_players: boolean;
  }) => Promise<MapMarkerData>;
  onUpdate: (
    markerId: string,
    data: {
      label: string;
      description: string;
      icon_type: MarkerIconType;
      is_visible_to_players: boolean;
    },
  ) => Promise<MapMarkerData>;
}

export function MarkerForm({
  isOpen,
  onClose,
  mapId,
  position,
  existingMarker,
  onMarkerSaved,
  onSave,
  onUpdate,
}: MarkerFormProps) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [iconType, setIconType] = useState<MarkerIconType>('combat');
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (existingMarker) {
      setLabel(existingMarker.label);
      setDescription(existingMarker.description || '');
      setIconType(existingMarker.icon_type);
      setIsVisible(existingMarker.is_visible_to_players);
    } else {
      setLabel('');
      setDescription('');
      setIconType('combat');
      setIsVisible(true);
    }
    setError(null);
  }, [existingMarker, isOpen]);

  const handleSubmit = async () => {
    if (!label.trim()) {
      setError('Label is required');
      return;
    }
    if (label.length > 100) {
      setError('Label must be 100 characters or fewer');
      return;
    }
    if (description.length > 500) {
      setError('Description must be 500 characters or fewer');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      let marker: MapMarkerData;
      if (existingMarker) {
        marker = await onUpdate(existingMarker.id, {
          label: label.trim(),
          description: description.trim(),
          icon_type: iconType,
          is_visible_to_players: isVisible,
        });
      } else {
        marker = await onSave({
          map_id: mapId,
          label: label.trim(),
          description: description.trim(),
          icon_type: iconType,
          pos_x: position.x,
          pos_y: position.y,
          is_visible_to_players: isVisible,
        });
      }
      onMarkerSaved(marker);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save marker');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[rgba(15,15,25,0.98)] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-[var(--color-text-primary)] font-display">
            {existingMarker ? 'Edit Marker' : 'New Marker'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Label */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase mb-1.5">
              Label
            </label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Goblin Ambush"
              className="bg-[rgba(20,20,30,0.8)] border-white/10"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase mb-1.5">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 4 goblins patrol this corridor. DC 14 Stealth to sneak past."
              className="bg-[rgba(20,20,30,0.8)] border-white/10 min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1 text-right">
              {description.length} / 500
            </p>
          </div>

          {/* Icon type selector */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase mb-1.5">
              Marker Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_TYPES.map((type) => {
                const config = MARKER_CONFIG[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setIconType(type)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors ${
                      iconType === type
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                        : 'border-white/10 hover:border-white/20 bg-[rgba(20,20,30,0.5)]'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full ${config.color}`}
                    >
                      <span className="text-xs">{config.icon}</span>
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visibility toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                Visible to Players
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                When hidden, only DMs can see this marker
              </p>
            </div>
            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
          </div>

          {/* Position display */}
          <p className="text-xs text-[var(--color-text-muted)] font-mono">
            Position: ({position.x.toFixed(3)}, {position.y.toFixed(3)})
          </p>

          {/* Error */}
          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
              className="text-[var(--color-text-muted)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!label.trim() || isSaving}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white"
            >
              {isSaving
                ? 'Saving...'
                : existingMarker
                  ? 'Save Changes'
                  : 'Create Marker'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
