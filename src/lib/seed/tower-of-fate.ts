// =============================================================
// Tower of Fate — Seed Data Definitions
// =============================================================
// All data for the pre-built demo campaign (Feature 3.10).
// Typed to match the Supabase schema defined in database.ts.

import type { Database } from '@/types/database';
import { resolveMapImage } from './sample-images';

type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
type NPCInsert = Database['public']['Tables']['npcs']['Insert'];
type EncounterInsert = Database['public']['Tables']['encounters']['Insert'];
type NoteInsert = Database['public']['Tables']['notes']['Insert'];
type BayesScenarioInsert = Database['public']['Tables']['bayes_scenarios']['Insert'];
type CampaignMapInsert = Database['public']['Tables']['campaign_maps']['Insert'];
type MapMarkerInsert = Database['public']['Tables']['map_markers']['Insert'];
type CharacterInsert = Database['public']['Tables']['characters']['Insert'];

// Stable UUIDs for seed data — allows idempotent re-runs
export const SEED_IDS = {
  campaign: '10000000-0000-0000-0000-000000000001',
  npcs: {
    aldric: '20000000-0000-0000-0000-000000000001',
    morrigan: '20000000-0000-0000-0000-000000000002',
    henrick: '20000000-0000-0000-0000-000000000003',
    barlow: '20000000-0000-0000-0000-000000000004',
  },
  encounters: {
    goblinAmbush: '30000000-0000-0000-0000-000000000001',
    hallOfMirrors: '30000000-0000-0000-0000-000000000002',
    morriganGambit: '30000000-0000-0000-0000-000000000003',
  },
  notes: {
    session1: '40000000-0000-0000-0000-000000000001',
    lore: '40000000-0000-0000-0000-000000000002',
    session2: '40000000-0000-0000-0000-000000000003',
    dmPlanning: '40000000-0000-0000-0000-000000000004',
    codex: '40000000-0000-0000-0000-000000000005',
  },
  bayes: {
    chestTrapped: '50000000-0000-0000-0000-000000000001',
    morriganKnows: '50000000-0000-0000-0000-000000000002',
  },
  map: '60000000-0000-0000-0000-000000000001',
  markers: {
    goblinBridge: '70000000-0000-0000-0000-000000000001',
    aldricCamp: '70000000-0000-0000-0000-000000000002',
    trapCorridor: '70000000-0000-0000-0000-000000000003',
    barlowCart: '70000000-0000-0000-0000-000000000004',
    morriganSanctum: '70000000-0000-0000-0000-000000000005',
  },
  character: '80000000-0000-0000-0000-000000000001',
} as const;

/** Build the campaign record. dm_user_id is injected at seed time. */
export function buildCampaign(dmUserId: string): CampaignInsert {
  return {
    id: SEED_IDS.campaign,
    name: 'Tower of Fate',
    description:
      'An ancient tower rises from the mist, its secrets guarded by forgotten magic. Your party has been summoned to unravel the mystery of the Tower of Fate — a probabilities-driven adventure where every choice has a calculable outcome.',
    dm_user_id: dmUserId,
    is_template: true,
    status: 'active',
  };
}

/** Build all 4 NPCs linked to the Tower of Fate campaign. */
export function buildNPCs(): NPCInsert[] {
  const campaignId = SEED_IDS.campaign;
  return [
    {
      id: SEED_IDS.npcs.aldric,
      campaign_id: campaignId,
      name: 'Aldric the Sage',
      race: 'Human',
      role: 'quest_giver',
      description:
        'An elderly scholar who has spent decades studying the Tower. He hires the party to retrieve the Probability Codex — an ancient tome said to predict all possible futures. Soft-spoken but urgently motivated.',
      hp: 28,
      armor_class: 10,
      attack_bonus: 1,
      status: 'active',
      is_visible_to_players: true,
      notes:
        'Secret: Aldric is hiding that the Codex was originally his — he lost it to the Tower\'s guardian 30 years ago.',
    },
    {
      id: SEED_IDS.npcs.morrigan,
      campaign_id: campaignId,
      name: 'Morrigan the Witch',
      race: 'Half-Elf',
      role: 'villain',
      description:
        'Ancient sorceress of the marsh who has claimed the Tower\'s upper floors as her lair. She uses probability magic to manipulate dice and outcomes, making her an unpredictable enemy.',
      hp: 120,
      armor_class: 16,
      attack_bonus: 8,
      status: 'active',
      is_visible_to_players: false,
      notes:
        'Morrigan knows Bayes\' theorem intuitively — she updates her battle tactics based on observed player behavior.',
    },
    {
      id: SEED_IDS.npcs.henrick,
      campaign_id: campaignId,
      name: 'Guildmaster Henrick',
      race: 'Dwarf',
      role: 'quest_giver',
      description:
        'Leader of the Ironwood Guild, known for his fair but firm hand in merchant disputes. Offers the party supplies and information in exchange for clearing a goblin camp near the Tower.',
      hp: 85,
      armor_class: 14,
      attack_bonus: 4,
      status: 'active',
      is_visible_to_players: true,
    },
    {
      id: SEED_IDS.npcs.barlow,
      campaign_id: campaignId,
      name: 'Old Barlow',
      race: 'Halfling',
      role: 'merchant',
      description:
        'A grizzled traveling merchant with a cart full of potions and oddities. His prices seem suspiciously high — but is he lying about the rarity of his goods, or does he truly have the only healing potions for miles?',
      hp: 42,
      armor_class: 10,
      attack_bonus: 2,
      status: 'active',
      is_visible_to_players: true,
      notes: 'Perfect NPC for the \'Is the Merchant Lying?\' Bayes scenario.',
    },
  ];
}

