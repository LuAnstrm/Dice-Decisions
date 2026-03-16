-- =============================================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================================
-- INSTRUCTIONS:
-- 1. First, sign up a test account through the app UI at /signup
-- 2. Go to Supabase Dashboard > Authentication > Users
-- 3. Copy the UUID of your test user
-- 4. Replace 'YOUR_DM_USER_UUID' below with the actual UUID
-- 5. Run this file in Supabase Dashboard > SQL Editor
-- =============================================================

-- Replace this UUID with your test user's UUID from Supabase Auth:
-- YOUR_DM_USER_UUID

-- ═══════════════════════════════════════════════════════════════
-- SECTION 1: Original Test Campaign (The Lost Mines of Probability)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO campaigns (id, name, description, dm_user_id, status)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'The Lost Mines of Probability',
  'A starter campaign for testing. Features goblins who understand Bayesian inference.',
  'YOUR_DM_USER_UUID',
  'active'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO npcs (campaign_id, name, race, role, description, hp, armor_class, attack_bonus, status, is_visible_to_players)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Barthen the Merchant',
  'Human',
  'shopkeeper',
  'A friendly merchant who runs a general store in Phandalin.',
  15, 10, 0, 'active', true
) ON CONFLICT DO NOTHING;

INSERT INTO encounters (campaign_id, name, description, difficulty_class, enemies, status)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Goblin Ambush',
  'A band of goblins attacks on the road to Phandalin.',
  13,
  '[{"name": "Goblin", "hp": 7, "ac": 15, "count": 4}]'::jsonb,
  'planned'
) ON CONFLICT DO NOTHING;

INSERT INTO notes (campaign_id, author_id, title, content, tag, is_visible_to_players)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'YOUR_DM_USER_UUID',
  'Session 0 Notes',
  '<p>The party meets at the Stonehill Inn. Each player rolls for initiative on their backstory.</p>',
  'session_log',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO bayes_scenarios (campaign_id, title, description, prior_probability, likelihood, marginal_false, is_template)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Is the innkeeper secretly a cultist?',
  'The innkeeper has been seen leaving town at midnight. What is the probability they are part of the cult?',
  0.1, 0.8, 0.3, false
) ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- SECTION 2: Tower of Fate — Demo Campaign (Feature 3.10)
-- ═══════════════════════════════════════════════════════════════
-- This is the pre-built demo campaign that ships with the app.
-- It serves as both a tutorial and a showcase of all features.
-- The is_template flag marks it as read-only; users duplicate it.
-- ═══════════════════════════════════════════════════════════════

-- Campaign
INSERT INTO campaigns (id, name, description, dm_user_id, is_template, status)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Tower of Fate',
  'An ancient tower rises from the mist, its secrets guarded by forgotten magic. Your party has been summoned to unravel the mystery of the Tower of Fate — a probabilities-driven adventure where every choice has a calculable outcome.',
  'YOUR_DM_USER_UUID',
  true,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- ── NPCs (4) ───────────────────────────────────────────────────

INSERT INTO npcs (id, campaign_id, name, race, role, description, hp, armor_class, attack_bonus, status, is_visible_to_players, notes)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Aldric the Sage', 'Human', 'quest_giver',
    'An elderly scholar who has spent decades studying the Tower. He hires the party to retrieve the Probability Codex — an ancient tome said to predict all possible futures. Soft-spoken but urgently motivated.',
    28, 10, 1, 'active', true,
    'Secret: Aldric is hiding that the Codex was originally his — he lost it to the Tower''s guardian 30 years ago.'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Morrigan the Witch', 'Half-Elf', 'villain',
    'Ancient sorceress of the marsh who has claimed the Tower''s upper floors as her lair. She uses probability magic to manipulate dice and outcomes, making her an unpredictable enemy.',
    120, 16, 8, 'active', false,
    'Morrigan knows Bayes'' theorem intuitively — she updates her battle tactics based on observed player behavior.'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Guildmaster Henrick', 'Dwarf', 'quest_giver',
    'Leader of the Ironwood Guild, known for his fair but firm hand in merchant disputes. Offers the party supplies and information in exchange for clearing a goblin camp near the Tower.',
    85, 14, 4, 'active', true,
    NULL
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'Old Barlow', 'Halfling', 'merchant',
    'A grizzled traveling merchant with a cart full of potions and oddities. His prices seem suspiciously high — but is he lying about the rarity of his goods, or does he truly have the only healing potions for miles?',
    42, 10, 2, 'active', true,
    'Perfect NPC for the ''Is the Merchant Lying?'' Bayes scenario.'
  )
