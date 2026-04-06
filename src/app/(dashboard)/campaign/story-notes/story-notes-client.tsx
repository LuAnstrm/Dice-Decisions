'use client';

import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/data-client/client';
import { updateNote } from '@/lib/queries/notes';
import { NotesListPanel } from '@/components/notes/notes-list-panel';
import { NoteEditor } from '@/components/notes/note-editor';
import type { Tables, AppSchema } from '@/types/schema';

interface StoryNotesClientProps {
  initialNotes: Tables<'notes'>[];
  isDM: boolean;
  campaignId: string;
  userId: string;
}

export function StoryNotesClient({
  initialNotes,
  isDM,
  campaignId,
  userId,
}: StoryNotesClientProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNote, setSelectedNote] = useState<Tables<'notes'> | null>(
    null,
  );
  const [mobileShowEditor, setMobileShowEditor] = useState(false);

  const handleNoteSelect = useCallback((note: Tables<'notes'>) => {
    setSelectedNote(note);
    setMobileShowEditor(true);
  }, []);

  const handleNoteCreate = useCallback((note: Tables<'notes'>) => {
    setNotes((prev) => [note, ...prev]);
    setSelectedNote(note);
    setMobileShowEditor(true);
  }, []);

  const handleNoteDelete = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setMobileShowEditor(false);
      }
    },
    [selectedNote?.id],
  );

  const handleUpdate = useCallback(
    (id: string, data: AppSchema['public']['Tables']['notes']['Update']) => {
      const dataClient = createClient();
      updateNote(dataClient, id, data).then((updated) => {
        if (updated) {
          setNotes((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n)),
          );
          setSelectedNote((prev) =>
            prev?.id === updated.id ? updated : prev,
          );
        }
      });
    },
    [],
  );

  const handleBack = useCallback(() => {
    setMobileShowEditor(false);
  }, []);

  useEffect(() => {
    if (!selectedNote && notes.length > 0) {
      setSelectedNote(notes[0] ?? null);
    }
  }, [notes, selectedNote]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-[calc(100vh-64px)] overflow-hidden">
      {/* Left panel - notes list */}
      <div
        className={`overflow-y-auto border-r border-(--color-border-default) bg-(--color-surface-base) ${
          mobileShowEditor ? 'hidden lg:block' : 'block'
        }`}
      >
        <NotesListPanel
          notes={notes}
          selectedNoteId={selectedNote?.id ?? null}
          isDM={isDM}
          campaignId={campaignId}
          userId={userId}
          onNoteSelect={handleNoteSelect}
          onNoteCreate={handleNoteCreate}
          onNoteDelete={handleNoteDelete}
        />
      </div>

      {/* Right panel - editor */}
      <div
        className={`overflow-y-auto ${
          mobileShowEditor ? 'block' : 'hidden lg:block'
        }`}
      >
        {mobileShowEditor && (
          <button
            onClick={handleBack}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2 text-sm text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to notes
          </button>
        )}
        <NoteEditor
          note={selectedNote}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
