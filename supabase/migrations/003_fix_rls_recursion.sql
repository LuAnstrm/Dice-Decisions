-- =============================================================
-- 003_fix_rls_recursion.sql
-- Fix infinite recursion in RLS policies between campaigns <-> characters
-- Root cause: campaigns policy queries characters, characters policy queries
-- campaigns → circular dependency at the PostgreSQL RLS evaluation level.
-- Fix: SECURITY DEFINER helper functions bypass RLS when doing cross-table checks.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. HELPER FUNCTIONS (SECURITY DEFINER = bypass RLS)
-- ─────────────────────────────────────────────────────────────

-- Check if the current user is the DM of a given campaign.
-- Used by: characters, npcs, encounters, notes, bayes_scenarios, campaign_maps, map_markers policies.
CREATE OR REPLACE FUNCTION public.auth_is_campaign_dm(p_campaign_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = p_campaign_id
      AND dm_user_id = auth.uid()
  )
$$;

-- Check if the current user has a character (is a player) in a given campaign.
-- Used by: campaigns, npcs, encounters, notes, bayes_scenarios, campaign_maps, map_markers policies.
CREATE OR REPLACE FUNCTION public.auth_is_campaign_member(p_campaign_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.characters
    WHERE campaign_id = p_campaign_id
      AND user_id = auth.uid()
  )
$$;

-- ─────────────────────────────────────────────────────────────
-- 2. DROP ALL POLICIES THAT CAUSE RECURSION
-- ─────────────────────────────────────────────────────────────

-- campaigns
DROP POLICY IF EXISTS "Players can read campaigns they belong to" ON public.campaigns;

-- characters
DROP POLICY IF EXISTS "DMs can read characters in their campaigns" ON public.characters;
DROP POLICY IF EXISTS "DMs can update characters in their campaigns" ON public.characters;

-- npcs
DROP POLICY IF EXISTS "DMs can manage NPCs in their campaigns" ON public.npcs;
DROP POLICY IF EXISTS "Players can read visible NPCs in their campaigns" ON public.npcs;

-- encounters
DROP POLICY IF EXISTS "DMs can manage encounters in their campaigns" ON public.encounters;
DROP POLICY IF EXISTS "Players can read encounters in their campaigns" ON public.encounters;

-- notes
DROP POLICY IF EXISTS "DMs can manage all notes in their campaigns" ON public.notes;
DROP POLICY IF EXISTS "Players can read visible notes in their campaigns" ON public.notes;
DROP POLICY IF EXISTS "Players can create notes in their campaigns" ON public.notes;

-- bayes_scenarios
DROP POLICY IF EXISTS "DMs can manage campaign-specific scenarios" ON public.bayes_scenarios;
DROP POLICY IF EXISTS "Players can read scenarios in their campaigns" ON public.bayes_scenarios;

-- campaign_maps
DROP POLICY IF EXISTS "DMs can manage maps in their campaigns" ON public.campaign_maps;
DROP POLICY IF EXISTS "Players can read maps in their campaigns" ON public.campaign_maps;

-- map_markers
DROP POLICY IF EXISTS "DMs can manage markers in their maps" ON public.map_markers;
DROP POLICY IF EXISTS "Players can read visible markers" ON public.map_markers;

-- ─────────────────────────────────────────────────────────────
-- 3. RECREATE POLICIES USING HELPER FUNCTIONS
-- ─────────────────────────────────────────────────────────────

-- campaigns
CREATE POLICY "Players can read campaigns they belong to"
  ON public.campaigns FOR SELECT
  USING (public.auth_is_campaign_member(id));

-- characters
CREATE POLICY "DMs can read characters in their campaigns"
  ON public.characters FOR SELECT
  USING (public.auth_is_campaign_dm(campaign_id));

CREATE POLICY "DMs can update characters in their campaigns"
  ON public.characters FOR UPDATE
  USING (public.auth_is_campaign_dm(campaign_id))
  WITH CHECK (public.auth_is_campaign_dm(campaign_id));

-- npcs
CREATE POLICY "DMs can manage NPCs in their campaigns"
  ON public.npcs FOR ALL
  USING (public.auth_is_campaign_dm(campaign_id))
  WITH CHECK (public.auth_is_campaign_dm(campaign_id));

CREATE POLICY "Players can read visible NPCs in their campaigns"
  ON public.npcs FOR SELECT
  USING (
    is_visible_to_players = true
    AND public.auth_is_campaign_member(campaign_id)
  );

-- encounters
CREATE POLICY "DMs can manage encounters in their campaigns"
  ON public.encounters FOR ALL
  USING (public.auth_is_campaign_dm(campaign_id))
  WITH CHECK (public.auth_is_campaign_dm(campaign_id));

CREATE POLICY "Players can read encounters in their campaigns"
  ON public.encounters FOR SELECT
  USING (public.auth_is_campaign_member(campaign_id));

-- notes
CREATE POLICY "DMs can manage all notes in their campaigns"
  ON public.notes FOR ALL
  USING (public.auth_is_campaign_dm(campaign_id))
  WITH CHECK (public.auth_is_campaign_dm(campaign_id));

CREATE POLICY "Players can read visible notes in their campaigns"
  ON public.notes FOR SELECT
  USING (
    is_visible_to_players = true
    AND public.auth_is_campaign_member(campaign_id)
  );

CREATE POLICY "Players can create notes in their campaigns"
  ON public.notes FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND public.auth_is_campaign_member(campaign_id)
  );

-- bayes_scenarios
CREATE POLICY "DMs can manage campaign-specific scenarios"
  ON public.bayes_scenarios FOR ALL
  USING (
    campaign_id IS NOT NULL
    AND public.auth_is_campaign_dm(campaign_id)
  )
  WITH CHECK (
    campaign_id IS NOT NULL
    AND public.auth_is_campaign_dm(campaign_id)
  );

CREATE POLICY "Players can read scenarios in their campaigns"
  ON public.bayes_scenarios FOR SELECT
  USING (
    campaign_id IS NOT NULL
    AND public.auth_is_campaign_member(campaign_id)
  );

-- campaign_maps
CREATE POLICY "DMs can manage maps in their campaigns"
  ON public.campaign_maps FOR ALL
  USING (public.auth_is_campaign_dm(campaign_id))
  WITH CHECK (public.auth_is_campaign_dm(campaign_id));

CREATE POLICY "Players can read maps in their campaigns"
  ON public.campaign_maps FOR SELECT
  USING (public.auth_is_campaign_member(campaign_id));

-- map_markers (joins via campaign_maps — use a subquery to get campaign_id)
CREATE POLICY "DMs can manage markers in their maps"
  ON public.map_markers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_maps
      WHERE campaign_maps.id = map_markers.map_id
        AND public.auth_is_campaign_dm(campaign_maps.campaign_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaign_maps
      WHERE campaign_maps.id = map_markers.map_id
        AND public.auth_is_campaign_dm(campaign_maps.campaign_id)
    )
  );

CREATE POLICY "Players can read visible markers"
  ON public.map_markers FOR SELECT
  USING (
    is_visible_to_players = true
    AND EXISTS (
      SELECT 1 FROM public.campaign_maps
      WHERE campaign_maps.id = map_markers.map_id
        AND public.auth_is_campaign_member(campaign_maps.campaign_id)
    )
  );