ON CONFLICT (id) DO NOTHING;

-- ── Encounters (3) ─────────────────────────────────────────────

INSERT INTO encounters (id, campaign_id, name, description, difficulty_class, enemies, status)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Goblin Ambush at the Bridge',
    'The party reaches the old stone bridge over the Whispering Gorge. Three goblins hide behind the crumbling pillars, waiting to ambush anyone who crosses.',
    14,
    '[{"name":"Goblin Scout","hp":7,"ac":15,"atk":"+4","dmg":"1d6+2"},{"name":"Goblin Archer","hp":5,"ac":13,"atk":"+4","dmg":"1d6+2"},{"name":"Goblin Boss","hp":21,"ac":17,"atk":"+5","dmg":"2d6+3"}]'::jsonb,
    'planned'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'The Hall of Mirrors',
    'A circular chamber filled with enchanted mirrors that reflect distorted versions of the party. Each mirror has a 30% chance of spawning a shadow clone when touched.',
    12,
    '[{"name":"Shadow Clone","hp":15,"ac":12,"atk":"+3","dmg":"1d8"},{"name":"Shadow Clone","hp":15,"ac":12,"atk":"+3","dmg":"1d8"}]'::jsonb,
    'planned'
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'Morrigan''s Probability Gambit',
    'The final confrontation. Morrigan challenges the party to a game of wits — she''ll manipulate the odds unless the party can outsmart her using Bayesian reasoning.',
    18,
    '[{"name":"Morrigan the Witch","hp":120,"ac":16,"atk":"+8","dmg":"2d10+4"},{"name":"Fate Golem","hp":50,"ac":14,"atk":"+6","dmg":"1d12+3"}]'::jsonb,
    'planned'
  )
ON CONFLICT (id) DO NOTHING;

-- ── Story Notes (5) ────────────────────────────────────────────

