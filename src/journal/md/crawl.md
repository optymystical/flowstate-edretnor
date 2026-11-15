## How the crawl runs
- **The map** is 11×11: a rounded 9×9 city inside a ring of walls and wilderness.
- **Fixed tiles:**
  - the town square at the center, with Town Hall one tile north
  - four cisterns on the cardinal edges (the king is in one, chosen at random; one is empty and two hold other things)
  - a hidden barracks
  - the gathering zones
  - the wilderness Overlook
- **Moving:** entering a tile takes 10 minutes and reveals its surface event. A fight fits inside those 10 minutes; only the times listed below add more.
- **Searching:**
  - **Quick search (10 minutes):** everyone makes a Spot check and the party keeps the highest. The DC is 10, 11 or 12 by phase and drops by 2 after every attempt on that tile, down to 2. A success reveals one hidden find.
  - **Full search (1 hour, shorter with a convoy):** reveals every find.
  - **Hidden finds per tile:** 1–4 in Phase 1, 0–3 in Phase 2, 0–2 in Phase 3. At each phase change, a tile above the new cap loses one at random.
- **Hourly refresh:** at every in-game hour, any revealed random tile the party isn't on or next to goes back to unknown.
- **Blockages:**
  - **Light** (a random event): 10 minutes to clear, or 1 hour clearing it quietly.
  - **Heavy** (added only at a phase change): 1 hour, with a roll on the event table, or 4 hours clearing it quietly.

**Convoy bands:**

| Band | Civilians | Time to enter a tile | Full search |
|---|---|---|---|
| None or Small | 0–10 | 10 min | 60 min |
| Medium | 11–30 | 20 min | 40 min |
| Large | 31+ | 30 min | 20 min |

A Large band at the barracks can form a militia.

**Phases** (counting from when the attack begins, when the Steward goes silent):

| Phase | Hours | What's happening |
|---|---|---|
| 1 | 0–2 | Rites underway, no Heralds yet, guards still fighting |
| 2 | 2–6 | The Abyss falls and Heralds form. The king recalls the party at the end. |
| 3 | 6+ | The city is lost. One Royal Guard member is cleaning up. |

**Active gathering zones by hour:**

| Hour | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9+ |
|---|---|---|---|---|---|---|---|---|---|---|
| Active zones | 1 | 2 | 3 | 4 | 5 | 4 | 3 | 2 | 1 | 0 |

Each small circle destroyed lowers every later count by 1. Killing the Cell Master ends the attack, and the king grants a wish for it.


## Running it in Foundry
Everything the crawl tracks lives in the **Crawl Panel** (the *Edretnor: Crawl Panel* macro, GM only), on the *The Crawl: Edretnor* scene.

- **Setting up:** the *Edretnor Setup* macro generates a fresh city: it picks the king's cistern (and the empty and occupied ones), hides the barracks, places the Phase 1 gathering zone near the square and the four small circles, and rolls each tile's hidden finds. It also covers every city and wilderness tile with fog on the scene.
- **Starting the clock:** when the party leaves the Conservatory, press **Start the attack clock** and enter how many minutes of room time had passed when they got out. The attack began at minute 40, when the Steward went silent, so the panel starts the crawl clock at room time minus 40.
- **Moving:** click a tile on the panel's grid, then **Enter**. The clock advances by the convoy band's time, the fog lifts there, and fixed tiles show what they are; random tiles draw their surface event for the current phase (city or wilderness) into the chat, and the tile is labeled on the scene.
- **Searching:** **Quick search** shows the DC; roll the party's best Spot, then press **Found** or **Nothing**. A success draws one find from the current phase's tables (or reveals a small circle). **Full search** reveals every find on the tile at once, for the band's search time.
- **The clock:** every move and search advances it. On each hour the panel refreshes revealed random tiles away from the party, activates the next small circle into a gathering zone (and from hour 5 the Royal Guard culls one), and at hours 2 and 6 it changes phase: finds above the new cap are trimmed and heavy blockages are placed. Each change is whispered to you.
- **Convoy:** set the civilian count with the + and − buttons; the band follows. **Delivered** moves them to the king's count (which decides the second wish and the Elven path).
- **Circles and the head:** **Destroy circle** on a tile with a found circle; **Cell Master killed** ends the attack and fizzles every circle.

