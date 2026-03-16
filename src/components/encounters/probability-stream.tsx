'use client';

import type { Tables } from '@/types/database';
import type { EncounterFormData, EnemyEntry } from '@/lib/validations/encounter';
import { RpgCard } from '@/components/shared/rpg-card';

interface ProbabilityStreamProps {
  encounterData: EncounterFormData | null;
  partyCharacters: Tables<'characters'>[];
}

interface WeaponData {
  name: string;
  damage_dice: string;
  modifier: number;
  ability: 'str' | 'dex';
}

function getProficiencyBonus(level: number): number {
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  return 6;
}

function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function getPlayerAttackBonus(character: Tables<'characters'>): number {
  const proficiency = getProficiencyBonus(character.level);
  const weapons = character.weapons as unknown as WeaponData[] | null;

  if (weapons && Array.isArray(weapons) && weapons.length > 0) {
    const best = weapons[0] as WeaponData | undefined;
    if (best) {
      const abilityScore =
        best.ability === 'dex' ? character.dexterity : character.strength;
      return getAbilityModifier(abilityScore) + proficiency;
    }
  }

  // Default: use higher of STR/DEX modifier + proficiency
  const strMod = getAbilityModifier(character.strength);
  const dexMod = getAbilityModifier(character.dexterity);
  return Math.max(strMod, dexMod) + proficiency;
}

function calcHitProbability(playerAtkBonus: number, enemyAC: number): number {
  const needed = enemyAC - playerAtkBonus;
  const prob = (21 - needed) / 20;
  return Math.min(0.95, Math.max(0.05, prob));
}

function getProbColor(prob: number): string {
  if (prob >= 0.6) return '--color-accent-green';
  if (prob >= 0.3) return '--color-accent-amber';
  return '--color-accent-red';
}

export function ProbabilityStream({
  encounterData,
  partyCharacters,
}: ProbabilityStreamProps) {
  if (!encounterData) {
    return (
      <RpgCard>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-(--color-text-muted)" />
          <h3 className="font-mono text-sm tracking-wider text-(--color-text-muted)">
            LIVE PROBABILITY STREAM
          </h3>
        </div>
        <p className="text-center text-(--color-text-muted) text-sm py-8">
          Click &ldquo;Generate Probability&rdquo; to analyze this encounter...
        </p>
      </RpgCard>
    );
  }

  if (partyCharacters.length === 0) {
    return (
      <RpgCard>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-(--color-accent-green) animate-pulse" />
          <h3 className="font-mono text-sm tracking-wider text-(--color-accent-green)">
            LIVE PROBABILITY STREAM
          </h3>
        </div>
        <p className="text-center text-(--color-text-muted) text-sm py-8">
          Waiting for player characters to be created...
        </p>
      </RpgCard>
    );
  }

  const enemies = encounterData.enemies as EnemyEntry[];

  const matchups = partyCharacters.flatMap((char) =>
    enemies.map((enemy) => {
      const atkBonus = getPlayerAttackBonus(char);
      const prob = calcHitProbability(atkBonus, enemy.ac);
      return { character: char, enemy, atkBonus, prob };
    }),
  );

  return (
    <RpgCard>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-(--color-accent-green) animate-pulse" />
        <h3 className="font-mono text-sm tracking-wider text-(--color-accent-green)">
          LIVE PROBABILITY STREAM
        </h3>
      </div>

      <div className="space-y-3">
        {matchups.map((m, i) => {
          const colorVar = getProbColor(m.prob);
          const pct = Math.round(m.prob * 100);
          return (
            <div
              key={i}
              className="border-l-4 rounded-r p-3 bg-(--color-surface-input)"
              style={{ borderLeftColor: `var(${colorVar})` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-(--color-text-primary)">
                  {m.character.name} vs {m.enemy.name}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[11px] uppercase tracking-wider text-(--color-text-muted)">
                  Success Chance
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: `var(${colorVar})` }}
                >
                  {pct}%
                </span>
              </div>
              <p className="font-mono text-xs text-(--color-text-muted) mb-2">
                1d20 + {m.atkBonus} vs AC {m.enemy.ac}
              </p>
              <div className="h-2 rounded-full bg-(--color-surface-elevated)">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: `var(${colorVar})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </RpgCard>
  );
}

export { calcHitProbability, getPlayerAttackBonus, getProficiencyBonus, getAbilityModifier };
