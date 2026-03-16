-- =============================================================
-- 001_initial_schema.sql
-- Dice & Decisions — Complete Database Schema
-- =============================================================
-- Creates all tables, enums, indexes, triggers, RLS policies,
-- and the storage bucket for the entire application.
-- Run this in Supabase Dashboard > SQL Editor.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. CUSTOM ENUMS
-- ─────────────────────────────────────────────────────────────

CREATE TYPE public.user_role AS ENUM ('dm', 'player');
CREATE TYPE public.theme_id AS ENUM ('fantasy', 'scifi', 'western', 'eldritch', 'steampunk');
CREATE TYPE public.campaign_status AS ENUM ('active', 'archived');
CREATE TYPE public.npc_status AS ENUM ('active', 'deceased', 'hidden');
CREATE TYPE public.encounter_status AS ENUM ('planned', 'active', 'completed');
CREATE TYPE public.note_tag AS ENUM ('session_log', 'world_lore', 'plot', 'dm_secret');
CREATE TYPE public.marker_icon_type AS ENUM ('combat', 'quest', 'shop', 'danger', 'safe');

-- ─────────────────────────────────────────────────────────────
-- 2. TABLES
-- ─────────────────────────────────────────────────────────────

-- 2a. profiles (extends auth.users)
CREATE TABLE public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  display_name text       NOT NULL DEFAULT 'Adventurer',
  preferred_role public.user_role DEFAULT 'player',
  selected_theme public.theme_id DEFAULT 'fantasy',
  avatar_url  text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 2b. campaigns
CREATE TABLE public.campaigns (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  description text,
  dm_user_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_template boolean     DEFAULT false,
  status      public.campaign_status DEFAULT 'active',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_campaigns_dm_user_id ON public.campaigns(dm_user_id);

-- 2c. characters
CREATE TABLE public.characters (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id  uuid        NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  name         text        NOT NULL,
  race         text        NOT NULL,
  char_class   text        NOT NULL,
  level        integer     DEFAULT 1  CHECK (level >= 1 AND level <= 20),
  strength     integer     DEFAULT 10 CHECK (strength >= 1 AND strength <= 30),
  dexterity    integer     DEFAULT 10 CHECK (dexterity >= 1 AND dexterity <= 30),
  constitution integer     DEFAULT 10 CHECK (constitution >= 1 AND constitution <= 30),
  intelligence integer     DEFAULT 10 CHECK (intelligence >= 1 AND intelligence <= 30),
  wisdom       integer     DEFAULT 10 CHECK (wisdom >= 1 AND wisdom <= 30),
  charisma     integer     DEFAULT 10 CHECK (charisma >= 1 AND charisma <= 30),
  hp_current   integer     NOT NULL,
  hp_max       integer     NOT NULL,
  armor_class  integer     NOT NULL,
  speed        integer     DEFAULT 30,
  weapons      jsonb       DEFAULT '[]'::jsonb,
  abilities    jsonb       DEFAULT '[]'::jsonb,
  inventory    jsonb       DEFAULT '[]'::jsonb,
  notes        text,
  created_at   timestamptz DEFAULT now()
);
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_characters_campaign_id ON public.characters(campaign_id);
ALTER TABLE public.characters ADD CONSTRAINT uq_characters_user_campaign UNIQUE (user_id, campaign_id);

-- 2d. npcs
CREATE TABLE public.npcs (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id           uuid        NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  name                  text        NOT NULL,
  race                  text,
  role                  text,
  description           text,
  hp                    integer,
  armor_class           integer,
  attack_bonus          integer,
  notes                 text,
  status                public.npc_status DEFAULT 'active',
  is_visible_to_players boolean     DEFAULT false,
  created_at            timestamptz DEFAULT now()
);
CREATE INDEX idx_npcs_campaign_id ON public.npcs(campaign_id);

-- 2e. encounters
CREATE TABLE public.encounters (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      uuid        NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  description      text,
  difficulty_class integer     CHECK (difficulty_class >= 1 AND difficulty_class <= 30),
  enemies          jsonb       DEFAULT '[]'::jsonb,
  status           public.encounter_status DEFAULT 'planned',
  created_at       timestamptz DEFAULT now()
);
CREATE INDEX idx_encounters_campaign_id ON public.encounters(campaign_id);
CREATE INDEX idx_encounters_status ON public.encounters(status);

-- 2f. notes
CREATE TABLE public.notes (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id           uuid        NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  author_id             uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title                 text        NOT NULL,
  content               text,
  tag                   public.note_tag NOT NULL,
  is_visible_to_players boolean     DEFAULT true,
  session_number        integer,
  created_at            timestamptz DEFAULT now()
);
CREATE INDEX idx_notes_campaign_id ON public.notes(campaign_id);
CREATE INDEX idx_notes_tag ON public.notes(tag);

-- 2g. bayes_scenarios
CREATE TABLE public.bayes_scenarios (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id       uuid        REFERENCES public.campaigns(id) ON DELETE CASCADE,
  title             text        NOT NULL,
  description       text,
  prior_probability float       CHECK (prior_probability >= 0 AND prior_probability <= 1),
  likelihood        float       CHECK (likelihood >= 0 AND likelihood <= 1),
  marginal_false    float       CHECK (marginal_false >= 0 AND marginal_false <= 1),
  is_template       boolean     DEFAULT false,
  created_at        timestamptz DEFAULT now()
);

-- 2h. campaign_maps
CREATE TABLE public.campaign_maps (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid        NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  image_url   text        NOT NULL,
  sort_order  integer     DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_campaign_maps_campaign_id ON public.campaign_maps(campaign_id);

-- 2i. map_markers
CREATE TABLE public.map_markers (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id                uuid        NOT NULL REFERENCES public.campaign_maps(id) ON DELETE CASCADE,
  label                 text        NOT NULL,
  description           text,
  icon_type             public.marker_icon_type NOT NULL,
  pos_x                 float       NOT NULL CHECK (pos_x >= 0 AND pos_x <= 1),
  pos_y                 float       NOT NULL CHECK (pos_y >= 0 AND pos_y <= 1),
  is_visible_to_players boolean     DEFAULT false,
  created_at            timestamptz DEFAULT now()
);
CREATE INDEX idx_map_markers_map_id ON public.map_markers(map_id);

-- ─────────────────────────────────────────────────────────────
-- 3. TRIGGER FUNCTIONS
-- ─────────────────────────────────────────────────────────────

-- 3a. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3b. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3c. Enforce dm_secret visibility
CREATE OR REPLACE FUNCTION public.enforce_dm_secret_visibility()
RETURNS trigger AS $$
BEGIN
  IF NEW.tag = 'dm_secret' THEN
    NEW.is_visible_to_players := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_dm_secret_visibility
  BEFORE INSERT OR UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.enforce_dm_secret_visibility();

-- ─────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.npcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bayes_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_markers ENABLE ROW LEVEL SECURITY;

-- 4a. profiles policies
CREATE POLICY "Users can read any profile"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4b. campaigns policies
CREATE POLICY "DMs can manage their campaigns"
  ON public.campaigns FOR ALL
  USING (dm_user_id = auth.uid())
  WITH CHECK (dm_user_id = auth.uid());

CREATE POLICY "Players can read campaigns they belong to"
  ON public.campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.campaign_id = campaigns.id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read template campaigns"
  ON public.campaigns FOR SELECT
  USING (is_template = true);

CREATE POLICY "Authenticated users can create campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = dm_user_id);

-- 4c. characters policies
CREATE POLICY "Users can manage their own characters"
  ON public.characters FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "DMs can read characters in their campaigns"
  ON public.characters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = characters.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  );

CREATE POLICY "DMs can update characters in their campaigns"
  ON public.characters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = characters.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  );

