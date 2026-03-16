'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Tables } from '@/types/database';
import { characterSchema, type CharacterFormData } from '@/lib/validations/character';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CharacterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character?: Tables<'characters'>;
  campaignId: string;
  onSuccess: () => void;
}

const ABILITY_FIELDS = [
  { name: 'strength' as const, label: 'STR' },
  { name: 'dexterity' as const, label: 'DEX' },
  { name: 'constitution' as const, label: 'CON' },
  { name: 'intelligence' as const, label: 'INT' },
  { name: 'wisdom' as const, label: 'WIS' },
  { name: 'charisma' as const, label: 'CHA' },
];

export function CharacterFormDialog({
  open,
  onOpenChange,
  character,
  campaignId,
  onSuccess,
}: CharacterFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!character;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(characterSchema),
    defaultValues: character
      ? {
          name: character.name,
          race: character.race,
          char_class: character.char_class,
          level: character.level,
          strength: character.strength,
          dexterity: character.dexterity,
          constitution: character.constitution,
          intelligence: character.intelligence,
          wisdom: character.wisdom,
          charisma: character.charisma,
          hp_current: character.hp_current,
          hp_max: character.hp_max,
          ac: character.armor_class,
          speed: character.speed,
        }
      : {
          level: 1,
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
          hp_current: 10,
          hp_max: 10,
          ac: 10,
          speed: 30,
        },
  });

  const onSubmit = async (data: CharacterFormData) => {
    setLoading(true);
    try {
      const supabase = createClient();

      const dbPayload = {
        name: data.name,
        race: data.race,
        char_class: data.char_class,
        level: data.level,
        strength: data.strength,
        dexterity: data.dexterity,
        constitution: data.constitution,
        intelligence: data.intelligence,
        wisdom: data.wisdom,
        charisma: data.charisma,
        hp_current: data.hp_current,
        hp_max: data.hp_max,
        armor_class: data.ac,
        speed: data.speed,
        weapons: data.weapons,
        abilities: data.abilities,
        inventory: data.inventory,
      };

      if (isEdit && character) {
        const { error } = await supabase
          .from('characters')
          .update(dbPayload as never)
          .eq('id', character.id);
        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('characters')
          .insert({ ...dbPayload, user_id: user.id, campaign_id: campaignId } as never);
        if (error) throw error;
      }

      reset();
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Character form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-(--color-surface-input) border border-(--color-border-default) rounded-lg px-3 py-2 text-(--color-text-primary) focus:outline-none focus:border-(--color-accent-purple) text-sm';
  const labelClass = 'text-xs text-(--color-text-muted) uppercase tracking-wider mb-1 block';
  const errorClass = 'text-xs text-(--color-accent-red) mt-1';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-(--color-surface-elevated) border border-(--color-border-default) sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-(--color-text-primary)">
            {isEdit ? 'Edit Character' : 'Create Character'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as (data: Record<string, unknown>) => Promise<void>)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs text-(--color-text-muted) uppercase tracking-wider font-semibold">
              Basic Info
            </h4>
            <div>
              <label className={labelClass}>Name</label>
              <input {...register('name')} className={inputClass} placeholder="Character name" />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Race</label>
                <input {...register('race')} className={inputClass} placeholder="e.g. Human" />
                {errors.race && <p className={errorClass}>{errors.race.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Class</label>
                <input {...register('char_class')} className={inputClass} placeholder="e.g. Fighter" />
                {errors.char_class && <p className={errorClass}>{errors.char_class.message}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <input
                type="number"
                {...register('level', { valueAsNumber: true })}
                className={inputClass}
              />
              {errors.level && <p className={errorClass}>{errors.level.message}</p>}
            </div>
          </div>

          {/* Ability Scores */}
          <div className="space-y-3">
            <h4 className="text-xs text-(--color-text-muted) uppercase tracking-wider font-semibold">
              Ability Scores
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {ABILITY_FIELDS.map(({ name, label }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type="number"
                    {...register(name, { valueAsNumber: true })}
                    className={inputClass}
                  />
                  {errors[name] && <p className={errorClass}>{errors[name]?.message}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Combat Stats */}
          <div className="space-y-3">
            <h4 className="text-xs text-(--color-text-muted) uppercase tracking-wider font-semibold">
              Combat Stats
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>HP Current</label>
                <input
                  type="number"
                  {...register('hp_current', { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.hp_current && <p className={errorClass}>{errors.hp_current.message}</p>}
              </div>
              <div>
                <label className={labelClass}>HP Max</label>
                <input
                  type="number"
                  {...register('hp_max', { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.hp_max && <p className={errorClass}>{errors.hp_max.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Armor Class</label>
                <input
                  type="number"
                  {...register('ac', { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.ac && <p className={errorClass}>{errors.ac.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Speed</label>
                <input
                  type="number"
                  {...register('speed', { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.speed && <p className={errorClass}>{errors.speed.message}</p>}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-(--color-accent-purple) hover:bg-(--color-accent-purple)/90 text-white"
          >
            {loading
              ? isEdit
                ? 'Saving...'
                : 'Creating...'
              : isEdit
                ? 'Save Changes'
                : 'Create Character'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
