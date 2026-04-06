'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Tables } from '@/types/schema';
import { createClient } from '@/lib/data-client/client';
import { createEncounter, updateEncounter } from '@/lib/queries/encounters';
import {
  encounterSchema,
  type EncounterFormData,
  type EnemyEntry,
} from '@/lib/validations/encounter';
import { RpgCard } from '@/components/shared/rpg-card';
import { EnemyTable } from '@/components/encounters/enemy-table';
import { Calendar, Swords, CheckCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface EncounterFormProps {
  encounter?: Tables<'encounters'>;
  campaignId: string;
  npcs: Tables<'npcs'>[];
  onSaved: (encounter: Tables<'encounters'>) => void;
  onGenerateProbability: (encounter: EncounterFormData) => void;
}

const STATUS_TABS = [
  { value: 'planned' as const, label: 'PLANNED', icon: Calendar },
  { value: 'active' as const, label: 'ACTIVE', icon: Activity },
  { value: 'completed' as const, label: 'COMPLETED', icon: CheckCircle },
];

export function EncounterForm({
  encounter,
  campaignId,
  npcs,
  onSaved,
  onGenerateProbability,
}: EncounterFormProps) {
  const isEditing = !!encounter;

  const defaultEnemies: EnemyEntry[] = encounter?.enemies
    ? (encounter.enemies as unknown as EnemyEntry[])
    : [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EncounterFormData>({
    resolver: zodResolver(encounterSchema),
    defaultValues: {
      name: encounter?.name ?? '',
      description: encounter?.description ?? '',
      difficulty_class: encounter?.difficulty_class ?? 10,
      enemies: defaultEnemies,
      status: encounter?.status ?? 'planned',
    },
  });

  const currentStatus = useWatch({ control, name: 'status' });
  const currentEnemies = useWatch({ control, name: 'enemies' });
  const currentName = useWatch({ control, name: 'name' });
  const currentDescription = useWatch({ control, name: 'description' });
  const currentDC = useWatch({ control, name: 'difficulty_class' });

  function handleEnemiesChange(enemies: EnemyEntry[]) {
    setValue('enemies', enemies, { shouldValidate: true });
  }

  async function onSubmit(data: EncounterFormData) {
    try {
      const dataClient = createClient();
      const payload = {
        campaign_id: campaignId,
        name: data.name,
        description: data.description || null,
        difficulty_class: data.difficulty_class,
        enemies: data.enemies as unknown as Tables<'encounters'>['enemies'],
        status: data.status,
      };

      let result: Tables<'encounters'> | null;

      if (isEditing && encounter) {
        result = await updateEncounter(dataClient, encounter.id, payload);
      } else {
        result = await createEncounter(dataClient, payload);
      }

      if (result) {
        toast.success(isEditing ? 'Encounter updated!' : 'Encounter created!');
        onSaved(result);
      } else {
        toast.error('Failed to save encounter.');
      }
    } catch {
      toast.error('An error occurred while saving.');
    }
  }

  function handleGenerateProbability() {
    const data = {
      name: currentName,
      description: currentDescription,
      difficulty_class: currentDC,
      enemies: currentEnemies,
      status: currentStatus,
    };
    onGenerateProbability(data);
  }

  return (
    <RpgCard
      header={{
        title: isEditing ? 'Edit Encounter' : 'Create Encounter',
        icon: <Swords className="w-4 h-4 text-(--color-accent-purple)" />,
      }}
    >
      {/* Status tabs */}
      <div className="flex items-center gap-2 mb-6">
        {STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setValue('status', tab.value)}
              className={
                isActive
                  ? 'bg-(--color-accent-purple) text-white rounded px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors'
                  : 'border border-(--color-border-default) text-(--color-text-muted) rounded px-3 py-1.5 text-xs flex items-center gap-1.5 hover:border-(--color-border-hover) transition-colors'
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Encounter name */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted) mb-1.5">
            Encounter Name
          </label>
          <input
            {...register('name')}
            placeholder="e.g. Goblin Ambush"
            className="w-full bg-(--color-surface-input) border border-(--color-border-default) rounded px-3 py-2 text-(--color-text-primary) text-sm placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-active)"
          />
          {errors.name && (
            <p className="text-xs text-(--color-accent-red) mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* DC */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted) mb-1.5">
            Difficulty Class (DC)
          </label>
          <input
            type="number"
            {...register('difficulty_class', { valueAsNumber: true })}
            className="w-24 bg-(--color-surface-input) border border-(--color-border-default) rounded px-3 py-2 text-(--color-text-primary) text-sm font-mono focus:outline-none focus:border-(--color-border-active)"
          />
          {errors.difficulty_class && (
            <p className="text-xs text-(--color-accent-red) mt-1">
              {errors.difficulty_class.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted) mb-1.5">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Describe the encounter scenario..."
            className="w-full bg-(--color-surface-input) border border-(--color-border-default) rounded px-3 py-2 text-(--color-text-primary) text-sm placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-active) resize-none"
          />
        </div>

        {/* Enemies */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted) mb-2">
            Enemies
          </label>
          <EnemyTable
            enemies={currentEnemies}
            onChange={handleEnemiesChange}
            npcs={npcs}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-(--color-accent-purple) text-white rounded-badge px-4 py-2 font-semibold text-sm hover:bg-(--color-accent-purple)/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'SAVING...' : 'SAVE ENCOUNTER'}
          </button>
          <button
            type="button"
            onClick={handleGenerateProbability}
            className="border border-(--color-accent-purple) text-(--color-accent-purple) rounded-badge px-4 py-2 font-semibold text-sm hover:bg-(--color-accent-purple)/10 transition-colors"
          >
            GENERATE PROBABILITY
          </button>
        </div>
      </form>
    </RpgCard>
  );
}