-- 4d. npcs policies
CREATE POLICY "DMs can manage NPCs in their campaigns"
  ON public.npcs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = npcs.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = npcs.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can read visible NPCs in their campaigns"
  ON public.npcs FOR SELECT
  USING (
    is_visible_to_players = true
    AND EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.campaign_id = npcs.campaign_id
        AND characters.user_id = auth.uid()
    )
  );

-- 4e. encounters policies
CREATE POLICY "DMs can manage encounters in their campaigns"
  ON public.encounters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = encounters.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = encounters.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can read encounters in their campaigns"
  ON public.encounters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.campaign_id = encounters.campaign_id
        AND characters.user_id = auth.uid()
    )
  );

-- 4f. notes policies
CREATE POLICY "DMs can manage all notes in their campaigns"
  ON public.notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = notes.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = notes.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can read visible notes in their campaigns"
  ON public.notes FOR SELECT
  USING (
    is_visible_to_players = true
    AND EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.campaign_id = notes.campaign_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Players can create notes in their campaigns"
  ON public.notes FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.campaign_id = notes.campaign_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update their own notes"
  ON public.notes FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete their own notes"
  ON public.notes FOR DELETE
  USING (author_id = auth.uid());

-- 4g. bayes_scenarios policies
CREATE POLICY "Anyone can read template scenarios"
  ON public.bayes_scenarios FOR SELECT
  USING (is_template = true);

CREATE POLICY "DMs can manage campaign-specific scenarios"
  ON public.bayes_scenarios FOR ALL
  USING (
    campaign_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = bayes_scenarios.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  )
  WITH CHECK (
    campaign_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = bayes_scenarios.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can read scenarios in their campaigns"
  ON public.bayes_scenarios FOR SELECT
  USING (
    campaign_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.campaign_id = bayes_scenarios.campaign_id
        AND characters.user_id = auth.uid()
    )
  );

-- 4h. campaign_maps policies
CREATE POLICY "DMs can manage maps in their campaigns"
  ON public.campaign_maps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = campaign_maps.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = campaign_maps.campaign_id
        AND campaigns.dm_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can read maps in their campaigns"
  ON public.campaign_maps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.campaign_id = campaign_maps.campaign_id
        AND characters.user_id = auth.uid()
    )
  );

-- 4i. map_markers policies
CREATE POLICY "DMs can manage markers on their campaign maps"
  ON public.map_markers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_maps
      JOIN public.campaigns ON campaigns.id = campaign_maps.campaign_id
      WHERE campaign_maps.id = map_markers.map_id
        AND campaigns.dm_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaign_maps
      JOIN public.campaigns ON campaigns.id = campaign_maps.campaign_id
      WHERE campaign_maps.id = map_markers.map_id
        AND campaigns.dm_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can read visible markers on maps in their campaigns"
  ON public.map_markers FOR SELECT
  USING (
    is_visible_to_players = true
    AND EXISTS (
      SELECT 1 FROM public.campaign_maps
      JOIN public.characters ON characters.campaign_id = campaign_maps.campaign_id
      WHERE campaign_maps.id = map_markers.map_id
        AND characters.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 5. STORAGE BUCKET
-- ─────────────────────────────────────────────────────────────
-- NOTE: Also configure in Supabase Dashboard > Storage:
--   Max file size: 5MB
--   Allowed MIME types: image/jpeg, image/png, image/webp

INSERT INTO storage.buckets (id, name, public)
VALUES ('maps', 'maps', true);

CREATE POLICY "Authenticated users can upload maps"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'maps' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can read map images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'maps');

CREATE POLICY "Users can delete their own map uploads"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'maps' AND auth.uid()::text = (storage.foldername(name))[1]);
