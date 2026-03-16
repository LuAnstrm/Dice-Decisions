'use client';

import { useState, useRef, useEffect } from 'react';
import type { Tables } from '@/types/database';
import { cn } from '@/lib/utils';
import { NPC_ROLE_LABELS } from '@/lib/validations/npc';
import {
  Heart,
  Shield,
  Swords,
  Pencil,
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  Copy,
} from 'lucide-react';

interface NpcCardProps {
  npc: Tables<'npcs'>;
  isDM: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: (visible: boolean) => void;
}

const ROLE_GRADIENT: Record<string, string> = {
  villain: 'from-red-900/80 to-red-700/40',
  quest_giver: 'from-purple-900/80 to-purple-700/40',
  merchant: 'from-green-900/80 to-green-700/40',
  guide: 'from-gray-800/80 to-gray-600/40',
  mercenary: 'from-blue-900/80 to-blue-700/40',
};

const ROLE_BADGE: Record<string, string> = {
  villain: 'bg-red-500/80 text-white',
  quest_giver: 'bg-purple-500/80 text-white',
  merchant: 'bg-green-500/80 text-white',
  guide: 'bg-gray-500/80 text-white',
  mercenary: 'bg-blue-500/80 text-white',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-500/80 text-white',
  deceased: 'bg-gray-500/80 text-white',
  hidden: 'bg-yellow-500/80 text-white',
};

export function NpcCard({
  npc,
  isDM,
  onEdit,
  onDelete,
  onToggleVisibility,
}: NpcCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDeceased = npc.status === 'deceased';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleKey = npc.role ?? 'guide';
  const gradient = ROLE_GRADIENT[roleKey] ?? ROLE_GRADIENT.guide;
  const roleBadge = ROLE_BADGE[roleKey] ?? ROLE_BADGE.guide;
  const statusBadge = STATUS_BADGE[npc.status] ?? STATUS_BADGE.active;
  const roleLabel =
    NPC_ROLE_LABELS[roleKey as keyof typeof NPC_ROLE_LABELS] ?? npc.role;

  return (
    <div
      className={cn(
        'relative rounded-card border border-(--color-border-default) bg-(--color-surface-elevated) shadow-card overflow-hidden transition-all hover:border-(--color-border-hover) hover:shadow-card-hover hover:-translate-y-0.5',
        isDeceased && 'opacity-60 grayscale-[50%]',
      )}
    >
      {/* DM ONLY banner */}
      {!npc.is_visible_to_players && isDM && (
        <div className="absolute inset-x-0 top-0 bg-red-600/80 text-white text-xs font-bold text-center py-1 z-20">
          DM ONLY
        </div>
      )}

      {/* Header image area */}
      <div
        className={cn(
          'relative h-[120px] flex items-center justify-center bg-gradient-to-br',
          gradient,
        )}
      >
        <span className="text-4xl font-bold text-white opacity-50 select-none">
          {npc.name.charAt(0).toUpperCase()}
        </span>
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <span
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full',
              roleBadge,
            )}
          >
            {roleLabel}
          </span>
          <span
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full',
              statusBadge,
            )}
          >
            {npc.status}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-bold text-(--color-text-primary) truncate">
            {npc.name}
          </h3>
          {isDM && (
            <button
              onClick={onEdit}
              className="bg-(--color-accent-purple)/15 text-(--color-accent-purple) rounded p-1 flex-shrink-0 ml-2 hover:bg-(--color-accent-purple)/25 transition-colors"
            >
              <Pencil className="size-3.5" />
            </button>
          )}
        </div>

        {npc.description && (
          <p className="text-sm italic text-(--color-text-secondary) line-clamp-2 mb-3">
            {npc.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 font-mono text-sm">
          <div className="flex items-center gap-1">
            <Heart className="size-3.5 text-(--color-accent-green)" />
            <span className="text-(--color-accent-green)">
              {isDeceased ? 0 : (npc.hp ?? '--')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="size-3.5 text-(--color-text-secondary)" />
            <span className="text-(--color-text-secondary)">
              {isDeceased ? '--' : (npc.armor_class ?? '--')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Swords className="size-3.5 text-(--color-text-secondary)" />
            <span className="text-(--color-text-secondary)">
              {isDeceased
                ? '--'
                : npc.attack_bonus != null
                  ? `+${npc.attack_bonus}`
                  : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      {isDM && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-(--color-border-default)">
          <button
            onClick={() => onToggleVisibility(!npc.is_visible_to_players)}
            className="flex items-center gap-1.5 text-xs text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
            title={npc.is_visible_to_players ? 'Visible to players' : 'Hidden from players'}
          >
            {npc.is_visible_to_players ? (
              <Eye className="size-3.5 text-(--color-accent-green)" />
            ) : (
              <EyeOff className="size-3.5 text-(--color-text-muted)" />
            )}
            <span>{npc.is_visible_to_players ? 'Visible' : 'Hidden'}</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded hover:bg-(--color-surface-input) transition-colors text-(--color-text-secondary)"
            >
              <MoreVertical className="size-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-36 rounded-card bg-(--color-surface-elevated) border border-(--color-border-default) shadow-card py-1 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-(--color-text-secondary) hover:bg-(--color-surface-input) hover:text-(--color-text-primary)"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-(--color-accent-red) hover:bg-red-500/10"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    // Duplicate is handled in parent via onEdit with a cloned NPC
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-(--color-text-secondary) hover:bg-(--color-surface-input) hover:text-(--color-text-primary)"
                >
                  <Copy className="size-3.5" />
                  Duplicate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
