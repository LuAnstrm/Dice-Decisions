'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/data-client/client';
import { useAuth } from '@/hooks/use-auth';
import type { Role } from '@/types';

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  isDM: boolean;
  isPlayer: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({
  children,
  initialRole = 'player',
}: {
  children: ReactNode;
  initialRole?: Role;
}) {
  const [role, setRoleState] = useState<Role>(initialRole);
  const { user } = useAuth();

  // Sync role to AppSchema when changed with proper error handling
  const setRole = (r: Role) => {
    // Always update local state first (optimistic update)
    setRoleState(r);

    // Sync to AppSchema in background
    if (user) {
      const dataClient = createClient() as any;
      (async () => {
        try {
          const { error } = await dataClient
            .from('profiles')
            .update({ preferred_role: r })
            .eq('id', user.id);

          if (error) {
            // Brief revert on error
            setRoleState(r === 'dm' ? 'player' : 'dm');
            console.error('Failed to update role preference:', error);
          }
        } catch (error) {
          // Handle any unexpected errors
          setRoleState(r === 'dm' ? 'player' : 'dm');
          console.error('Unexpected error updating role:', error);
        }
      })();
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isDM: role === 'dm',
        isPlayer: role === 'player',
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
