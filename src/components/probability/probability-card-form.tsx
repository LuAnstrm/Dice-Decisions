'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RpgCard } from '@/components/shared/rpg-card';
import { PROBABILITY_DICE_TYPES } from '@/lib/probability/constants';
import { probabilityCardSchema } from '@/lib/validations/probability';
import type { DiceType } from '@/types/probability';

interface ProbabilityCardFormProps {
  onCalculate: (data: {
    actionName: string;
    diceType: DiceType;
    diceCount: number;
    modifier: number;
    targetDC: number;
  }) => void;
}

export function ProbabilityCardForm({ onCalculate }: ProbabilityCardFormProps) {
  const [actionName, setActionName] = useState('');
  const [diceType, setDiceType] = useState<DiceType>('d20');
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [targetDC, setTargetDC] = useState(15);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = probabilityCardSchema.safeParse({
      actionName,
      diceType,
      diceCount,
      modifier,
      targetDC,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    onCalculate(parsed.data);
  }

  return (
    <RpgCard variant="probability" className="relative overflow-hidden border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(15,17,25,0.96),rgba(10,10,16,0.98))]">
      <div className="absolute -right-8 top-0 h-28 w-28 rounded-full bg-[var(--color-glow)] blur-3xl" />

      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white/5">
            <Image src="/images/icons/fantasy/card-play.png" alt="" fill className="object-contain p-2.5 opacity-95" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-(--color-text-muted)">
              Action Composer
            </p>
            <h2 className="mt-1 text-xl font-semibold text-(--color-text-primary)">
              Create Probability Card
            </h2>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              Define the roll, modifier, and target to mint a ready-to-read outcome card.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-(--color-accent)/25 bg-(--color-accent)/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-(--color-text-secondary) md:flex">
          <Sparkles size={12} className="text-(--color-accent)" />
          Live Resolution
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
              Action Name
            </label>
            <Input
              value={actionName}
              onChange={(e) => {
                setActionName(e.target.value);
                if (errors.actionName) setErrors((prev) => ({ ...prev, actionName: '' }));
              }}
              placeholder="e.g., Sneak Attack"
              className="border-[var(--color-border)] bg-black/30 text-(--color-text-primary)"
            />
            {errors.actionName && (
              <p className="text-xs text-red-500 mt-1">{errors.actionName}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
              Dice
            </label>
            <Select value={diceType} onValueChange={(val) => setDiceType(val as DiceType)}>
              <SelectTrigger className="w-full border-[var(--color-border)] bg-black/30 text-(--color-text-primary)">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-[var(--color-border)] bg-(--color-bg-base) text-(--color-text-primary)">
                {PROBABILITY_DICE_TYPES.map((d) => (
                  <SelectItem key={d.type} value={d.type}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.diceType && (
              <p className="text-xs text-red-500 mt-1">{errors.diceType}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
              Count
            </label>
            <Input
              type="number"
              value={diceCount}
              onChange={(e) => {
                setDiceCount(parseInt(e.target.value) || 1);
                if (errors.diceCount) setErrors((prev) => ({ ...prev, diceCount: '' }));
              }}
              min={1}
              max={10}
              className="border-[var(--color-border)] bg-black/30 text-(--color-text-primary)"
            />
            {errors.diceCount && (
              <p className="text-xs text-red-500 mt-1">{errors.diceCount}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
              Modifier
            </label>
            <Input
              type="number"
              value={modifier}
              onChange={(e) => {
                setModifier(parseInt(e.target.value) || 0);
                if (errors.modifier) setErrors((prev) => ({ ...prev, modifier: '' }));
              }}
              min={-20}
              max={20}
              className="border-[var(--color-border)] bg-black/30 text-(--color-text-primary)"
            />
            {errors.modifier && (
              <p className="text-xs text-red-500 mt-1">{errors.modifier}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-(--color-text-muted)">
              Target DC
            </label>
            <Input
              type="number"
              value={targetDC}
              onChange={(e) => {
                setTargetDC(parseInt(e.target.value) || 1);
                if (errors.targetDC) setErrors((prev) => ({ ...prev, targetDC: '' }));
              }}
              min={1}
              max={40}
              className="border-[var(--color-border)] bg-black/30 text-(--color-text-primary)"
            />
            {errors.targetDC && (
              <p className="text-xs text-red-500 mt-1">{errors.targetDC}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="gap-2 rounded-full bg-(--color-accent) px-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)] hover:bg-(--color-accent)"
          >
            <Sparkles size={14} />
            Calculate
          </Button>
        </div>
      </form>
    </RpgCard>
  );
}