/** Build all 3 encounters linked to the Tower of Fate campaign. */
export function buildEncounters(): EncounterInsert[] {
  const campaignId = SEED_IDS.campaign;
  return [
    {
      id: SEED_IDS.encounters.goblinAmbush,
      campaign_id: campaignId,
      name: 'Goblin Ambush at the Bridge',
      description:
        'The party reaches the old stone bridge over the Whispering Gorge. Three goblins hide behind the crumbling pillars, waiting to ambush anyone who crosses.',
      difficulty_class: 14,
      status: 'planned',
      enemies: [
        { name: 'Goblin Scout', hp: 7, ac: 15, atk: '+4', dmg: '1d6+2' },
        { name: 'Goblin Archer', hp: 5, ac: 13, atk: '+4', dmg: '1d6+2' },
        { name: 'Goblin Boss', hp: 21, ac: 17, atk: '+5', dmg: '2d6+3' },
      ],
    },
    {
      id: SEED_IDS.encounters.hallOfMirrors,
      campaign_id: campaignId,
      name: 'The Hall of Mirrors',
      description:
        'A circular chamber filled with enchanted mirrors that reflect distorted versions of the party. Each mirror has a 30% chance of spawning a shadow clone when touched.',
      difficulty_class: 12,
      status: 'planned',
      enemies: [
        { name: 'Shadow Clone', hp: 15, ac: 12, atk: '+3', dmg: '1d8' },
        { name: 'Shadow Clone', hp: 15, ac: 12, atk: '+3', dmg: '1d8' },
      ],
    },
    {
      id: SEED_IDS.encounters.morriganGambit,
      campaign_id: campaignId,
      name: "Morrigan's Probability Gambit",
      description:
        "The final confrontation. Morrigan challenges the party to a game of wits — she'll manipulate the odds unless the party can outsmart her using Bayesian reasoning.",
      difficulty_class: 18,
      status: 'planned',
      enemies: [
        { name: 'Morrigan the Witch', hp: 120, ac: 16, atk: '+8', dmg: '2d10+4' },
        { name: 'Fate Golem', hp: 50, ac: 14, atk: '+6', dmg: '1d12+3' },
      ],
    },
  ];
}

