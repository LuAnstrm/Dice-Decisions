'use client';

import { useState, useRef, useCallback } from 'react';

const MIN_SCALE = 0.5;
const MAX_SCALE = 4.0;
const ZOOM_STEP = 0.25;
const DRAG_THRESHOLD = 5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useMapInteraction() {
  const [scale, setScale] = useState(1.0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  const dragDistance = useRef(0);
  const initialPinchDistance = useRef(0);
  const initialPinchScale = useRef(1);
  const isPinching = useRef(false);

  const getContainerRect = useCallback(() => {
    return containerRef.current?.getBoundingClientRect() ?? null;
  }, []);

  // Mouse handlers
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
      lastTranslateX.current = translateX;
      lastTranslateY.current = translateY;
      dragDistance.current = 0;
    },
    [translateX, translateY],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX.current;
      const deltaY = e.clientY - dragStartY.current;
      dragDistance.current = Math.hypot(deltaX, deltaY);
      setTranslateX(lastTranslateX.current + deltaX);
      setTranslateY(lastTranslateY.current + deltaY);
    },
    [isDragging],
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel handler — zoom toward cursor
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = getContainerRect();
      if (!rect) return;

      const direction = e.deltaY < 0 ? 1 : -1;
      const newScale = clamp(scale + direction * ZOOM_STEP, MIN_SCALE, MAX_SCALE);
      if (newScale === scale) return;

      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const pointX = (cursorX - translateX) / scale;
      const pointY = (cursorY - translateY) / scale;
      const newTX = cursorX - pointX * newScale;
      const newTY = cursorY - pointY * newScale;

      setScale(newScale);
      setTranslateX(newTX);
      setTranslateY(newTY);
    },
    [scale, translateX, translateY, getContainerRect],
  );

  // Touch handlers
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      if (e.touches.length === 1 && t0) {
        setIsDragging(true);
        dragStartX.current = t0.clientX;
        dragStartY.current = t0.clientY;
        lastTranslateX.current = translateX;
        lastTranslateY.current = translateY;
        dragDistance.current = 0;
      } else if (e.touches.length === 2 && t0 && t1) {
        isPinching.current = true;
        const dist = Math.hypot(
          t0.clientX - t1.clientX,
          t0.clientY - t1.clientY,
        );
        initialPinchDistance.current = dist;
        initialPinchScale.current = scale;
      }
    },
    [translateX, translateY, scale],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      if (e.touches.length === 1 && !isPinching.current && t0) {
        const deltaX = t0.clientX - dragStartX.current;
        const deltaY = t0.clientY - dragStartY.current;
        dragDistance.current = Math.hypot(deltaX, deltaY);
        setTranslateX(lastTranslateX.current + deltaX);
        setTranslateY(lastTranslateY.current + deltaY);
      } else if (e.touches.length === 2 && t0 && t1) {
        const dist = Math.hypot(
          t0.clientX - t1.clientX,
          t0.clientY - t1.clientY,
        );
        const newScale = clamp(
          initialPinchScale.current * (dist / initialPinchDistance.current),
          MIN_SCALE,
          MAX_SCALE,
        );

        // Center zoom between fingers
        const rect = getContainerRect();
        if (rect) {
          const midX = (t0.clientX + t1.clientX) / 2 - rect.left;
          const midY = (t0.clientY + t1.clientY) / 2 - rect.top;
          const pointX = (midX - translateX) / scale;
          const pointY = (midY - translateY) / scale;
          setTranslateX(midX - pointX * newScale);
          setTranslateY(midY - pointY * newScale);
        }

        setScale(newScale);
      }
    },
    [scale, translateX, translateY, getContainerRect],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 0) {
        setIsDragging(false);
        isPinching.current = false;
      } else if (e.touches.length === 1) {
        // Transition from pinch to single-finger pan
        isPinching.current = false;
        const t0 = e.touches[0];
        if (t0) {
          dragStartX.current = t0.clientX;
          dragStartY.current = t0.clientY;
        }
        lastTranslateX.current = translateX;
        lastTranslateY.current = translateY;
      }
    },
    [translateX, translateY],
  );

  // Zoom controls
  const zoomIn = useCallback(() => {
    const rect = getContainerRect();
    if (!rect) {
      setScale((s) => clamp(s + ZOOM_STEP, MIN_SCALE, MAX_SCALE));
      return;
    }
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setScale((prev) => {
      const newScale = clamp(prev + ZOOM_STEP, MIN_SCALE, MAX_SCALE);
      const pointX = (centerX - translateX) / prev;
      const pointY = (centerY - translateY) / prev;
      setTranslateX(centerX - pointX * newScale);
      setTranslateY(centerY - pointY * newScale);
      return newScale;
    });
  }, [getContainerRect, translateX, translateY]);

  const zoomOut = useCallback(() => {
    const rect = getContainerRect();
    if (!rect) {
      setScale((s) => clamp(s - ZOOM_STEP, MIN_SCALE, MAX_SCALE));
      return;
    }
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setScale((prev) => {
      const newScale = clamp(prev - ZOOM_STEP, MIN_SCALE, MAX_SCALE);
      const pointX = (centerX - translateX) / prev;
      const pointY = (centerY - translateY) / prev;
      setTranslateX(centerX - pointX * newScale);
      setTranslateY(centerY - pointY * newScale);
      return newScale;
    });
  }, [getContainerRect, translateX, translateY]);

  const resetView = useCallback(() => {
    setIsResetting(true);
    setScale(1.0);
    setTranslateX(0);
    setTranslateY(0);
    setTimeout(() => setIsResetting(false), 300);
  }, []);

  // Convert screen coordinates to normalized map coordinates (0-1)
  const getMapCoordinates = useCallback(
    (clientX: number, clientY: number, imageWidth: number, imageHeight: number) => {
      const rect = getContainerRect();
      if (!rect) return null;
      const x = (clientX - rect.left - translateX) / (imageWidth * scale);
      const y = (clientY - rect.top - translateY) / (imageHeight * scale);
      return {
        x: clamp(x, 0, 1),
        y: clamp(y, 0, 1),
      };
    },
    [scale, translateX, translateY, getContainerRect],
  );

  // Whether the last interaction was a drag (moved > threshold)
  const wasDragging = useCallback(() => {
    return dragDistance.current >= DRAG_THRESHOLD;
  }, []);

  return {
    scale,
    translateX,
    translateY,
    isDragging,
    isResetting,
    containerRef,
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    zoomIn,
    zoomOut,
    resetView,
    getMapCoordinates,
    wasDragging,
  };
}
