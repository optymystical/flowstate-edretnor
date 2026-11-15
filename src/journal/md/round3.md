## Overview
**Theme: "Old Roots, New Branches."** This is a buried Elven conservatory under a glass dome, lit by magitech sun-lamps and run on crystal conduits. It's the festival's own idea made physical: old Elven horticulture kept alive by new industrial magic. Living things produce magic and crystal holds it, so the garden powers the machines and the machines keep the garden. Spirit Sense can see both.

**The spine.** The conservatory is dormant. Its heart, the **Lumen Core**, is a crystal column in a planter at the center of a rotunda with a sundial floor, and it has four dark facets: Dawn, Noon, Dusk and Night. To escape, the party runs the garden through one full day.
- Each wing lights one facet.
- The Core lights facets **only in order**. A wing finished early is stored and lights as soon as the facet before it does.
- Groups can work wings in parallel. Split them across voice channels.

**Running notes**
- **Time.** 2-hour cap, 1-hour expected. Pause the clock for breaks. In-game durations (1-minute and 10-minute actions) run as real timers.
- **Party.** 4–5 players. There is one Seed Vault per player.
- **Gear.** Characters start stripped of gear. Both gear lockers stand in the rotunda behind glass, so players can see their gear from the start.
  - **Locker A** (Foci, Icons/Forms, Affix gems) opens when the **Dawn** facet lights.
  - **Locker B** (weapons, armor, Shrouds, ammunition) opens when **Dusk** lights, before the fight.
- **Energy.** Always full, except during the frost purge (Dusk) and the Omen fight (Night). Both are tense scenes where energy runs as it does in combat.
- **Difficulties** use the standard table (Easy 5, Moderate 10, Hard 15, Very Hard 25), rolled on d15 by starting characters.
- **Clues.** Give each player only what their character perceives. Use separate voice channels.
- **Smashing out.** Allowed but slow. Everything breakable has listed Durability.
- **In Foundry:** the scene starts dark. Run **Conservatory: light a facet** each time a facet lights: it turns on that wing's lamps and the Core's facet light. The Setup macro rolls every variant below.

**Total estimate: about 60 minutes,** which lands on the halfway exit bracket. A sharp party working wings in parallel finishes in about 40 minutes and earns the early bracket.

## Variants
Roll before each run (the Setup macro does it, or draw the tables in *Round 3: The Conservatory*).

| Variant | Roll | Options |
|---|---|---|
| Seed Vault plants | d8 per vault, no repeats | See Seed Vaults |
| Fuse hiding spots | d6 | Which of the three fuses (Amber, Rose, Jade) is on the trellis, in the pond and in the bramble |
| Socket mapping | d3 | Set A: Amber→Root, Rose→Bloom, Jade→Leaf. Set B: Amber→Seed, Rose→Thorn, Jade→Dew. Set C: Amber→Leaf, Rose→Root, Jade→Bloom |
| Valve order | d3 | A: Owl, Heron, Bee, Wren, Moth. B: Bee, Moth, Owl, Heron, Wren. C: Heron, Wren, Moth, Owl, Bee |
| Living seed jar | d12 | The jar number holding the Moon Lily seed |
| Omen specimen | d2 | 1: @Actor[Burgeon] (Growth). 2: @Actor[Bloomrot] (Life) |
| Bloom condition | d3 | 1: darkness and silence. 2: darkness and the scent of rain (Noon misters on). 3: darkness and warmth (the Ember heaters on) |

## 0. Seed Vaults
**Split start. Estimate: fast 6 / slow 12 / 8 min.**

Each player wakes sealed in a glass germination vault (10×10 ft) around the rotunda. Each vault contains:
- a potted plant with a name tag
- a valve wheel with four settings: **Sun, Rain, Ember, Frost**
- a "Set" lever
- a brass speaking tube linking all the vaults

A plaque in the rotunda reads *"Give each sleeper what it lacks."* It's visible through the glass.
- **Opening the vaults:** they all open when every player has pulled Set with their valve on the setting their plant lacks.
- **Wrong set:** if any valve is wrong, sleep-dew mists every vault, causing a **2-minute real-time lockout**. No damage.
- **Why it can't be brute-forced:** there are 4^5 combinations, and each player sees only their own vault, so the vault has to be solved by talking.
- **Breaking out:** the glass is Hard, with 120 Durability. A freed player can run between vaults carrying information, but the other doors still need their valves set.