/** Build all 5 story notes. author_id is injected at seed time. */
export function buildNotes(authorId: string): NoteInsert[] {
  const campaignId = SEED_IDS.campaign;
  return [
    {
      id: SEED_IDS.notes.session1,
      campaign_id: campaignId,
      author_id: authorId,
      title: 'Session 1 — The Call to Adventure',
      tag: 'session_log',
      is_visible_to_players: true,
      session_number: 1,
      content: `<h2>The Call to Adventure</h2>
<p>The party gathers at the crossroads south of the Ironwood Forest. A weathered scholar named Aldric approaches them with an urgent plea — the <strong>Probability Codex</strong>, an ancient tome capable of predicting all possible futures, has been lost within the Tower of Fate.</p>
<blockquote><p>"The Tower doesn't care about your strength or your magic. It cares about probability. Every choice is a bet — and the Tower always knows the odds."</p></blockquote>
<p>Aldric offers 500 gold pieces for the Codex's safe return. The party accepts, and sets out along the northern road toward the Tower.</p>
<ul>
<li>Party rolled well on initial Perception checks — spotted goblin tracks near the bridge</li>
<li>Thorin bought 3 healing potions from Old Barlow (suspiciously expensive)</li>
<li>Next session: the bridge crossing and potential goblin ambush</li>
</ul>`,
    },
    {
      id: SEED_IDS.notes.lore,
      campaign_id: campaignId,
      author_id: authorId,
      title: 'The Tower of Fate — Lore',
      tag: 'world_lore',
      is_visible_to_players: true,
      content: `<h2>The Tower of Fate</h2>
<p>Built centuries ago by the <strong>Order of the Calculated Hand</strong>, the Tower of Fate was designed as the ultimate test of decision-making. Its architects were probability mages — scholars who believed that all of reality could be expressed as probability distributions.</p>
<p>The Tower doesn't use traditional traps or monsters as its primary defense. Instead, it <em>manipulates chance itself</em>. Doors may or may not open based on hidden probability thresholds. Treasure chests have calculable trap rates. Even the Tower's guardian, Morrigan the Witch, fights by updating her tactics based on observed player behavior — a living application of Bayes' theorem.</p>
<p>At the Tower's peak lies the <strong>Probability Codex</strong> — a book that shows all possible outcomes of any action as probability distributions. Whoever possesses it can make perfectly informed decisions, turning uncertainty into certainty.</p>`,
    },
    {
      id: SEED_IDS.notes.session2,
      campaign_id: campaignId,
      author_id: authorId,
      title: 'Session 2 — The Goblin Bridge',
      tag: 'session_log',
      is_visible_to_players: true,
      session_number: 2,
      content: `<h2>The Goblin Bridge</h2>
<p>The party reached the old stone bridge over the Whispering Gorge. Thorin's Perception check (rolled 16 vs DC 14) revealed three goblins hiding behind the crumbling pillars.</p>
<p>Combat highlights:</p>
<ul>
<li>The Goblin Boss had a 65% chance to hit Thorin's AC 16 — and missed twice in a row (probability: 12.25%). Unlucky.</li>
<li>Thorin's Battleaxe dealt 11 damage to the Goblin Scout, downing it in one hit.</li>
<li>The Goblin Archer's arrows had a 40% hit rate against the party — exactly matching the expected probability over 5 shots (2 hits).</li>
</ul>
<p>The party cleared the bridge and found a locked chest on the other side. <strong>Is it trapped?</strong> Time for some Bayesian analysis...</p>`,
    },
    {
      id: SEED_IDS.notes.dmPlanning,
      campaign_id: campaignId,
      author_id: authorId,
      title: 'DM Planning Notes',
      tag: 'dm_secret',
      is_visible_to_players: false,
      content: `<h2>DM Eyes Only — Campaign Planning</h2>
<p><strong>Morrigan's Weakness:</strong> She can be defeated by applying Bayes' theorem to predict her attack pattern. She always opens with her highest-damage spell (2d10+4), then alternates based on what the party resists. If the party tracks her pattern for 3 rounds, they can predict her next move with 85% accuracy.</p>
<h3>Loot Table — Tower of Fate</h3>
<ul>
<li>Level 1 (Goblin Bridge): 50 gold, 2 healing potions, Goblin Boss's shortbow (+1)</li>
<li>Level 2 (Hall of Mirrors): Cloak of Shadows (advantage on Stealth), 100 gold</li>
<li>Level 3 (Morrigan's Sanctum): The Probability Codex, 500 gold, Morrigan's Staff of Chance (+2 to spell attack rolls, can reroll one d20 per day)</li>
</ul>
<h3>Endgame Twist</h3>
<p>When the party retrieves the Codex, Aldric reveals it was originally <em>his</em>. He was the Tower's previous challenger 30 years ago — and he <strong>failed</strong>. Morrigan was his adventuring companion who was corrupted by the Tower's magic. The party must decide: return the Codex to Aldric (who may be corrupted too), or destroy it.</p>`,
    },
    {
      id: SEED_IDS.notes.codex,
      campaign_id: campaignId,
      author_id: authorId,
      title: 'The Probability Codex',
      tag: 'plot',
      is_visible_to_players: true,
      content: `<h2>The Probability Codex</h2>
<p>The Probability Codex is an ancient artifact created by the Order of the Calculated Hand. It appears as a thick, leather-bound tome with pages that shimmer between states — text appearing and disappearing as probabilities shift.</p>
<p><strong>What it does:</strong> When opened, the Codex shows all possible outcomes of any action as probability distributions. A warrior considering whether to attack sees every possible damage roll and its likelihood. A thief evaluating a locked door sees the probability of picking it successfully vs. triggering a trap.</p>
<p><em>The Codex doesn't predict the future — it quantifies uncertainty.</em> The difference is crucial. It won't tell you what <strong>will</strong> happen, but it will tell you what <strong>could</strong> happen and how likely each outcome is.</p>
<p>Aldric believes the Codex is the key to mastering the Tower. But possessing it may come at a cost — the Tower's magic is intertwined with the book, and removing it could collapse the Tower entirely.</p>`,
    },
  ];
}

