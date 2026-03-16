'use client';

import { useState } from 'react';
import type { Tables } from '@/types/database';
import { NPCCard } from '@/components/campaign/npc-card';
import { NPCDialog } from '@/components/campaign/npc-dialog';

interface NPCsClientContentProps {
  npcs: Tables<'npcs'>[];
  isDM: boolean;
  campaignId: string;
}

export function NPCsClientContent({
  npcs,
  isDM,
  campaignId,
}: NPCsClientContentProps) {
  const [selectedNPC, setSelectedNPC] = useState<Tables<'npcs'> | null>(null);
  const [open, setOpen] = useState(false);

  const handleSelectNPC = (npc: Tables<'npcs'>) => {
    setSelectedNPC(npc);
    setOpen(true);
  };

  const handleDelete = async (npcId: string) => {
    // TODO: Implement NPC deletion via API route
    console.log('Delete NPC:', npcId);
    // For now, just close the dialog
    setOpen(false);
  };

  return (
    <>
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {npcs.map((npc) => (
            <NPCCard
              key={npc.id}
              npc={npc}
              isDM={isDM}
              onClick={() => handleSelectNPC(npc)}
            />
          ))}
        </div>
      </div>

      {selectedNPC && (
        <NPCDialog
          npc={selectedNPC}
          open={open}
          onOpenChange={setOpen}
          isDM={isDM}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
