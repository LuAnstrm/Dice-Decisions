'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/data-client/client';
import { createNote, deleteNote } from '@/lib/queries/notes';
import { NoteCard } from '@/components/notes/note-card';
import { NoteFilters } from '@/components/notes/note-filters';
import type { Tables } from '@/types/schema';

interface NotesListPanelProps {
  notes: Tables<'notes'>[];
  selectedNoteId: string | null;
  isDM: boolean;
  campaignId: string;
  userId: string;
  onNoteSelect: (note: Tables<'notes'>) => void;
  onNoteCreate: (note: Tables<'notes'>) => void;
  onNoteDelete: (id: string) => void;
}

export function NotesListPanel({
  notes,
  selectedNoteId,
  isDM,
  campaignId,
  userId,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
}: NotesListPanelProps) {
  const [activeTag, setActiveTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [creating, setCreating] = useState(false);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  }, []);

  const filteredNotes = useMemo(() => {
    let result = notes;
    if (activeTag) {
      result = result.filter((n) => n.tag === activeTag);
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.content && n.content.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [notes, activeTag, debouncedSearch]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const dataClient = createClient();
      const newNote = await createNote(dataClient, campaignId, userId);
      if (newNote) {
        onNoteCreate(newNote);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const dataClient = createClient();
    const success = await deleteNote(dataClient, id);
    if (success) {
      onNoteDelete(id);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 space-y-3">
        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full bg-(--color-accent-purple) text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          <Plus size={16} />
          {creating ? 'Creating...' : '+ New Note'}
        </button>

        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-(--color-surface-input) text-(--color-text-primary) text-xs rounded-lg pl-8 pr-3 py-2 border border-(--color-border-default) focus:border-(--color-border-hover) focus:outline-none placeholder:text-(--color-text-muted)"
          />
        </div>

        <NoteFilters activeTag={activeTag} onTagChange={setActiveTag} />
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-xs text-(--color-text-muted) text-center">
              {notes.length === 0
                ? 'No notes yet. Create your first note!'
                : 'No notes match your filters.'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="group relative">
              <NoteCard
                note={note}
                isSelected={note.id === selectedNoteId}
                onClick={() => onNoteSelect(note)}
              />
              {isDM && (
                <button
                  onClick={(e) => handleDelete(e, note.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-(--color-accent-red)/20 text-(--color-text-muted) hover:text-(--color-accent-red) transition-all cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