/** Build 2 campaign-specific Bayes scenarios. */
export function buildBayesScenarios(): BayesScenarioInsert[] {
  const campaignId = SEED_IDS.campaign;
  return [
    {
      id: SEED_IDS.bayes.chestTrapped,
      campaign_id: campaignId,
      title: 'Is This Chest Trapped?',
      description:
        'You found a locked chest after the goblin encounter. In the Tower of Fate, 30% of chests are trapped. Your rogue\'s Perception check noticed scratch marks around the lock (evidence). If the chest IS trapped, there\'s a 60% chance of seeing scratch marks. If it\'s NOT trapped, there\'s only a 10% chance of scratch marks (from normal wear). Update your belief.',
      prior_probability: 0.3,
      likelihood: 0.6,
      marginal_false: 0.1,
      is_template: false,
    },
    {
      id: SEED_IDS.bayes.morriganKnows,
      campaign_id: campaignId,
      title: "Does Morrigan Know We're Coming?",
      description:
        "As you approach the upper levels, you notice armed sentinels at the corridor entrance. Update your belief about whether Morrigan has been warned. Prior: 50-50 chance she's aware. If she knows, 85% chance her minions are posted at the entrance. Even if she doesn't know, 20% chance there are guards by default.",
      prior_probability: 0.5,
      likelihood: 0.85,
      marginal_false: 0.2,
      is_template: false,
    },
  ];
}

/** Build the demo map record. */
export function buildMap(): CampaignMapInsert {
  return {
    id: SEED_IDS.map,
    campaign_id: SEED_IDS.campaign,
    name: 'Tower of Fate — Level 1',
    image_url: resolveMapImage(),
    sort_order: 0,
  };
}

/** Build all 5 map markers. */
export function buildMapMarkers(): MapMarkerInsert[] {
  const mapId = SEED_IDS.map;
  return [
    {
      id: SEED_IDS.markers.goblinBridge,
      map_id: mapId,
      label: 'Goblin Bridge',
      icon_type: 'combat',
      pos_x: 0.25,
      pos_y: 0.35,
      is_visible_to_players: true,
      description: 'The old stone bridge — site of the goblin ambush. DC 14 Stealth to bypass.',
    },
    {
      id: SEED_IDS.markers.aldricCamp,
      map_id: mapId,
      label: "Aldric's Camp",
      icon_type: 'safe',
      pos_x: 0.1,
      pos_y: 0.8,
      is_visible_to_players: true,
      description: 'Where the party first met the sage. A safe resting point.',
    },
    {
      id: SEED_IDS.markers.trapCorridor,
      map_id: mapId,
      label: 'Trap Corridor',
      icon_type: 'danger',
      pos_x: 0.55,
      pos_y: 0.45,
      is_visible_to_players: false,
      description:
        'Hidden blade traps. DC 16 Perception to detect, DC 14 Thieves\' Tools to disarm.',
    },
    {
      id: SEED_IDS.markers.barlowCart,
      map_id: mapId,
      label: "Barlow's Cart",
      icon_type: 'shop',
      pos_x: 0.4,
      pos_y: 0.75,
      is_visible_to_players: true,
      description:
        "Old Barlow's traveling merchant cart. Healing potions, rope, and suspicious deals.",
    },
    {
      id: SEED_IDS.markers.morriganSanctum,
      map_id: mapId,
      label: "Morrigan's Sanctum",
      icon_type: 'quest',
      pos_x: 0.8,
      pos_y: 0.15,
      is_visible_to_players: false,
      description:
        'The final confrontation. Only revealed when the party reaches the upper floors.',
    },
  ];
}

/** Build the demo character "Thorin Ironforge". user_id is injected at seed time. */
export function buildDemoCharacter(userId: string): CharacterInsert {
  return {
    id: SEED_IDS.character,
    user_id: userId,
    campaign_id: SEED_IDS.campaign,
    name: 'Thorin Ironforge',
    race: 'Dwarf',
    char_class: 'Fighter',
    level: 5,
    strength: 16,
    dexterity: 14,
    constitution: 15,
    intelligence: 10,
    wisdom: 12,
    charisma: 8,
    hp_current: 28,
    hp_max: 32,
    armor_class: 16,
    speed: 25,
    weapons: [
      { name: 'Battleaxe', damage: '1d8+3', attack_bonus: '+6' },
      { name: 'Handaxe', damage: '1d6+3', attack_bonus: '+6' },
    ],
    abilities: [
      { name: 'Second Wind', recharge: '1/long rest', description: 'Regain 1d10+5 HP as a bonus action.' },
      { name: 'Action Surge', recharge: '1/short rest', description: 'Take one additional action on your turn.' },
    ],
    inventory: [
      { name: 'Healing Potion', quantity: 3 },
      { name: 'Silk Rope (50ft)', quantity: 1 },
      { name: 'Torch', quantity: 5 },
      { name: 'Rations', quantity: 3 },
    ],
    notes: 'Thorin seeks vengeance against the goblins who destroyed his home forge.',
  };
}