| d8 | Plant | Lacks | Tells (some need a check) |
|---|---|---|---|
| 1 | Sunpetal Creeper | Sun | Every leaf turns toward the vault's dead lamp. Faint citrus smell (Smell, Moderate). |
| 2 | Bog Lantern | Rain | Cracked dry soil, empty pitcher-cups, curled leaves (Sight, automatic). |
| 3 | Ember Fern | Ember | Frond tips blackened by frost. The soil near the dead heating coil is the only warm spot (touch). |
| 4 | Frostbell | Frost | Drooping, beaded with sweat. Sweet-rotten smell from overheating (Smell, Moderate). |
| 5 | Glass Orchid | Sun | Translucent petals clouded grey. It grows toward a pinhole of light at the tube (Spot, Moderate). |
| 6 | Drowned Reed | Rain | The tag reads "Mire," half scratched off. Roots crawl out of the pot toward the floor drain (Spot, Moderate). |
| 7 | Cinder Moss | Ember | Grows only on the coil side of the pot. Damp, chilled stone (touch). |
| 8 | Winter Mint | Frost | Leaf edges scorched brown. Strong mint (Smell, Easy). |

Two plants share each need, so players can't assume every vault needs something different.

## 1. The Rotunda
- **The Lumen Core:** a crystal column with four dark facets, standing in a planter on a sundial floor.
- **Wing doors:** brass doors to the East (Dawn), South (Noon) and West (Dusk) wings open once the vaults release. The **North gate** (Night) is sealed by a glyph until Dusk lights.
- **Gear lockers A and B:** glass-fronted, holding the party's gear.
- **The Steward's horn:** see The Steward.

## 2. Dawn: the Propagation House
**Estimate: 8 / 15 / 10 min.**

**The room.** A 60×40 ft glasshouse in **total darkness** (heavily obscured). Light sources:
- a hand-crank glow-lamp by the door: 10 ft of dim light for 1 minute per crank
- Heat's Flame (30 ft)
- Light Wonders
- Creation

**The board.** Near the door is a junction board with six sockets, each marked with a glyph: **Dew, Seed, Root, Thorn, Bloom, Leaf**. Three crystal fuses (**Amber, Rose, Jade**) are hidden in the room.
- **Finding the mapping:**
  - Each lamp bank has a colored lens and hangs over a flower bed marked with a matching glyph. In the dark, this needs light and a Spot (Moderate).
  - Spirit Sense traces the live conduit from each socket to its bed.
  - A fuse seated in any socket makes its conduit hum toward the bed it feeds. That's a medium sound, heard automatically with Primary Hearing within 100 ft.
- **Wrong socket:** a spark deals 1d12 heat, and that bed flickers the wrong color, which is also useful information.

**The three hiding spots** (which fuse is where comes from the variants):
- **Trellis.** 25 ft up a living wall.
  - *Climbing:* handholds count as difficult terrain, and the top 10 ft is slick, needing an Athletics check (Moderate). A fall applies falling Force.
  - *Other routes:* knock it down with Gravity's Force, Herald, or a thrown object; build a ladder with Creation (Make, 10 Body of wood); reach it with Mobility's Wall Run. The fuse is Hard crystal with 40 Durability and survives the fall.
- **Pond.** 10 ft deep, dark water, with harmless koi.
  - *Diving:* hold your breath (10 rounds) and search the bottom by touch. That's a Spot (Moderate), and each attempt takes 2 rounds.
  - *Other routes:* pull it up with Gravity's Force, Animation (liquid), Geomancy, or a Fabricated net. Freezing the surface does not help.
- **Bramble.** A living thornbush, 60 Durability.
  - *Reaching in:* costs 2d8 physical, unless the character succeeds on a Sleight-style careful reach (stealth check, Moderate).
  - *Other routes:* clear it with Death's Wither (it's alive), fire and Ignite, or cutting (improvised or unarmed attacks; Light unarmed is Weakened against objects).

**Done:** the sun-lamps blaze, the **Dawn facet** lights, and **Locker A** opens.

## 3. Noon: the Mistworks
**Estimate: 8 / 15 / 10 min.**

**The room.** A 40×40 ft brass pumphouse with a cold boiler, five valve pipes and a seized flywheel pump. **Goal:** make it rain under the dome by opening the valves in pressure order, then turning the pump.

**The flooded sump.** The valve cage sits 8 ft down at the bottom of a murky, flooded sump.
- **Diving:** hold your breath. The cage lock takes Infiltration's Pick (Moderate, with Disadvantage underwater) or bending the bars (Str check of 25, or Herald or Gravity's Force).
- **Draining:** turn the drain wheel on the far wall (rusted; Str check of 20). The sump drains in 1 real minute.

**The valves.** Five pipes, marked **Wren, Moth, Heron, Bee and Owl**. Open them from highest pressure to lowest.
- **Hearing:** each pipe hisses at a different pitch, but the boiler's rumble covers it, dropping Hearing one level. Each pipe needs a perception check (Moderate). Hearing's Discriminate ignores the rumble.
- **Sight:** each pipe has a fogged pressure gauge. A Spot (Hard) reads it, or wipe the glass clean with a cloth or Heat.
- **Wrong order:** water hammer. 2d8 heat to whoever is at the valve, and all valves reset.

