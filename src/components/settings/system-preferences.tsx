'use client';

import { useState } from 'react';
import { useRole } from '@/hooks/use-role';
import { Button } from '@/components/ui/button';

interface SystemPreferencesProps {
  currentRole: 'dm' | 'player';
}

export function SystemPreferences({ currentRole }: SystemPreferencesProps) {
  const [selectedRole, setSelectedRole] = useState<'dm' | 'player'>(currentRole);
  const { setRole } = useRole();

  const handleRoleChange = (role: 'dm' | 'player') => {
    setSelectedRole(role);
    setRole(role);
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-6">System Preferences</h2>

      <div className="space-y-4">
        <div>
          <label className="text-base text-white font-semibold mb-2 block">
            Default Role
          </label>
          <p className="text-white/60 text-sm mb-4">
            Choose which dashboard view loads by default
          </p>

          <div className="flex gap-2 bg-[#0f0f23] border border-white/10 rounded-lg p-1">
            {(['dm', 'player'] as const).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`flex-1 px-4 py-2 rounded font-semibold text-sm transition-all ${
                  selectedRole === role
                    ? 'bg-[#7c3aed] text-white'
                    : 'bg-transparent text-white/60 hover:text-white'
                }`}
              >
                {role === 'dm' ? 'DM' : 'Player'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
