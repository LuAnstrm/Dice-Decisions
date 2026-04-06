'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import type { ProbabilityCardData } from '@/types/probability';
import { createClient } from '@/lib/data-client/client';

interface SaveToEncounterProps {
  card: ProbabilityCardData | null;
}

interface EncounterRow {
  id: string;
  name: string;
  created_at: string;
}

const STORAGE_PREFIX = 'dice-decisions-encounter-cards-';

export function SaveToEncounter({ card }: SaveToEncounterProps) {
  const [open, setOpen] = useState(false);
  const [encounters, setEncounters] = useState<EncounterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) return;

    const dataClient = createClient();

    async function loadEncounters() {
      setLoading(true);
      setSaved(false);
      setSelectedId(null);

      const { data: { user } } = await dataClient.auth.getUser();
      if (!user) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      setIsLoggedIn(true);

      // Get campaigns owned by this user, then their encounters
      const { data: campaigns } = await dataClient
        .from('campaigns')
        .select('id')
        .eq('dm_id', user.id);

      if (campaigns && campaigns.length > 0) {
        const campaignIds = (campaigns as Array<{ id: string }>).map((c) => c.id);
        const { data: encounterData } = await dataClient
          .from('encounters')
          .select('id, name, created_at')
          .in('campaign_id', campaignIds)
          .order('created_at', { ascending: false });

        setEncounters(encounterData ?? []);
      }
      setLoading(false);
    }

    loadEncounters();
  }, [open]);

  function handleSave() {
    if (!selectedId || !card) return;

    // Store probability card in localStorage keyed by encounter
    const key = `${STORAGE_PREFIX}${selectedId}`;
    const existing = JSON.parse(localStorage.getItem(key) ?? '[]') as ProbabilityCardData[];
    existing.push(card);
    localStorage.setItem(key, JSON.stringify(existing));
    setSaved(true);
    setTimeout(() => setOpen(false), 800);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            disabled={!card}
            className="gap-2 bg-(--color-accent) text-white hover:bg-(--color-accent)"
          />
        }
      >
        <Bookmark size={14} />
        Save to Encounter
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Encounter</DialogTitle>
          <DialogDescription>
            Choose an encounter to attach this probability card.
          </DialogDescription>
        </DialogHeader>

        {isLoggedIn === false && (
          <p className="text-sm text-[var(--color-text-muted)] py-4">
            Log in to save cards to encounters.
          </p>
        )}

        {loading && (
          <p className="text-sm text-[var(--color-text-muted)] py-4">
            Loading encounters...
          </p>
        )}

        {isLoggedIn && !loading && encounters.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)] py-4">
            No encounters found. Create an encounter first.
          </p>
        )}

        {isLoggedIn && !loading && encounters.length > 0 && (
          <div className="max-h-[240px] overflow-y-auto space-y-1">
            {encounters.map((enc) => (
              <button
                key={enc.id}
                onClick={() => setSelectedId(enc.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedId === enc.id
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-text-primary)] border border-[var(--color-accent)]/30'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'
                }`}
              >
                <p className="font-medium">{enc.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {new Date(enc.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}

        <DialogFooter>
          {saved ? (
            <p className="text-sm text-emerald-400 font-medium">Saved!</p>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!selectedId || saved}
              className="bg-(--color-accent) text-white hover:bg-(--color-accent)"
            >
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
