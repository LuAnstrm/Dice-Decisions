'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, Map as MapIcon } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { CoordinateBar } from '@/components/maps/coordinate-bar';
import { MapSelector } from '@/components/maps/map-selector';
import { MapViewer } from '@/components/maps/map-viewer';
import { MapUploadDialog } from '@/components/maps/map-upload-dialog';
import { MarkerForm } from '@/components/maps/marker-form';
import {
  getMaps,
  getMapWithMarkers,
  createMap,
  createMarker,
  updateMarker,
  deleteMarker,
  toggleMarkerVisibility,
  deleteMap,
} from '@/lib/queries/maps';
import { useRole } from '@/hooks/use-role';
import { useCampaign } from '@/hooks/use-campaign';
import { createClient } from '@/lib/supabase/client';
import type { MapData, MapMarkerData, MarkerIconType } from '@/types/maps';

export default function MapsPage() {
  const { isDM } = useRole();
  const { campaign } = useCampaign();
  const supabase = createClient();

  const [maps, setMaps] = useState<MapData[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMarkerFormOpen, setIsMarkerFormOpen] = useState(false);
  const [pendingMarkerPosition, setPendingMarkerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [editingMarker, setEditingMarker] = useState<MapMarkerData | null>(null);

  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Fetch maps list
  const fetchMaps = useCallback(async () => {
    if (!campaign) return;
    try {
      setIsLoading(true);
      const data = await getMaps(supabase, campaign.id);
      setMaps(data);
      const firstMap = data[0];
      if (firstMap && !selectedMapId) {
        setSelectedMapId(firstMap.id);
      }
    } catch (err) {
      console.error('Failed to load maps:', err);
    } finally {
      setIsLoading(false);
    }
  }, [campaign, supabase, selectedMapId]);

  // Fetch selected map with markers
  const fetchSelectedMap = useCallback(async () => {
    if (!selectedMapId) {
      setSelectedMap(null);
      return;
    }
    try {
      const data = await getMapWithMarkers(supabase, selectedMapId, isDM);
      setSelectedMap(data);
    } catch (err) {
      console.error('Failed to load map:', err);
    }
  }, [selectedMapId, isDM, supabase]);

  useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  useEffect(() => {
    fetchSelectedMap();
  }, [fetchSelectedMap]);

  // Handlers
  const handleMapCreated = useCallback(
    (newMap: MapData) => {
      setMaps((prev) => [...prev, newMap]);
      setSelectedMapId(newMap.id);
    },
    [],
  );

  const handleMapClick = useCallback(
    (pos: { x: number; y: number }) => {
      if (!isDM) return;
      setPendingMarkerPosition(pos);
      setEditingMarker(null);
      setIsMarkerFormOpen(true);
    },
    [isDM],
  );

  const handleEditMarker = useCallback((marker: MapMarkerData) => {
    setEditingMarker(marker);
    setPendingMarkerPosition({ x: marker.pos_x, y: marker.pos_y });
    setIsMarkerFormOpen(true);
  }, []);

  const handleDeleteMarker = useCallback(
    async (markerId: string) => {
      try {
        await deleteMarker(supabase, markerId);
        setSelectedMap((prev) =>
          prev
            ? { ...prev, markers: prev.markers.filter((m) => m.id !== markerId) }
            : null,
        );
      } catch (err) {
        console.error('Failed to delete marker:', err);
      }
    },
    [supabase],
  );

  const handleToggleVisibility = useCallback(
    async (markerId: string, visible: boolean) => {
      try {
        await toggleMarkerVisibility(supabase, markerId, visible);
        setSelectedMap((prev) =>
          prev
            ? {
                ...prev,
                markers: prev.markers.map((m) =>
                  m.id === markerId ? { ...m, is_visible_to_players: visible } : m,
                ),
              }
            : null,
        );
      } catch (err) {
        console.error('Failed to toggle visibility:', err);
      }
    },
    [supabase],
  );

  const handleMarkerSaved = useCallback(
    (marker: MapMarkerData) => {
      setSelectedMap((prev) => {
        if (!prev) return null;
        const exists = prev.markers.some((m) => m.id === marker.id);
        if (exists) {
          return {
            ...prev,
            markers: prev.markers.map((m) => (m.id === marker.id ? marker : m)),
          };
        }
        return { ...prev, markers: [...prev.markers, marker] };
      });
    },
    [],
  );

  const handleDeleteMap = useCallback(
    async (mapId: string) => {
      try {
        await deleteMap(supabase, mapId);
        setMaps((prev) => prev.filter((m) => m.id !== mapId));
        if (selectedMapId === mapId) {
          const remaining = maps.filter((m) => m.id !== mapId);
          const first = remaining[0];
          setSelectedMapId(first ? first.id : null);
        }
      } catch (err) {
        console.error('Failed to delete map:', err);
      }
    },
    [supabase, selectedMapId, maps],
  );

  // Campaign name for topbar
  const campaignName = campaign?.name || '';
  const title = selectedMap ? `Maps — ${campaignName}` : 'Maps';

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      <Topbar
        title={title}
        actions={
          isDM ? (
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white gap-2"
              size="sm"
            >
              <Upload size={16} />
              Upload Map
            </Button>
          ) : undefined
        }
      />

      {/* Coordinate bar */}
      <CoordinateBar
        x={cursorPos?.x ?? null}
        y={cursorPos?.y ?? null}
        scale={selectedMap ? 1 : 1}
      />

      {/* Map selector tabs */}
      {maps.length > 0 && selectedMapId && (
        <MapSelector
          maps={maps}
          selectedMapId={selectedMapId}
          onSelect={setSelectedMapId}
        />
      )}

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-muted)] text-sm">Loading maps...</div>
          </div>
        ) : maps.length === 0 ? (
          <EmptyState
            icon={MapIcon}
            title="Upload Your First Map"
            description="Bring your campaign world to life with interactive maps. Upload a map image and place markers for points of interest, encounters, and more."
            action={
              isDM
                ? {
                    label: 'Upload Map',
                    onClick: () => setIsUploadOpen(true),
                  }
                : undefined
            }
          />
        ) : selectedMap ? (
          <MapViewer
            map={selectedMap}
            isDM={isDM}
            onMapClick={handleMapClick}
            onEditMarker={handleEditMarker}
            onDeleteMarker={handleDeleteMarker}
            onToggleVisibility={handleToggleVisibility}
            cursorPositionRef={setCursorPos}
          />
        ) : null}
      </div>

      {/* Upload dialog */}
      {campaign && (
        <MapUploadDialog
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          campaignId={campaign.id}
          onMapCreated={handleMapCreated}
          onUpload={async (name, file) => createMap(supabase, campaign.id, name, file)}
        />
      )}

      {/* Marker form dialog */}
      {selectedMap && pendingMarkerPosition && (
        <MarkerForm
          isOpen={isMarkerFormOpen}
          onClose={() => {
            setIsMarkerFormOpen(false);
            setEditingMarker(null);
            setPendingMarkerPosition(null);
          }}
          mapId={selectedMap.id}
          position={pendingMarkerPosition}
          existingMarker={editingMarker}
          onMarkerSaved={handleMarkerSaved}
          onSave={async (data) => createMarker(supabase, data)}
          onUpdate={async (id, data) => updateMarker(supabase, id, data)}
        />
      )}
    </div>
  );
}
