import type { Tables } from '@/types/database';
import { RpgCard } from '@/components/shared/rpg-card';
import { Swords } from 'lucide-react';

export interface WeaponEntry {
  name: string;
  damage_dice: string;
  modifier: number;
  ability: 'str' | 'dex';
}

interface WeaponsAttacksProps {
  character: Tables<'characters'>;
  onUpdate?: (weapons: WeaponEntry[]) => void;
}

function getProficiencyBonus(level: number): number {
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  return 6;
}

export function WeaponsAttacks({ character, onUpdate }: WeaponsAttacksProps) {
  const weapons = (character.weapons as unknown as WeaponEntry[]) || [];
  const prof = getProficiencyBonus(character.level);

  function getAbilityMod(ability: 'str' | 'dex'): number {
    const score = ability === 'str' ? character.strength : character.dexterity;
    return Math.floor((score - 10) / 2);
  }

  return (
    <RpgCard
      header={{
        title: 'WEAPONS & ATTACKS',
        icon:
          weapons.length < 2 && onUpdate ? (
            <button
              type="button"
              onClick={() => {
                onUpdate([
                  ...weapons,
                  { name: 'New Weapon', damage_dice: '1d6', modifier: 0, ability: 'str' },
                ]);
              }}
              className="text-(--color-accent-purple) hover:text-(--color-text-primary) transition-colors text-lg leading-none"
              title="Add weapon"
            >
              +
            </button>
          ) : undefined,
      }}
    >
      {weapons.length === 0 ? (
        <p className="text-sm text-(--color-text-muted)">No weapons equipped</p>
      ) : (
        <div className="space-y-3">
          {weapons.map((weapon, idx) => {
            const abilityMod = getAbilityMod(weapon.ability);
            const atkBonus = abilityMod + prof;
            const sign = atkBonus >= 0 ? '+' : '';

            return (
              <div key={idx} className="flex items-center gap-3">
                <Swords size={18} className="text-(--color-text-muted) shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-(--color-text-primary) text-sm truncate">
                    {weapon.name}
                  </p>
                  <p className="text-xs text-(--color-text-muted)">Slashing</p>
                </div>
                <span className="bg-(--color-accent-purple)/20 text-(--color-accent-purple) text-xs px-2 py-0.5 rounded shrink-0">
                  {sign}{atkBonus} ATK
                </span>
                <span className="text-sm font-mono text-(--color-text-secondary) shrink-0">
                  {weapon.damage_dice}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </RpgCard>
  );
}