## Threats without statblocks
**Shared rules:**
- **Size 3.** HP = (Con + Will + Build) × 9. Pain Threshold (PT) = half of HP.
- **Background trees** unlock trees only. Unless listed, a Background is a trade with no combat effect.
- **NPC perception:** an NPC's Spot or perception check is d(its skill points). It contests a PC's stealth check (d15 for starting characters).
- **Group sizes:**
  - **Cell:** 1 Cell Leader and 4 Maw Cultists.
  - **Half a cell:** 1 Cell Leader and 2 Maw Cultists.
- **Fear:** resist with a Constitution, Willpower or Build stat check, needing at least the source's skill points × Size. While afraid, a creature gains no energy.


#### Herald (not statted)
Heralds are Stage 2, so treat one as a moving hazard. Its attention is an environmental rule, not a fight to win.
- **Sneaking past:** every PC makes a stealth check against DC 15 (Hard). Smoke, an Abyss pocket or fireworks give Advantage.
- **If anyone fails, it turns on the party.** Everyone must resist Fear (needing 60). Then at the start of each round the party is in its tile, it makes 3 attacks (d40 against dodge) at random party members, each dealing **8d12 Supernatural**.
- **Leaving** the tile takes the party's whole round.

#### Royal Guard cleanup member (not statted)
He wins every fight he's in, but the party can speed it up. Each round a party member helps meaningfully earns 1 favor, and 3 favor means he owes the party. He recognizes first-place winners from the tournament.

#### Forming Death Omen (an object)
A carrion-shape knitting itself together out of the dead.
- **Stats:** 60 Durability, 0 Limit.
- **Destroying it:** the party has 2 rounds.
- **If they don't:** it rises and lopes off. Nothing more happens for now; it's a foreshadow.

#### Small circle (a find)
- **Guarded by:** 1 Ritualist and half a cell.
- **Destroying it:** scrub the runes (20 minutes, or 10 with the Rune-cut bodies intel; not possible while the Ritualist stands in the circle), or break its anchor stone (60 Durability, 10 Limit).
- **Effect:** a destroyed circle never becomes a gathering zone.

#### Gathering zones
**Phase 1 central zone:**
- **Who's there:**
  - the Cell Master
  - 2 Ritualists
  - 4 cells (4 Cell Leaders and 16 Cultists) around the edges of the tile
  - 3 rite-born Gloamhounds
- **Approach:** each edge cell's leader makes perception contests. The hounds' Smell is the real problem; smoke or the wind (GM) takes it away.

**Active zones (from Phase 2):**
- **Who's there:** a Herald, 6–10 cells, 1 Ritualist and 5 Gloamhounds.
- **Warning:** don't fight it. It's telegraphed from adjacent tiles by chanting and a column of black flame.


## Rulings
- **PC death:** death in the crawl is permanent. The player makes a replacement character, who enters as another tournament contestant found in the city.
- **Convoy stealth (this scenario only, not a general rule):** a convoy can only sneak through once every PC has succeeded on their own stealth, clearing the path, and is directing the civilians. The convoy then makes one group stealth check on a d20: Advantage for a Small band, a straight roll for Medium, Disadvantage (or more) for Large. If any PC failed, the convoy can't sneak through.

## Loot and potions
**Potions:**
- **Health potions:** Lesser restores half the health a rest would; regular restores what a rest would; Greater restores twice that.
- **Energy potions:** Lesser grants half your max energy; regular grants your max energy; Greater grants twice your max energy. The energy goes into a separate pool that lasts up to a minute or until used, so it can take you over your cap.
- **Limit:** one potion per rest, shared between the two kinds.


**Goblin trader's stock** (he trades for an escort):
- 1 Health potion
- a Goblin import crate
- a tool chest
- lanterns and oil

The party picks two.

The find, event and loot tables are the roll tables in *The Crawl*; each phase has its own copy holding only what that phase allows.
