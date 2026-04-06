'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/data-client/client';
import type { Profile } from '@/types/schema';

interface User {
  id: string;
  email?: string;
}

export function useAuth() {
  const router = useRouter();
  const dataClient = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await dataClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data);
    },
    [dataClient],
  );

  useEffect(() => {
    const initialize = async () => {
      const {
        data: { user: currentUser },
      } = await dataClient.auth.getUser();

      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser.id);
      }
      setIsLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = dataClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          await fetchProfile(sessionUser.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [dataClient, fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await dataClient.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password. Please try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Please verify your email before signing in.' };
        }
        return { error: error.message };
      }

      router.refresh();
      return { error: null };
    },
    [dataClient, router],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
    ): Promise<{ error: string | null }> => {
      const { error } = await dataClient.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          return { error: 'An account with this email already exists.' };
        }
        return { error: error.message };
      }

      router.refresh();
      return { error: null };
    },
    [dataClient, router],
  );

  const signOut = useCallback(async () => {
    await dataClient.auth.signOut();
    router.push('/login');
    router.refresh();
  }, [dataClient, router]);

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      const { error } = await dataClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/callback',
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    },
    [dataClient],
  );

  return {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
