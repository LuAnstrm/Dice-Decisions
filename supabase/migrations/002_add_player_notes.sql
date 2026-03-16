-- Phase 3.2: Add Player Notes Table
-- File: supabase/migrations/002_add_player_notes.sql
-- Purpose: Create player_notes table for players to write personal campaign notes

-- ============================================================================
-- 1. player_notes Table
-- ============================================================================

CREATE TABLE public.player_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_player_notes_campaign_id ON public.player_notes(campaign_id);
CREATE INDEX idx_player_notes_author_id ON public.player_notes(author_id);
CREATE INDEX idx_player_notes_campaign_author ON public.player_notes(campaign_id, author_id);

-- ============================================================================
-- 2. Add updated_at Trigger for player_notes
-- ============================================================================

CREATE TRIGGER on_player_notes_updated_at
BEFORE UPDATE ON public.player_notes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 3. Enable RLS on player_notes
-- ============================================================================

ALTER TABLE public.player_notes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. Row Level Security Policies for player_notes
-- ============================================================================

-- Authors can select their own notes
CREATE POLICY "Players can read their own notes"
  ON public.player_notes FOR SELECT
  USING (author_id = auth.uid());

-- Authors can create notes in their campaign
CREATE POLICY "Players can create notes in their campaign"
  ON public.player_notes FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (SELECT 1 FROM characters WHERE characters.campaign_id = player_notes.campaign_id AND characters.user_id = auth.uid())
  );

-- Authors can update their own notes
CREATE POLICY "Players can update their own notes"
  ON public.player_notes FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Authors can delete their own notes
CREATE POLICY "Players can delete their own notes"
  ON public.player_notes FOR DELETE
  USING (author_id = auth.uid());

-- ============================================================================
-- Schema Update Complete
-- ============================================================================
