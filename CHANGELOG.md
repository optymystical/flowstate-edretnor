# Changelog

## 0.5.1
- Round 1's gimmicks are automated (scripts/round1.mjs, which adjusts the projectile's HP change after the system posts the hit's damage):
  Wardwing's Flit and Ward 15 per turn, the Geode's shell (Limit 20 Physical / 7 other), the Heartstone's rune (rerolled each turn,
  wrong category ×0.25) and its 3 rounds, and Snapshot (gone at the end of its turn; the active character's damage doesn't count).
  The panel gains **Shots land** (3d10 per breaker shot still up, off the Lantern) and **Reveal** (the Veiled Wisp).
- Wardwing, Snapshot, the Geode and the Heartstone have linked tokens (their state lives on the actor; launching resets them).

## 0.5.0
- Round 1's projectiles (11 actors in *Round 1: Projectiles*): the ten launches plus the Lantern's breaker shot, each with the
  system's fixed dodge set to its value and its exact health, and a token in the pinned style (a neutral stone ring, since projectiles
  have no Archetype). Their biographies carry what stays by hand (Wardwing's Ward and Flit, the Geode's shell, the Heartstone's rune).
- **Round 1: Launch Panel** macro: launches each projectile into the flight lane (all 10 Hailshot pebbles, the Veiled Wisp hidden,
  breaker shots one at a time), records got it or missed, clears the lane and keeps the score against the rivals.
- Round 1 journal: a "Running it in Foundry" page.
- Needs Flow State 0.99.0 (fixed dodge).

## 0.4.2
- Conservatory lighting: only the Dawn wing is pitch black now. The Mistworks and the Cold Cellar have dim working light from the
  start (their puzzles need sight), each Seed Vault has a dim glow so a player can see their own plant, and the rotunda's emergency
  glow reaches the gear lockers. The facet macro still lights Dawn's sun-lamps and the Core's facets.

## 0.4.1
- Fixed: on the three round scenes the walls, doors, lights and regions sat up and left of the art (the scene padding shifted the
  canvas but not their coordinates). Scenes now have no padding.
- The crawl's fog is a little darker (70%).

## 0.4.0
- Scenes (4), rendered by the project's battlemap renderer (dev/maps/*.py): Round 1's field (contestant line, the 20–30 ft flight
  lane, launchers, stands), Round 2's 300 ft conveyor track (yard posts, wave pens with doors, Blackwell's mark), the Clockwork
  Conservatory (rotunda, five glass Seed Vaults, the four wings; walls and doors; starts dark, with each facet's lights hidden until
  lit) and the Edretnor crawl map (11×11 tiles, nothing secret drawn). Regions mark the rounds' key areas. Each scene links its journal.
- Journals (7): Start Here, the festival (Days 1–3), one per round, the crawl, and After the Escape (the audience, the wishes and the
  ten hooks). Written in Markdown (src/journal/md/), with links to the actors and tables.
- Macros (4) and their runtime code: **Edretnor Setup** (rolls the Conservatory's variants, generates a new crawl map, stocks the
  Day 1 market, writes it all to an "Edretnor: This Run" journal), **Market Morning**, **Conservatory: Light a Facet**, and the
  **Crawl Panel** (the map with fog and labels on the scene, the clock and phases, hourly refresh, circles activating and the Guard's
  culls, quick and full searches, heavy blockages, the convoy and civilians delivered). The crawl's rules are plain functions in
  scripts/crawl-rules.mjs.
- Roll tables carry a `flags.flowstate-edretnor.key` so the macros find them even if renamed.

## 0.3.0
- Roll tables (60). The crawl: a surface event, wilderness and search-find table per phase, each drawing its category's table for
  that phase automatically (each holds only the entries the phase allows), plus the loot tables and the Rare table. The festival:
  the Uncommon rack, the affix gems and the Round 1 twists. Round 3: the seven Conservatory variant tables.
- Results link the actors and the system's potions, Icons and affix gems (drag them from the chat card), and roll counts, shards and
  sub-rolls inline when drawn. Tables that can't repeat (the rack, the twists, the Seed Vault plants) draw without replacement.

## 0.2.0
- Actors (24): the 10 Round 2 opponents (locals, staff, King's Guard, Blackwell), the 10 crawl NPCs (Maw cell, Edretnor Guard, townsfolk, bandit, old soldier, wounded contestant) and the 4 Omens (Gloamhound rite-born and grown, Burgeon, Bloomrot).
- Gear links to the system catalog; Wonder trees and Icon Tenets are real so Modes and Tenets automate. Abilities the system doesn't have yet (Bestiary ancestries, natural attacks) are written in each biography.

## 0.1.1
- The first time a GM opens a world with the module enabled, it offers to open the Adventure's import window (asked once).
- `api.openImporter()` opens it again any time.

## 0.1.0
- Module skeleton: the Adventure pack with its folders and the Start Here journal.
- Importing the Adventure sets the world to Shards (100 starting purse), 45 stat points and Common Grade 3 starting gear.
- Tokens for every Round 2, crawl and Omen actor (assets/tokens).
