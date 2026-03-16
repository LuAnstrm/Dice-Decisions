'use client';

import { useState } from 'react';
import type { Tables } from '@/types/database';
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
import { cn } from '@/lib/utils';
import { Trash2, Edit2 } from 'lucide-react';

interface NPCDialogProps {
  npc: Tables<'npcs'>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDM?: boolean;
  onEdit?: (npc: Tables<'npcs'>) => void;
  onDelete?: (npcId: string) => void;
}

const NPC_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-300',
  deceased: 'bg-red-500/20 text-red-300',
  hidden: 'bg-yellow-500/20 text-yellow-300',
};

export function NPCDialog({
  npc,
  open,
  onOpenChange,
  isDM = false,
  onEdit,
  onDelete,
}: NPCDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this NPC?')) return;
    setIsDeleting(true);
    try {
      await onDelete?.(npc.id);
      onOpenChange?.(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const statusColor =
    NPC_STATUS_COLORS[npc.status as string] || 'bg-gray-500/20 text-gray-300';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{npc.name}</DialogTitle>
              {npc.role && (
                <DialogDescription className="text-sm mt-1">
                  {npc.role}
                </DialogDescription>
              )}
            </div>
            {!npc.is_visible_to_players && isDM && (
              <span className="flex-shrink-0 text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                DM Only
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            {npc.race && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                  Race
                </p>
                <p className="text-sm text-[var(--color-text-primary)] font-medium mt-1">
                  {npc.race}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                Status
              </p>
              <span className={cn('text-xs font-medium py-1 px-2 rounded inline-block mt-1', statusColor)}>
                {npc.status}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-lg">
            {npc.hp !== null && (
              <div className="text-center">
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">HP</p>
                <p className="text-lg font-bold text-[var(--color-accent)] mt-1">{npc.hp}</p>
              </div>
            )}
            {npc.armor_class !== null && (
              <div className="text-center">
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">AC</p>
                <p className="text-lg font-bold text-[var(--color-accent)] mt-1">{npc.armor_class}</p>
              </div>
            )}
            {npc.attack_bonus !== null && (
              <div className="text-center">
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">ATK</p>
                <p className="text-lg font-bold text-[var(--color-accent)] mt-1">+{npc.attack_bonus}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {npc.description && (
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                Description
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {npc.description}
              </p>
            </div>
          )}

          {/* Notes (DM only) */}
          {npc.notes && isDM && (
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                DM Notes
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] bg-white/5 p-3 rounded">
                {npc.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            {isDM && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(npc)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
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
              </>
            )}
          </div>
          <DialogClose render={<Button variant="outline" size="sm">Close</Button>}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