INSERT INTO notes (id, campaign_id, author_id, title, content, tag, is_visible_to_players, session_number)
VALUES
  (
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'YOUR_DM_USER_UUID',
    'Session 1 — The Call to Adventure',
    '<h2>The Call to Adventure</h2><p>The party gathers at the crossroads south of the Ironwood Forest. A weathered scholar named Aldric approaches them with an urgent plea — the <strong>Probability Codex</strong>, an ancient tome capable of predicting all possible futures, has been lost within the Tower of Fate.</p><blockquote><p>"The Tower doesn''t care about your strength or your magic. It cares about probability. Every choice is a bet — and the Tower always knows the odds."</p></blockquote><p>Aldric offers 500 gold pieces for the Codex''s safe return. The party accepts, and sets out along the northern road toward the Tower.</p><ul><li>Party rolled well on initial Perception checks — spotted goblin tracks near the bridge</li><li>Thorin bought 3 healing potions from Old Barlow (suspiciously expensive)</li><li>Next session: the bridge crossing and potential goblin ambush</li></ul>',
    'session_log', true, 1
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'YOUR_DM_USER_UUID',
    'The Tower of Fate — Lore',
    '<h2>The Tower of Fate</h2><p>Built centuries ago by the <strong>Order of the Calculated Hand</strong>, the Tower of Fate was designed as the ultimate test of decision-making. Its architects were probability mages — scholars who believed that all of reality could be expressed as probability distributions.</p><p>The Tower doesn''t use traditional traps or monsters as its primary defense. Instead, it <em>manipulates chance itself</em>. Doors may or may not open based on hidden probability thresholds. Treasure chests have calculable trap rates. Even the Tower''s guardian, Morrigan the Witch, fights by updating her tactics based on observed player behavior — a living application of Bayes'' theorem.</p><p>At the Tower''s peak lies the <strong>Probability Codex</strong> — a book that shows all possible outcomes of any action as probability distributions. Whoever possesses it can make perfectly informed decisions, turning uncertainty into certainty.</p>',
    'world_lore', true, NULL
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'YOUR_DM_USER_UUID',
    'Session 2 — The Goblin Bridge',
    '<h2>The Goblin Bridge</h2><p>The party reached the old stone bridge over the Whispering Gorge. Thorin''s Perception check (rolled 16 vs DC 14) revealed three goblins hiding behind the crumbling pillars.</p><p>Combat highlights:</p><ul><li>The Goblin Boss had a 65% chance to hit Thorin''s AC 16 — and missed twice in a row (probability: 12.25%). Unlucky.</li><li>Thorin''s Battleaxe dealt 11 damage to the Goblin Scout, downing it in one hit.</li><li>The Goblin Archer''s arrows had a 40% hit rate against the party — exactly matching the expected probability over 5 shots (2 hits).</li></ul><p>The party cleared the bridge and found a locked chest on the other side. <strong>Is it trapped?</strong> Time for some Bayesian analysis...</p>',
    'session_log', true, 2
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'YOUR_DM_USER_UUID',
    'DM Planning Notes',
    '<h2>DM Eyes Only — Campaign Planning</h2><p><strong>Morrigan''s Weakness:</strong> She can be defeated by applying Bayes'' theorem to predict her attack pattern. She always opens with her highest-damage spell (2d10+4), then alternates based on what the party resists. If the party tracks her pattern for 3 rounds, they can predict her next move with 85% accuracy.</p><h3>Loot Table — Tower of Fate</h3><ul><li>Level 1 (Goblin Bridge): 50 gold, 2 healing potions, Goblin Boss''s shortbow (+1)</li><li>Level 2 (Hall of Mirrors): Cloak of Shadows (advantage on Stealth), 100 gold</li><li>Level 3 (Morrigan''s Sanctum): The Probability Codex, 500 gold, Morrigan''s Staff of Chance (+2 to spell attack rolls, can reroll one d20 per day)</li></ul><h3>Endgame Twist</h3><p>When the party retrieves the Codex, Aldric reveals it was originally <em>his</em>. He was the Tower''s previous challenger 30 years ago — and he <strong>failed</strong>. Morrigan was his adventuring companion who was corrupted by the Tower''s magic. The party must decide: return the Codex to Aldric (who may be corrupted too), or destroy it.</p>',
    'dm_secret', false, NULL
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000001',
    'YOUR_DM_USER_UUID',
    'The Probability Codex',
    '<h2>The Probability Codex</h2><p>The Probability Codex is an ancient artifact created by the Order of the Calculated Hand. It appears as a thick, leather-bound tome with pages that shimmer between states — text appearing and disappearing as probabilities shift.</p><p><strong>What it does:</strong> When opened, the Codex shows all possible outcomes of any action as probability distributions. A warrior considering whether to attack sees every possible damage roll and its likelihood. A thief evaluating a locked door sees the probability of picking it successfully vs. triggering a trap.</p><p><em>The Codex doesn''t predict the future — it quantifies uncertainty.</em> The difference is crucial. It won''t tell you what <strong>will</strong> happen, but it will tell you what <strong>could</strong> happen and how likely each outcome is.</p><p>Aldric believes the Codex is the key to mastering the Tower. But possessing it may come at a cost — the Tower''s magic is intertwined with the book, and removing it could collapse the Tower entirely.</p>',
    'plot', true, NULL
  )
ON CONFLICT (id) DO NOTHING;

-- ── Bayes Scenarios (2 campaign-specific) ──────────────────────

INSERT INTO bayes_scenarios (id, campaign_id, title, description, prior_probability, likelihood, marginal_false, is_template)
VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Is This Chest Trapped?',
    'You found a locked chest after the goblin encounter. In the Tower of Fate, 30% of chests are trapped. Your rogue''s Perception check noticed scratch marks around the lock (evidence). If the chest IS trapped, there''s a 60% chance of seeing scratch marks. If it''s NOT trapped, there''s only a 10% chance of scratch marks (from normal wear). Update your belief.',
    0.30, 0.60, 0.10, false
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Does Morrigan Know We''re Coming?',
    'As you approach the upper levels, you notice armed sentinels at the corridor entrance. Update your belief about whether Morrigan has been warned. Prior: 50-50 chance she''s aware. If she knows, 85% chance her minions are posted at the entrance. Even if she doesn''t know, 20% chance there are guards by default.',
    0.50, 0.85, 0.20, false
  )
