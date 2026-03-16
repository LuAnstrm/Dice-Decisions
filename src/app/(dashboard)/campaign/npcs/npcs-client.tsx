'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Tables } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { deleteNPC, toggleNPCVisibility, getNPCs } from '@/lib/queries/npcs';
import { NpcFilters } from '@/components/npcs/npc-filters';
import { NpcGrid } from '@/components/npcs/npc-grid';
import { NpcFormDialog } from '@/components/npcs/npc-form-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

interface NPCsClientContentProps {
  npcs: Tables<'npcs'>[];
  isDM: boolean;
  campaignId: string;
}

export function NPCsClientContent({
  npcs: initialNpcs,
  isDM,
  campaignId,
}: NPCsClientContentProps) {
  const router = useRouter();
  const [npcs, setNpcs] = useState(initialNpcs);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ roles: string[]; status: string }>({
    roles: [],
    status: 'all',
  });
  const [selectedNPC, setSelectedNPC] = useState<Tables<'npcs'> | undefined>(
    undefined,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const refreshNpcs = useCallback(async () => {
    const supabase = createClient();
    const fresh = await getNPCs(supabase, campaignId, isDM);
    setNpcs(fresh);
  }, [campaignId, isDM]);

  const filteredNpcs = useMemo(() => {
    let result = npcs;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (npc) =>
          npc.name.toLowerCase().includes(q) ||
          npc.role?.toLowerCase().includes(q) ||
          npc.description?.toLowerCase().includes(q),
      );
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((npc) => npc.status === filters.status);
    }

    if (filters.roles.length > 0) {
      result = result.filter(
        (npc) => npc.role && filters.roles.includes(npc.role),
      );
    }

    return result;
  }, [npcs, search, filters]);

  const handleEdit = useCallback((npc: Tables<'npcs'>) => {
    setSelectedNPC(npc);
    setDialogOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedNPC(undefined);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const result = await deleteNPC(supabase, id);

      if (result.error === 'NPC_IN_ENCOUNTER') {
        toast.error(
          `Cannot delete: NPC is referenced in encounter "${result.encounterName ?? 'unknown'}"`,
        );
        return;
      }

      // Optimistic removal
      setNpcs((prev) => prev.filter((n) => n.id !== id));
      toast.success('NPC deleted');
      router.refresh();
    },
    [router],
  );

  const handleToggleVisibility = useCallback(
    async (id: string, visible: boolean) => {
      // Optimistic update
      setNpcs((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_visible_to_players: visible } : n,
        ),
      );

      const supabase = createClient();
      const result = await toggleNPCVisibility(supabase, id, visible);
      if (!result) {
        // Revert on failure
        setNpcs((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, is_visible_to_players: !visible } : n,
          ),
        );
        toast.error('Failed to update visibility');
      } else {
        toast.success(visible ? 'NPC is now visible to players' : 'NPC hidden from players');
      }
    },
    [],
  );

  const handleSuccess = useCallback(() => {
    refreshNpcs();
    toast.success(selectedNPC ? 'NPC updated' : 'NPC created');
    router.refresh();
  }, [refreshNpcs, selectedNPC, router]);

  return (
    <>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-(--color-text-primary) shrink-0">
            NPCs
          </h2>
          <div className="flex-1 w-full">
            <NpcFilters onSearch={setSearch} onFilterChange={setFilters} />
          </div>
          {isDM && (
            <Button onClick={handleCreate} className="shrink-0">
              <Plus className="size-4 mr-1" />
              New NPC
            </Button>
          )}
        </div>

        {/* Content */}
        {npcs.length === 0 && !search && filters.roles.length === 0 && filters.status === 'all' ? (
          <EmptyState
            icon={Users}
            title="No NPCs"
            description={
              isDM
                ? "Create and manage your campaign's non-player characters."
                : 'No NPCs are visible in this campaign.'
            }
          />
        ) : (
          <NpcGrid
            npcs={filteredNpcs}
            isDM={isDM}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
          />
        )}
      </div>

      <NpcFormDialog
        key={selectedNPC?.id ?? 'new'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        npc={selectedNPC}
        campaignId={campaignId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
