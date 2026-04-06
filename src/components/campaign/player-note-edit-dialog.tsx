'use client';

import { useState } from 'react';
import type { Tables } from '@/types/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface PlayerNoteEditDialogProps {
  note?: Tables<'player_notes'> | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (title: string, content: string) => Promise<void>;
  onDelete?: (noteId: string) => Promise<void>;
}

export function PlayerNoteEditDialog({
  note,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: PlayerNoteEditDialogProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setIsLoading(true);
    try {
      await onSave?.(title, content);
      onOpenChange?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!note || !window.confirm('Are you sure you want to delete this note?')) return;

    setIsDeleting(true);
    try {
      await onDelete?.(note.id);
      onOpenChange?.(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const isNew = !note;
  const isModified = note && (title !== note.title || content !== (note.content || ''));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isNew ? 'New Note' : 'Edit Note'}</DialogTitle>
          <DialogDescription>
            Write your personal notes about the campaign. Only you can see these notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="note-title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="note-content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes here..."
              rows={8}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between">
          <div>
            {!isNew && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <DialogClose render={<Button variant="outline" size="sm">Cancel</Button>}>
              Cancel
            </DialogClose>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading || (isNew ? !title.trim() : !isModified)}
            >
              {isLoading ? 'Saving...' : isNew ? 'Create' : 'Save'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