ON CONFLICT (id) DO NOTHING;

-- ── Campaign Map ───────────────────────────────────────────────

INSERT INTO campaign_maps (id, campaign_id, name, image_url, sort_order)
VALUES (
  '60000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Tower of Fate — Level 1',
  '/images/maps/tower-of-fate-level-1.jpg',
  0
) ON CONFLICT (id) DO NOTHING;

-- ── Map Markers (5) ────────────────────────────────────────────

INSERT INTO map_markers (id, map_id, label, icon_type, pos_x, pos_y, is_visible_to_players, description)
VALUES
  (
    '70000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000001',
    'Goblin Bridge', 'combat', 0.25, 0.35, true,
    'The old stone bridge — site of the goblin ambush. DC 14 Stealth to bypass.'
  ),
  (
    '70000000-0000-0000-0000-000000000002',
    '60000000-0000-0000-0000-000000000001',
    'Aldric''s Camp', 'safe', 0.10, 0.80, true,
    'Where the party first met the sage. A safe resting point.'
  ),
  (
    '70000000-0000-0000-0000-000000000003',
    '60000000-0000-0000-0000-000000000001',
    'Trap Corridor', 'danger', 0.55, 0.45, false,
    'Hidden blade traps. DC 16 Perception to detect, DC 14 Thieves'' Tools to disarm.'
  ),
  (
    '70000000-0000-0000-0000-000000000004',
    '60000000-0000-0000-0000-000000000001',
    'Barlow''s Cart', 'shop', 0.40, 0.75, true,
    'Old Barlow''s traveling merchant cart. Healing potions, rope, and suspicious deals.'
  ),
  (
    '70000000-0000-0000-0000-000000000005',
    '60000000-0000-0000-0000-000000000001',
    'Morrigan''s Sanctum', 'quest', 0.80, 0.15, false,
    'The final confrontation. Only revealed when the party reaches the upper floors.'
  )
ON CONFLICT (id) DO NOTHING;

-- ── Demo Character: Thorin Ironforge ───────────────────────────

INSERT INTO characters (id, user_id, campaign_id, name, race, char_class, level,
  strength, dexterity, constitution, intelligence, wisdom, charisma,
  hp_current, hp_max, armor_class, speed, weapons, abilities, inventory, notes)
VALUES (
  '80000000-0000-0000-0000-000000000001',
  'YOUR_DM_USER_UUID',
  '10000000-0000-0000-0000-000000000001',
  'Thorin Ironforge', 'Dwarf', 'Fighter', 5,
  16, 14, 15, 10, 12, 8,
  28, 32, 16, 25,
  '[{"name":"Battleaxe","damage":"1d8+3","attack_bonus":"+6"},{"name":"Handaxe","damage":"1d6+3","attack_bonus":"+6"}]'::jsonb,
  '[{"name":"Second Wind","recharge":"1/long rest","description":"Regain 1d10+5 HP as a bonus action."},{"name":"Action Surge","recharge":"1/short rest","description":"Take one additional action on your turn."}]'::jsonb,
  '[{"name":"Healing Potion","quantity":3},{"name":"Silk Rope (50ft)","quantity":1},{"name":"Torch","quantity":5},{"name":"Rations","quantity":3}]'::jsonb,
  'Thorin seeks vengeance against the goblins who destroyed his home forge.'
) ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- After running this seed, you should be able to:
-- 1. Log in with your test account
-- 2. See "The Lost Mines of Probability" campaign in the dashboard
-- 3. See "Tower of Fate" as a template campaign with all data
-- 4. NPCs: Aldric, Morrigan (DM only), Henrick, Barlow
-- 5. Encounters: Goblin Ambush, Hall of Mirrors, Morrigan's Gambit
-- 6. Notes: 5 notes (1 DM secret), Bayes scenarios, map with markers
-- 7. Character: Thorin Ironforge
-- ═══════════════════════════════════════════════════════════════
