'use client';

import { useState, useCallback } from 'react';
import type { Tables } from '@/types/database';
import type { EncounterFormData } from '@/lib/validations/encounter';
import { EncounterForm } from '@/components/encounters/encounter-form';
import { ProbabilityStream } from '@/components/encounters/probability-stream';
import { DmInsight } from '@/components/encounters/dm-insight';
import { Plus, Swords } from 'lucide-react';

interface EncountersClientProps {
  encounters: Tables<'encounters'>[];
  partyCharacters: Tables<'characters'>[];
  npcs: Tables<'npcs'>[];
  campaignId: string;
}

export function EncountersClient({
  encounters: initialEncounters,
  partyCharacters,
  npcs,
  campaignId,
}: EncountersClientProps) {
  const [encounters, setEncounters] = useState(initialEncounters);
  const [selectedEncounter, setSelectedEncounter] = useState<Tables<'encounters'> | undefined>(
    encounters[0] ?? undefined,
  );
  const [probabilityData, setProbabilityData] = useState<EncounterFormData | null>(null);

  const handleSaved = useCallback(
    (encounter: Tables<'encounters'>) => {
      setEncounters((prev) => {
        const exists = prev.find((e) => e.id === encounter.id);
        if (exists) {
          return prev.map((e) => (e.id === encounter.id ? encounter : e));
        }
        return [encounter, ...prev];
      });
      setSelectedEncounter(encounter);
    },
    [],
  );

  const handleGenerateProbability = useCallback(
    (data: EncounterFormData) => {
      setProbabilityData(data);
    },
    [],
  );

  const handleNewEncounter = useCallback(() => {
    setSelectedEncounter(undefined);
    setProbabilityData(null);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 p-6 lg:p-8">
      {/* Left column */}
      <div className="space-y-4">
        {/* Encounter selector */}
        {encounters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {encounters.map((enc) => (
              <button
                key={enc.id}
                onClick={() => {
                  setSelectedEncounter(enc);
                  setProbabilityData(null);
                }}
                className={
                  selectedEncounter?.id === enc.id
                    ? 'bg-(--color-accent-purple)/20 text-(--color-accent-purple) border border-(--color-accent-purple)/40 rounded px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors'
                    : 'border border-(--color-border-default) text-(--color-text-muted) rounded px-3 py-1.5 text-xs flex items-center gap-1.5 hover:border-(--color-border-hover) transition-colors'
                }
              >
                <Swords className="w-3 h-3" />
                {enc.name}
              </button>
            ))}
            <button
              onClick={handleNewEncounter}
              className="flex items-center gap-1.5 text-xs font-medium text-(--color-accent-green) hover:text-(--color-accent-green)/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Encounter
            </button>
          </div>
        )}

        <EncounterForm
          key={selectedEncounter?.id ?? 'new'}
          encounter={selectedEncounter}
          campaignId={campaignId}
          npcs={npcs}
          onSaved={handleSaved}
          onGenerateProbability={handleGenerateProbability}
        />
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <ProbabilityStream
          encounterData={probabilityData}
          partyCharacters={partyCharacters}
        />
        <DmInsight
          encounterData={probabilityData}
          partyCharacters={partyCharacters}
        />
      </div>
    </div>
  );
}
