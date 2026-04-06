'use client';

import { useState } from 'react';
import type { Tables } from '@/types/schema';
import type { EnemyEntry } from '@/lib/validations/encounter';
import { Trash2, Plus, Users } from 'lucide-react';

interface EnemyTableProps {
  enemies: EnemyEntry[];
  onChange: (enemies: EnemyEntry[]) => void;
  npcs?: Tables<'npcs'>[];
}

const defaultEnemy: EnemyEntry = {
  name: '',
  hp: 10,
  ac: 10,
  attack_bonus: 2,
  damage_dice: '1d6',
};

export function EnemyTable({ enemies, onChange, npcs }: EnemyTableProps) {
  const [showNpcSelect, setShowNpcSelect] = useState(false);

  function updateEnemy(index: number, field: keyof EnemyEntry, value: string | number) {
    const updated = enemies.map((enemy, i) =>
      i === index ? { ...enemy, [field]: value } : enemy,
    );
    onChange(updated);
  }

  function removeEnemy(index: number) {
    onChange(enemies.filter((_, i) => i !== index));
  }

  function addEnemy() {
    onChange([...enemies, { ...defaultEnemy }]);
  }

  function pullFromNpc(npcId: string) {
    const npc = npcs?.find((n) => n.id === npcId);
    if (!npc) return;
    const entry: EnemyEntry = {
      name: npc.name,
      hp: npc.hp ?? 10,
      ac: npc.armor_class ?? 10,
      attack_bonus: npc.attack_bonus ?? 2,
      damage_dice: '1d6',
    };
    onChange([...enemies, entry]);
    setShowNpcSelect(false);
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-(--color-text-muted)">
              <th className="text-left pb-2 pr-2">Name</th>
              <th className="text-center pb-2 px-1">HP</th>
              <th className="text-center pb-2 px-1">AC</th>
              <th className="text-center pb-2 px-1">ATK</th>
              <th className="text-center pb-2 px-1">DMG</th>
              <th className="pb-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {enemies.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-(--color-text-muted) text-sm"
                >
                  No enemies added yet
                </td>
              </tr>
            ) : (
              enemies.map((enemy, index) => (
                <tr key={index} className="group">
                  <td className="pr-2 py-1">
                    <input
                      type="text"
                      value={enemy.name}
                      onChange={(e) => updateEnemy(index, 'name', e.target.value)}
                      placeholder="Enemy name"
                      className="bg-(--color-accent-purple)/10 text-(--color-accent-purple) border border-(--color-accent-purple)/30 rounded px-2 py-1 text-sm w-full min-w-[120px] placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-accent-purple)"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      value={enemy.hp}
                      onChange={(e) => updateEnemy(index, 'hp', parseInt(e.target.value) || 0)}
                      className="w-16 bg-(--color-surface-input) border border-(--color-border-default) rounded px-2 py-1 text-(--color-text-primary) text-center font-mono text-sm focus:outline-none focus:border-(--color-border-active)"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      value={enemy.ac}
                      onChange={(e) => updateEnemy(index, 'ac', parseInt(e.target.value) || 0)}
                      className="w-16 bg-(--color-surface-input) border border-(--color-border-default) rounded px-2 py-1 text-(--color-text-primary) text-center font-mono text-sm focus:outline-none focus:border-(--color-border-active)"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      value={enemy.attack_bonus}
                      onChange={(e) => updateEnemy(index, 'attack_bonus', parseInt(e.target.value) || 0)}
                      className="w-16 bg-(--color-surface-input) border border-(--color-border-default) rounded px-2 py-1 text-(--color-text-primary) text-center font-mono text-sm focus:outline-none focus:border-(--color-border-active)"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="text"
                      value={enemy.damage_dice}
                      onChange={(e) => updateEnemy(index, 'damage_dice', e.target.value)}
                      placeholder="1d6"
                      className="w-16 bg-(--color-surface-input) border border-(--color-border-default) rounded px-2 py-1 text-(--color-text-primary) text-center font-mono text-sm focus:outline-none focus:border-(--color-border-active)"
                    />
                  </td>
                  <td className="py-1 pl-1">
                    <button
                      type="button"
                      onClick={() => removeEnemy(index)}
                      className="p-1 text-(--color-text-muted) hover:text-(--color-accent-red) transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Remove enemy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addEnemy}
          className="flex items-center gap-1.5 text-sm font-medium text-(--color-accent-purple) hover:text-(--color-accent-purple)/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          ADD ENEMY
        </button>

        {npcs && npcs.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNpcSelect(!showNpcSelect)}
              className="flex items-center gap-1.5 text-sm font-medium text-(--color-accent-cyan) hover:text-(--color-accent-cyan)/80 transition-colors"
            >
              <Users className="w-4 h-4" />
              Pull from NPCs
            </button>
            {showNpcSelect && (
              <div className="absolute top-full left-0 mt-1 z-10 min-w-[200px] bg-(--color-surface-elevated) border border-(--color-border-default) rounded-card shadow-card p-1">
                {npcs.map((npc) => (
                  <button
                    key={npc.id}
                    type="button"
                    onClick={() => pullFromNpc(npc.id)}
                    className="w-full text-left px-3 py-2 text-sm text-(--color-text-primary) hover:bg-(--color-surface-input) rounded transition-colors"
                  >
                    {npc.name}
                    {npc.hp != null && (
                      <span className="ml-2 text-(--color-text-muted) text-xs">
                        HP:{npc.hp} AC:{npc.armor_class ?? '?'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
