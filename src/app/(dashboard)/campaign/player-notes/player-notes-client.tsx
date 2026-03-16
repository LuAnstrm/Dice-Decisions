'use client';

import { useState } from 'react';
import type { Tables } from '@/types/database';
import { PlayerNoteCard } from '@/components/campaign/player-note-card';
import { PlayerNoteEditDialog } from '@/components/campaign/player-note-edit-dialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { BookOpen, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PlayerNotesClientContentProps {
  notes: Tables<'player_notes'>[];
  campaignId: string;
  userId: string;
}

export function PlayerNotesClientContent({
  notes: initialNotes,
  campaignId,
  userId,
}: PlayerNotesClientContentProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNote, setSelectedNote] = useState<Tables<'player_notes'> | null>(null);
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsCreating(true);
    setOpen(true);
  };

  const handleSelectNote = (note: Tables<'player_notes'>) => {
    setSelectedNote(note);
    setIsCreating(false);
    setOpen(true);
  };

  const handleSave = async (title: string, content: string) => {
    const supabase = createClient();

    try {
      if (isCreating) {
        // Create new note
        const { data, error } = await supabase
          .from('player_notes')
          // @ts-ignore - player_notes table type not yet recognized
          .insert({
            campaign_id: campaignId,
            author_id: userId,
            title,
            content: content || null,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setNotes((prev) => [data as Tables<'player_notes'>, ...prev]);
        }
      } else if (selectedNote) {
        // Update existing note
        const { data, error } = await supabase
          .from('player_notes')
          // @ts-ignore - player_notes table type not yet recognized
          .update({
            title,
            content: content || null,
          })
          .eq('id', selectedNote.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setNotes((prev) =>
            prev.map((n) => (n.id === selectedNote.id ? (data as Tables<'player_notes'>) : n))
          );
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    }
  };

  const handleDelete = async (noteId: string) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('player_notes')
        // @ts-ignore - player_notes table type not yet recognized
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  if (notes.length === 0 && !selectedNote) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex flex-col items-center gap-4">
          <EmptyState
            icon={BookOpen}
            title="No Notes Yet"
            description="Create your first note about the campaign."
          />
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Note
          </Button>
        </div>

        <PlayerNoteEditDialog
          open={open}
          onOpenChange={setOpen}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex justify-end">
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <PlayerNoteCard
              key={note.id}
              note={note}
              onClick={() => handleSelectNote(note)}
            />
          ))}
        </div>
      </div>

      <PlayerNoteEditDialog
        note={selectedNote}
        open={open}
        onOpenChange={setOpen}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
