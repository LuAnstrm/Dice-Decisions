'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Tables } from '@/types/schema';
import { createClient } from '@/lib/data-client/client';
import { createNPC, updateNPC } from '@/lib/queries/npcs';
import { npcSchema, NPC_ROLES, NPC_ROLE_LABELS, NPC_STATUSES, type NPCFormData } from '@/lib/validations/npc';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface NpcFormDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  npc?: Tables<'npcs'>;
  campaignId: string;
  onSuccess: () => void;
}

export function NpcFormDialog({
  open,
  onOpenChange,
  npc,
  campaignId,
  onSuccess,
}: NpcFormDialogProps) {
  const isEdit = !!npc;
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<NPCFormData>({
    resolver: zodResolver(npcSchema),
    defaultValues: npc
      ? {
          name: npc.name,
          race: npc.race ?? '',
          role: (npc.role as NPCFormData['role']) ?? 'quest_giver',
          description: npc.description ?? '',
          hp: npc.hp ?? undefined,
          ac: npc.armor_class ?? undefined,
          attack_bonus: npc.attack_bonus ?? undefined,
          notes: npc.notes ?? '',
          status: npc.status,
          is_visible_to_players: npc.is_visible_to_players,
        }
      : {
          name: '',
          race: '',
          role: 'quest_giver',
          description: '',
          notes: '',
          status: 'active',
          is_visible_to_players: true,
        },
  });

  const isVisible = watch('is_visible_to_players');

  const onSubmit = async (data: NPCFormData) => {
    setSubmitting(true);
    try {
      const dataClient = createClient();
      const payload = {
        campaign_id: campaignId,
        name: data.name,
        race: data.race || null,
        role: data.role,
        description: data.description || null,
        hp: data.hp ?? null,
        armor_class: data.ac ?? null,
        attack_bonus: data.attack_bonus ?? null,
        notes: data.notes || null,
        status: data.status,
        is_visible_to_players: data.is_visible_to_players,
      };

      if (isEdit && npc) {
        await updateNPC(dataClient, npc.id, payload);
      } else {
        await createNPC(dataClient, payload);
      }

      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('NPC form submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit NPC' : 'Create NPC'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
              Name *
            </label>
            <Input
              {...register('name')}
              placeholder="Character name"
              className="bg-(--color-surface-input) border-(--color-border-default)"
            />
            {errors.name && (
              <p className="text-xs text-(--color-accent-red) mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Race */}
          <div>
            <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
              Race
            </label>
            <Input
              {...register('race')}
              placeholder="e.g. Human, Elf, Dwarf"
              className="bg-(--color-surface-input) border-(--color-border-default)"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
              Role *
            </label>
            <select
              {...register('role')}
              className="h-8 w-full rounded-lg border border-(--color-border-default) bg-(--color-surface-input) px-2.5 py-1 text-sm text-(--color-text-primary) outline-none focus:border-(--color-accent-purple)"
            >
              {NPC_ROLES.map((role) => (
                <option key={role} value={role}>
                  {NPC_ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-xs text-(--color-accent-red) mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
              Description
            </label>
            <Textarea
              {...register('description')}
              placeholder="Brief description..."
              rows={2}
              className="bg-(--color-surface-input) border-(--color-border-default)"
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
                HP
              </label>
              <Input
                type="number"
                {...register('hp', { valueAsNumber: true })}
                placeholder="0"
                className="bg-(--color-surface-input) border-(--color-border-default)"
              />
              {errors.hp && (
                <p className="text-xs text-(--color-accent-red) mt-1">
                  {errors.hp.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
                AC
              </label>
              <Input
                type="number"
                {...register('ac', { valueAsNumber: true })}
                placeholder="0"
                className="bg-(--color-surface-input) border-(--color-border-default)"
              />
              {errors.ac && (
                <p className="text-xs text-(--color-accent-red) mt-1">
                  {errors.ac.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
                ATK
              </label>
              <Input
                type="number"
                {...register('attack_bonus', { valueAsNumber: true })}
                placeholder="0"
                className="bg-(--color-surface-input) border-(--color-border-default)"
              />
              {errors.attack_bonus && (
                <p className="text-xs text-(--color-accent-red) mt-1">
                  {errors.attack_bonus.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
              Notes <span className="text-(--color-accent-amber)">(DM Only)</span>
            </label>
            <Textarea
              {...register('notes')}
              placeholder="Secret DM notes..."
              rows={2}
              className="bg-(--color-surface-input) border-(--color-border-default)"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide mb-1 block">
              Status
            </label>
            <select
              {...register('status')}
              className="h-8 w-full rounded-lg border border-(--color-border-default) bg-(--color-surface-input) px-2.5 py-1 text-sm text-(--color-text-primary) outline-none focus:border-(--color-accent-purple)"
            >
              {NPC_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wide">
              Visible to Players
            </label>
            <Switch
              checked={isVisible}
              onCheckedChange={(checked: boolean) =>
                setValue('is_visible_to_players', checked)
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin mr-1" />}
              {isEdit ? 'Save Changes' : 'Create NPC'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
