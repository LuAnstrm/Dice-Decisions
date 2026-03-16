'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/database';

interface UseCampaignReturn {
  campaign: Tables<'campaigns'> | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Client-side hook to fetch and manage the active campaign for the current user.
 * Mirrors getActiveCampaign logic but runs on the client.
 */
export function useCampaign(): UseCampaignReturn {
  const [campaign, setCampaign] = useState<Tables<'campaigns'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchCampaign = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCampaign(null);
        setIsLoading(false);
        return;
      }

      // First, check if user is a DM
      const { data: dmCampaigns, error: dmError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('dm_user_id', user.id)
        .limit(1);

      if (dmError) throw dmError;
      if (dmCampaigns && dmCampaigns.length > 0) {
        setCampaign(dmCampaigns[0] as any);
        setIsLoading(false);
        return;
      }

      // If not a DM, check if user has a character in any campaign
      const { data: characterCampaigns, error: charError } = await supabase
        .from('characters')
        .select('campaign_id')
        .eq('user_id', user.id)
        .limit(1);

      if (charError) throw charError;
      if (!characterCampaigns || characterCampaigns.length === 0) {
        setCampaign(null);
        setIsLoading(false);
        return;
      }

      const campaignId = (characterCampaigns[0] as any)?.campaign_id;
      if (!campaignId) {
        setCampaign(null);
        setIsLoading(false);
        return;
      }

      // Get the campaign the character belongs to
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaignError) throw campaignError;
      setCampaign(campaignData as any);
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch campaign';
      setError(message);
      setCampaign(null);
      setIsLoading(false);
      console.error('useCampaign error:', err);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return {
    campaign,
    isLoading,
    error,
    refetch: fetchCampaign,
  };
}
