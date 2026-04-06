'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ScrollText, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TiptapToolbar } from '@/components/notes/tiptap-toolbar';
import type { Tables, AppSchema } from '@/types/schema';

type NoteTag = AppSchema['public']['Enums']['note_tag'];

const TAG_DEFAULT = {
  bg: 'bg-(--color-accent-cyan)/20',
  text: 'text-(--color-accent-cyan)',
  label: 'Session Log',
};

const tagStyles = {
  session_log: TAG_DEFAULT,
  world_lore: {
    bg: 'bg-(--color-accent-purple)/20',
    text: 'text-(--color-accent-purple)',
    label: 'World Lore',
  },
  plot: {
    bg: 'bg-(--color-accent-amber)/20',
    text: 'text-(--color-accent-amber)',
    label: 'Plot',
  },
  dm_secret: {
    bg: 'bg-(--color-accent-red)/20',
    text: 'text-(--color-accent-red)',
    label: 'DM Secret',
  },
} as const satisfies Record<string, { bg: string; text: string; label: string }>;

const tagOptions: { value: NoteTag; label: string }[] = [
  { value: 'session_log', label: 'Session Log' },
  { value: 'world_lore', label: 'World Lore' },
  { value: 'plot', label: 'Plot' },
  { value: 'dm_secret', label: 'DM Secret' },
];

interface NoteEditorProps {
  note: Tables<'notes'> | null;
  onUpdate: (
    id: string,
    data: AppSchema['public']['Tables']['notes']['Update'],
  ) => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [title, setTitle] = useState(note?.title ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your campaign notes here...',
      }),
    ],
    content: note?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-(--color-text-secondary)',
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (!note) return;
      clearDebounce();
      setSaveStatus('saving');
      debounceRef.current = setTimeout(() => {
        onUpdate(note.id, { content: ed.getHTML() });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
    },
  });

  // Sync editor content when note changes
  useEffect(() => {
    if (editor && note) {
      editor.commands.setContent(note.content || '');
      setTitle(note.title);
      setSaveStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => clearDebounce();
  }, [clearDebounce]);

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-(--color-text-muted)">
        <ScrollText size={48} className="mb-3 opacity-50" />
        <p className="text-sm">Select a note or create a new one</p>
      </div>
    );
  }

  const tag = tagStyles[note.tag as keyof typeof tagStyles] ?? TAG_DEFAULT;

  const handleTagChange = (newTag: NoteTag) => {
    onUpdate(note.id, {
      tag: newTag,
      is_visible_to_players: newTag !== 'dm_secret',
    });
  };

  const handleTitleBlur = () => {
    if (title !== note.title) {
      setSaveStatus('saving');
      onUpdate(note.id, { title: title || 'Untitled Note' });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Metadata bar */}
      <div className="flex items-center justify-between p-4 border-b border-(--color-border-default)">
        <div className="flex items-center gap-2">
          <select
            value={note.tag}
            onChange={(e) => handleTagChange(e.target.value as NoteTag)}
            className={cn(
              'text-xs px-2 py-1 rounded-badge font-medium border-none outline-none cursor-pointer appearance-none',
              tag.bg,
              tag.text,
            )}
          >
            {tagOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {note.tag === 'dm_secret' && (
            <Lock size={14} className="text-(--color-accent-red)" />
          )}
        </div>
        <div>
          {saveStatus === 'saving' && (
            <span className="text-xs text-(--color-text-muted) animate-pulse">
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-(--color-accent-green) flex items-center gap-1">
              <Check size={12} />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        placeholder="Untitled Note"
        className="w-full bg-transparent text-2xl font-bold text-(--color-text-primary) outline-none border-none px-4 py-3 placeholder:text-(--color-text-muted)"
      />

      {/* Toolbar */}
      <TiptapToolbar editor={editor} />

      {/* Editor */}
      <div className="flex-1 overflow-y-auto [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-(--color-accent-purple) [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-(--color-text-muted) [&_.tiptap_p.is-editor-empty:first-child::before]:text-(--color-text-muted) [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:h-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
