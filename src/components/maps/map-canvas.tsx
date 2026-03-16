'use client';

interface MapCanvasProps {
  imageUrl: string;
  scale: number;
  translateX: number;
  translateY: number;
  isDragging: boolean;
  isResetting: boolean;
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onImageLoad: (width: number, height: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
}

export function MapCanvas({
  imageUrl,
  scale,
  translateX,
  translateY,
  isDragging,
  isResetting,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onImageLoad,
  containerRef,
  children,
}: MapCanvasProps) {
  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="will-change-transform"
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isResetting ? 'transform 300ms ease-out' : 'none',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Campaign map"
          draggable={false}
          className="pointer-events-none select-none"
          onLoad={(e) => {
            const img = e.currentTarget;
            onImageLoad(img.naturalWidth, img.naturalHeight);
          }}
        />
        {children}
      </div>
    </div>
  );
}
