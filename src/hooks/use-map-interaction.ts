'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

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
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for native event handlers to access latest state without stale closures
  const scaleRef = useRef(scale);
  const translateXRef = useRef(translateX);
  const translateYRef = useRef(translateY);
  scaleRef.current = scale;
  translateXRef.current = translateX;
  translateYRef.current = translateY;

  const getContainerRect = useCallback(() => {
    return containerRef.current?.getBoundingClientRect() ?? null;
  }, []);

  // Mouse handlers (React synthetic events — no passive issue)
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

  // Native wheel handler — { passive: false } allows preventDefault to block page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const s = scaleRef.current;
      const tx = translateXRef.current;
      const ty = translateYRef.current;

      const direction = e.deltaY < 0 ? 1 : -1;
      const newScale = clamp(s + direction * ZOOM_STEP, MIN_SCALE, MAX_SCALE);
      if (newScale === s) return;

      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const pointX = (cursorX - tx) / s;
      const pointY = (cursorY - ty) / s;

      setScale(newScale);
      setTranslateX(cursorX - pointX * newScale);
      setTranslateY(cursorY - pointY * newScale);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Native touch handlers — { passive: false } on touchmove allows preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      if (e.touches.length === 1 && t0) {
        setIsDragging(true);
        dragStartX.current = t0.clientX;
        dragStartY.current = t0.clientY;
        lastTranslateX.current = translateXRef.current;
        lastTranslateY.current = translateYRef.current;
        dragDistance.current = 0;
      } else if (e.touches.length === 2 && t0 && t1) {
        isPinching.current = true;
        initialPinchDistance.current = Math.hypot(
          t0.clientX - t1.clientX,
          t0.clientY - t1.clientY,
        );
        initialPinchScale.current = scaleRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
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
        const s = scaleRef.current;
        const tx = translateXRef.current;
        const ty = translateYRef.current;
        const dist = Math.hypot(
          t0.clientX - t1.clientX,
          t0.clientY - t1.clientY,
        );
        const newScale = clamp(
          initialPinchScale.current * (dist / initialPinchDistance.current),
          MIN_SCALE,
          MAX_SCALE,
        );
        const rect = el.getBoundingClientRect();
        const midX = (t0.clientX + t1.clientX) / 2 - rect.left;
        const midY = (t0.clientY + t1.clientY) / 2 - rect.top;
        const pointX = (midX - tx) / s;
        const pointY = (midY - ty) / s;
        setTranslateX(midX - pointX * newScale);
        setTranslateY(midY - pointY * newScale);
        setScale(newScale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        setIsDragging(false);
        isPinching.current = false;
      } else if (e.touches.length === 1) {
        isPinching.current = false;
        const t0 = e.touches[0];
        if (t0) {
          dragStartX.current = t0.clientX;
          dragStartY.current = t0.clientY;
        }
        lastTranslateX.current = translateXRef.current;
        lastTranslateY.current = translateYRef.current;
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => setIsResetting(false), 300);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
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
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    zoomIn,
    zoomOut,
    resetView,
    getMapCoordinates,
    wasDragging,
  };
}