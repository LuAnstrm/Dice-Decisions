// =============================================================
// Database Types for Supabase
// =============================================================
// Manually written to match 001_initial_schema.sql.
// Regenerate with: npx supabase gen types typescript --project-id [id] > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          preferred_role: Database['public']['Enums']['user_role'];
          selected_theme: Database['public']['Enums']['theme_id'];
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          preferred_role?: Database['public']['Enums']['user_role'];
          selected_theme?: Database['public']['Enums']['theme_id'];
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          preferred_role?: Database['public']['Enums']['user_role'];
          selected_theme?: Database['public']['Enums']['theme_id'];
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          dm_user_id: string;
          is_template: boolean;
          status: Database['public']['Enums']['campaign_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          dm_user_id: string;
          is_template?: boolean;
          status?: Database['public']['Enums']['campaign_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          dm_user_id?: string;
          is_template?: boolean;
          status?: Database['public']['Enums']['campaign_status'];
          created_at?: string;
          updated_at?: string;
        };
      };
      characters: {
        Row: {
          id: string;
          user_id: string;
          campaign_id: string;
          name: string;
          race: string;
          char_class: string;
          level: number;
          strength: number;
          dexterity: number;
          constitution: number;
          intelligence: number;
          wisdom: number;
          charisma: number;
          hp_current: number;
          hp_max: number;
          armor_class: number;
          speed: number;
          weapons: Json;
          abilities: Json;
          inventory: Json;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          campaign_id: string;
          name: string;
          race: string;
          char_class: string;
          level?: number;
          strength?: number;
          dexterity?: number;
          constitution?: number;
          intelligence?: number;
          wisdom?: number;
          charisma?: number;
          hp_current: number;
          hp_max: number;
          armor_class: number;
          speed?: number;
          weapons?: Json;
          abilities?: Json;
          inventory?: Json;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          campaign_id?: string;
          name?: string;
          race?: string;
          char_class?: string;
          level?: number;
          strength?: number;
          dexterity?: number;
          constitution?: number;
          intelligence?: number;
          wisdom?: number;
          charisma?: number;
          hp_current?: number;
          hp_max?: number;
          armor_class?: number;
          speed?: number;
          weapons?: Json;
          abilities?: Json;
          inventory?: Json;
          notes?: string | null;
          created_at?: string;
        };
      };
      npcs: {
        Row: {
          id: string;
          campaign_id: string;
          name: string;
          race: string | null;
          role: string | null;
          description: string | null;
          hp: number | null;
          armor_class: number | null;
          attack_bonus: number | null;
          notes: string | null;
          status: Database['public']['Enums']['npc_status'];
          is_visible_to_players: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          name: string;
          race?: string | null;
          role?: string | null;
          description?: string | null;
          hp?: number | null;
          armor_class?: number | null;
          attack_bonus?: number | null;
          notes?: string | null;
          status?: Database['public']['Enums']['npc_status'];
          is_visible_to_players?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          name?: string;
          race?: string | null;
          role?: string | null;
          description?: string | null;
          hp?: number | null;
          armor_class?: number | null;
          attack_bonus?: number | null;
          notes?: string | null;
          status?: Database['public']['Enums']['npc_status'];
          is_visible_to_players?: boolean;
          created_at?: string;
        };
      };
      encounters: {
        Row: {
          id: string;
          campaign_id: string;
          name: string;
          description: string | null;
          difficulty_class: number | null;
          enemies: Json;
          status: Database['public']['Enums']['encounter_status'];
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          name: string;
          description?: string | null;
          difficulty_class?: number | null;
          enemies?: Json;
          status?: Database['public']['Enums']['encounter_status'];
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          name?: string;
          description?: string | null;
          difficulty_class?: number | null;
          enemies?: Json;
          status?: Database['public']['Enums']['encounter_status'];
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          campaign_id: string;
          author_id: string;
          title: string;
          content: string | null;
          tag: Database['public']['Enums']['note_tag'];
          is_visible_to_players: boolean;
          session_number: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          author_id: string;
          title: string;
          content?: string | null;
          tag: Database['public']['Enums']['note_tag'];
          is_visible_to_players?: boolean;
          session_number?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          author_id?: string;
          title?: string;
          content?: string | null;
          tag?: Database['public']['Enums']['note_tag'];
          is_visible_to_players?: boolean;
          session_number?: number | null;
          created_at?: string;
        };
      };
      player_notes: {
        Row: {
          id: string;
          campaign_id: string;
          author_id: string;
          title: string;
          content: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          author_id: string;
          title: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          author_id?: string;
          title?: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bayes_scenarios: {
        Row: {
          id: string;
          campaign_id: string | null;
          title: string;
          description: string | null;
          prior_probability: number | null;
          likelihood: number | null;
          marginal_false: number | null;
          is_template: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id?: string | null;
          title: string;
          description?: string | null;
          prior_probability?: number | null;
          likelihood?: number | null;
          marginal_false?: number | null;
          is_template?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string | null;
          title?: string;
          description?: string | null;
          prior_probability?: number | null;
          likelihood?: number | null;
          marginal_false?: number | null;
          is_template?: boolean;
          created_at?: string;
        };
      };
      campaign_maps: {
        Row: {
          id: string;
          campaign_id: string;
          name: string;
          image_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          name: string;
          image_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          name?: string;
          image_url?: string;
          sort_order?: number;
          created_at?: string;
        };
      };
      map_markers: {
        Row: {
          id: string;
          map_id: string;
          label: string;
          description: string | null;
          icon_type: Database['public']['Enums']['marker_icon_type'];
          pos_x: number;
          pos_y: number;
          is_visible_to_players: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          map_id: string;
          label: string;
          description?: string | null;
          icon_type: Database['public']['Enums']['marker_icon_type'];
          pos_x: number;
          pos_y: number;
          is_visible_to_players?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          map_id?: string;
          label?: string;
          description?: string | null;
          icon_type?: Database['public']['Enums']['marker_icon_type'];
          pos_x?: number;
          pos_y?: number;
          is_visible_to_players?: boolean;
          created_at?: string;
        };
      };
    };
    Enums: {
      user_role: 'dm' | 'player';
      theme_id: 'fantasy' | 'scifi' | 'western' | 'eldritch' | 'steampunk';
      campaign_status: 'active' | 'archived';
      npc_status: 'active' | 'deceased' | 'hidden';
      encounter_status: 'planned' | 'active' | 'completed';
      note_tag: 'session_log' | 'world_lore' | 'plot' | 'dm_secret';
      marker_icon_type: 'combat' | 'quest' | 'shop' | 'danger' | 'safe';
    };
  };
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Convenience aliases
export type Profile = Tables<'profiles'>;
export type Campaign = Tables<'campaigns'>;
export type Character = Tables<'characters'>;
export type NPC = Tables<'npcs'>;
export type Encounter = Tables<'encounters'>;
export type Note = Tables<'notes'>;
export type PlayerNote = Tables<'player_notes'>;
export type BayesScenario = Tables<'bayes_scenarios'>;
export type CampaignMap = Tables<'campaign_maps'>;
export type MapMarker = Tables<'map_markers'>;

// Enum aliases
export type UserRole = Enums<'user_role'>;
export type ThemeId = Enums<'theme_id'>;
export type CampaignStatus = Enums<'campaign_status'>;
export type NpcStatus = Enums<'npc_status'>;
export type EncounterStatus = Enums<'encounter_status'>;
export type NoteTag = Enums<'note_tag'>;
export type MarkerIconType = Enums<'marker_icon_type'>;