**The flywheel.** Seized with rust.
- **Brute force:** a Str check of 25. Oil from the pumphouse can (a Spot, Easy, to find it) gives Advantage. Acid's Corrode on the rust drops the check to 15.
- **Force:** 60 or more turns it (Gravity's Force, Herald, Knockback).

**Done:** rain falls through the dome and the **Noon facet** lights.

## 4. Dusk: the Cold Cellar
**Estimate: 8 / 14 / 10 min.**

**The door.** Frozen shut: ice with 60 Durability. Heat damage against it is Strengthened. A Str check of 20 pries it open.

**The frost purge (tense scene).** Opening the door starts a frost purge lasting **5 real minutes**.
- **Each round inside the cellar:** 1d6 cold damage, and the loss of a tenth of max energy.
- **Leaving** the cellar is safe.
- **Ending it:** the purge is a frost glyph on a regulator at the far end, 40 ft away across a slick floor (rough terrain). Any of these works:
  - Arcanomancy's Strike: the glyph counts as a Spell with 30 health.
  - Pulling the regulator lever: Str check, Moderate.
  - Melting the three vent nozzles: 20 Durability each, Heat Strengthened.
  - Plugging the vents: Fabricate, Geomancy, Accretion.

**The seed puzzle.** An ice cabinet holds **12 seed jars**. One holds the living Moon Lily seed; the rest are dead lookalikes.
- **Spirit Sense:** only the living seed produces magic.
- **Life Wonders:** a Life Mode only takes on a living target.
- **Death's Wither** also only works on a living target, but it damages the seed (10 health).
- **Smell:** night-jasmine, a Smell check (Hard, because the cold dulls scent).
- **The frosted ledger:** cleared with heat, it narrows the choice to 3 jars.
- **The wrong seed** simply won't bloom in the finale.

**Done:** the purge stops and the regulator resets. The **Dusk facet** lights, **Locker B** opens, and **the North gate unseals**.

## 5. Night: the Specimen Garden
**The fight. Estimate: 10 / 20 / 15 min.**

**The room.** With Dusk lit, the dome falls to night (heavily obscured, with dim moon-lamps). Past the North gate lies a sunken garden with a **ward-circle**: a Mental sanctified zone powered by three moon-lamps, holding the organizers' **contained Omen specimen**: the @Actor[Burgeon] or the @Actor[Bloomrot], from the variants.

**The breakout.** Night dims the lamps, the circle weakens, and the Omen breaks out when the party enters. This is a tense scene. On first sight, everyone resists its Allure (Resolve).

**Two ways to win:**
- Defeat it.
- **Re-contain it:** re-light the three moon-lamps. Each takes 6 AP of work, or a Light Wonder, or a Heat Flame held to its lens. The circle reforms around the Omen.

**If it blooms or spores** (the end of its 4th turn): the organizers' wardens burn it out. Nobody is hurt, the Night wing seals for 10 real minutes, and the specimen wilts back to dormancy. Each Omen's biography has its tactics and the simulated odds.

## 6. Night Bloom
**The exit. Estimate: 5 / 10 / 7 min.**

**Planting.** Plant the living seed in the Core's planter. With all facets lit, it sprouts at once into a Moon Lily bud.

**Blooming.** The bud blooms only under its rolled condition: darkness plus silence, rain-scent, or warmth.
- **Darkness:** the rotunda lamps have a switch.
- **Silence:** everyone within 60 ft of the Core must make no sound louder than soft. Each character either Stealths (a stealth check, Easy), keeps still under Dark's Eclipse, or leaves the area. A failed check stalls the bloom for 1 real minute.

**The exit.** The bloom opens around the crystal **Lumen Key**, which opens the tunnel hatch behind the Core, leading up and out of the mound.

## The Steward
An Elven festival steward watches from a control booth and speaks through a brass horn in the rotunda. He's the in-world hint system.
- **Attitude:** neutral, so Persuade counter checks have Advantage.
- **Persuade:** one hint per success, given as a nudge, then a pointer, then the solution.
- **Deceive** ("someone's hurt!"): once, he opens one door or locker.
- **Intimidate** (Command T1): works, but sours his attitude.
- **Insight's Read Intent** (1 minute): he's nervous, and the projection crystal "keeps cutting out."
- **At about minute 40** (or whenever you start the attack), his horn crackles with distant screaming and goes silent. No more hints. The projection to the city center is gone. **The crawl's clock starts now.**

| Exit | When | Where the crawl starts |
|---|---|---|
| Early | before ~1h of room time | Phase 1 with plenty of time |
| Halfway | ~1h | Still Phase 1, about an hour left |
| Late | the door opens on its own at 2h | Phase 1 with about 40 minutes left |
