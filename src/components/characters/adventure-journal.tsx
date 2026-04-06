'use client';

import { useState, useRef, useCallback } from 'react';
import type { Tables } from '@/types/schema';
import { RpgCard } from '@/components/shared/rpg-card';
import { cn } from '@/lib/utils';

interface AdventureJournalProps {
  character: Tables<'characters'>;
  onSave: (notes: string) => Promise<void>;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

export function AdventureJournal({ character, onSave }: AdventureJournalProps) {
  const [notes, setNotes] = useState(character.notes ?? '');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setNotes(value);
      setStatus('saving');

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        try {
          await onSave(value);
          setStatus('saved');
        } catch {
          setStatus('idle');
        }
      }, 500);
    },
    [onSave],
  );

  return (
    <RpgCard
      header={{
        title: 'ADVENTURE JOURNAL & NOTES',
        icon: (
          <span className="text-xs">
            {status === 'saving' && (
              <span className="text-(--color-text-muted) flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-text-muted) animate-pulse" />
                Auto-saving...
              </span>
            )}
            {status === 'saved' && (
              <span className="text-(--color-accent-green)">Saved ✓</span>
            )}
          </span>
        ),
      }}
    >
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Write your adventure notes here..."
        className="min-h-[150px] w-full bg-(--color-surface-input) border border-(--color-border-default) rounded-lg p-3 text-(--color-text-secondary) placeholder:text-(--color-text-muted) resize-none focus:outline-none focus:border-(--color-accent-purple)"
      />
    </RpgCard>
  );
}
