'use client';

import { useState, useCallback } from 'react';
import { useMapInteraction } from '@/hooks/use-map-interaction';
import { MapCanvas } from './map-canvas';
import { MapMarker } from './map-marker';
import { MarkerPopup } from './marker-popup';
import { MapControls } from './map-controls';
import { MapInfoBar } from './map-info-bar';
import type { MapData, MapMarkerData } from '@/types/maps';

interface MapViewerProps {
  map: MapData;
  isDM: boolean;
  onMapClick: (pos: { x: number; y: number }) => void;
  onEditMarker: (marker: MapMarkerData) => void;
  onDeleteMarker: (markerId: string) => void;
  onToggleVisibility: (markerId: string, visible: boolean) => void;
  cursorPositionRef: (pos: { x: number; y: number } | null) => void;
}

export function MapViewer({
  map,
  isDM,
  onMapClick,
  onEditMarker,
  onDeleteMarker,
  onToggleVisibility,
  cursorPositionRef,
}: MapViewerProps) {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const {
    scale,
    translateX,
    translateY,
    isDragging,
    isResetting,
    containerRef,
    onWheel,
    onMouseDown,
    onMouseMove: hookMouseMove,
    onMouseUp,
    onMouseLeave: hookMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    zoomIn,
    zoomOut,
    resetView,
    getMapCoordinates,
    wasDragging,
  } = useMapInteraction();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      hookMouseMove(e);
      if (imageSize.width > 0) {
        const coords = getMapCoordinates(
          e.clientX,
          e.clientY,
          imageSize.width,
          imageSize.height,
        );
        cursorPositionRef(coords);
      }
    },
    [hookMouseMove, getMapCoordinates, imageSize, cursorPositionRef],
  );

  const handleMouseLeave = useCallback(() => {
    hookMouseLeave();
    cursorPositionRef(null);
  }, [hookMouseLeave, cursorPositionRef]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isDM || wasDragging()) return;
      if (imageSize.width === 0) return;

      const coords = getMapCoordinates(
        e.clientX,
        e.clientY,
        imageSize.width,
        imageSize.height,
      );
      if (coords) {
        setActiveMarkerId(null);
        onMapClick(coords);
      }
    },
    [isDM, wasDragging, getMapCoordinates, imageSize, onMapClick],
  );

  const handleMarkerClick = useCallback((marker: MapMarkerData) => {
    setActiveMarkerId((prev) => (prev === marker.id ? null : marker.id));
  }, []);

  const handleImageLoad = useCallback((width: number, height: number) => {
    setImageSize({ width, height });
  }, []);

  return (
    <div className="relative w-full h-full" onClick={handleCanvasClick}>
      <MapCanvas
        imageUrl={map.image_url}
        scale={scale}
        translateX={translateX}
        translateY={translateY}
        isDragging={isDragging}
        isResetting={isResetting}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onImageLoad={handleImageLoad}
        containerRef={containerRef}
      >
        {/* Markers */}
        {map.markers.map((marker) => (
          <MapMarker
            key={marker.id}
            marker={marker}
            mapScale={scale}
            isDM={isDM}
            isActive={activeMarkerId === marker.id}
            onClick={handleMarkerClick}
          />
        ))}

        {/* Active marker popup */}
        {activeMarkerId &&
          (() => {
            const activeMarker = map.markers.find((m) => m.id === activeMarkerId);
            if (!activeMarker) return null;
            return (
              <MarkerPopup
                marker={activeMarker}
                isDM={isDM}
                mapScale={scale}
                onClose={() => setActiveMarkerId(null)}
                onEdit={(m) => {
                  setActiveMarkerId(null);
                  onEditMarker(m);
                }}
                onDelete={(id) => {
                  setActiveMarkerId(null);
                  onDeleteMarker(id);
                }}
                onToggleVisibility={onToggleVisibility}
              />
            );
          })()}
      </MapCanvas>

      {/* No markers hint (DM only) */}
      {isDM && map.markers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[rgba(15,15,25,0.6)] backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-sm text-[var(--color-text-muted)]">
              Click anywhere on the map to place your first marker
            </p>
          </div>
        </div>
      )}

      <MapControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
        scale={scale}
      />
      <MapInfoBar mapName={map.name} />
    </div>
  );
}
