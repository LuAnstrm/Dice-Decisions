'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACCEPTED_IMAGE_TYPES, MAX_MAP_FILE_SIZE } from '@/lib/validations/maps';
import type { MapData } from '@/types/maps';

interface MapUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  onMapCreated: (map: MapData) => void;
  onUpload: (name: string, file: File) => Promise<MapData>;
}

export function MapUploadDialog({
  isOpen,
  onClose,
  onMapCreated,
  onUpload,
}: MapUploadDialogProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL on unmount or dialog close
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetState = useCallback(() => {
    setName('');
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    setIsUploading(false);
    setIsDragOver(false);
  }, [previewUrl]);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) {
      return 'Only JPG, PNG, and WebP images are supported.';
    }
    if (f.size > MAX_MAP_FILE_SIZE) {
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      return `Image must be under 5MB. Selected file is ${sizeMB} MB.`;
    }
    return null;
  };

  const handleFileSelect = (f: File) => {
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  const handleUpload = async () => {
    if (!name.trim() || !file) return;
    setIsUploading(true);
    setError(null);

    try {
      const newMap = await onUpload(name.trim(), file);
      onMapCreated(newMap);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md bg-[rgba(15,15,25,0.98)] border-[var(--color-border)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--color-text-primary)] font-display">
            Upload New Map
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Map name */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase mb-1.5">
              Map Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tower of Fate — Level 1"
              className="bg-[rgba(20,20,30,0.8)] border-[var(--color-border)]"
              maxLength={100}
            />
          </div>

          {/* File upload zone */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase mb-1.5">
              Map Image
            </label>
            {file && previewUrl ? (
              <div className="rounded-lg border border-[var(--color-border)] bg-[rgba(20,20,30,0.5)] p-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text-primary)] truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <X size={16} className="text-[var(--color-text-muted)]" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center h-[180px] rounded-lg border-2 border-dashed transition-colors ${
                  isDragOver
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                    : 'border-[var(--color-border)] bg-[rgba(20,20,30,0.3)]'
                }`}
              >
                <UploadCloud size={32} className="text-[var(--color-text-muted)] mb-2" />
                <p className="text-sm text-[var(--color-text-muted)] mb-1">
                  Drag and drop your map image here
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                    e.target.value = '';
                  }}
                />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isUploading}
              className="text-[var(--color-text-muted)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!name.trim() || !file || isUploading}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
