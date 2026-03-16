'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Tables } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { UserCircle } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { CharacterHeader } from '@/components/characters/character-header';
import { AbilityScores } from '@/components/characters/ability-scores';
import { SecondaryStats } from '@/components/characters/secondary-stats';
import { WeaponsAttacks } from '@/components/characters/weapons-attacks';
import { SpecialAbilities } from '@/components/characters/special-abilities';
import { InventorySummary } from '@/components/characters/inventory-summary';
import { AdventureJournal } from '@/components/characters/adventure-journal';
import { CharacterFormDialog } from '@/components/characters/character-form-dialog';

interface CharactersClientContentProps {
  characters: Tables<'characters'>[];
  isDM: boolean;
  campaignId: string;
  userId: string;
}

export function CharactersClientContent({
  characters,
  isDM,
  campaignId,
  userId,
}: CharactersClientContentProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editChar, setEditChar] = useState<Tables<'characters'> | undefined>(undefined);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const selectedCharacter = characters[selectedIdx] ?? null;

  const handleEditClick = useCallback(() => {
    if (selectedCharacter) {
      setEditChar(selectedCharacter);
      setFormOpen(true);
    }
  }, [selectedCharacter]);

  const handleCreateClick = useCallback(() => {
    setEditChar(undefined);
    setFormOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleSaveNotes = useCallback(
    async (notes: string) => {
      if (!selectedCharacter) return;
      const supabase = createClient();
      await supabase
        .from('characters')
        .update({ notes } as never)
        .eq('id', selectedCharacter.id);
    },
    [selectedCharacter],
  );

  // No characters
  if (characters.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={UserCircle}
          title={isDM ? 'No Party Members' : 'No Character'}
          description={
            isDM
              ? 'No players have created characters in this campaign yet.'
              : 'Create your character with ability scores, HP, weapons, and more.'
          }
          action={
            !isDM
              ? { label: 'Create Your Character', onClick: handleCreateClick }
              : undefined
          }
        />
        <CharacterFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          character={editChar}
          campaignId={campaignId}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* DM: character selector */}
      {isDM && characters.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {characters.map((char, idx) => (
            <button
              key={char.id}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-badge text-sm transition-colors ${
                idx === selectedIdx
                  ? 'bg-(--color-accent-purple) text-white'
                  : 'bg-(--color-surface-elevated) text-(--color-text-secondary) border border-(--color-border-default) hover:border-(--color-border-hover)'
              }`}
            >
              {char.name}
            </button>
          ))}
        </div>
      )}

      {selectedCharacter && (
        <>
          <CharacterHeader
            character={selectedCharacter}
            onEditClick={handleEditClick}
            isDM={isDM}
          />
          <AbilityScores character={selectedCharacter} />
          <SecondaryStats character={selectedCharacter} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeaponsAttacks character={selectedCharacter} />
            <SpecialAbilities character={selectedCharacter} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InventorySummary character={selectedCharacter} />
            <AdventureJournal character={selectedCharacter} onSave={handleSaveNotes} />
          </div>
        </>
      )}

      <CharacterFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        character={editChar}
        campaignId={campaignId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
