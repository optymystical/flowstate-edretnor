## How it works
- **The conveyor:** the party picks one of its own members as the protected ally. That character is fastened to a mechanical conveyor that moves them **20 ft every turn, guaranteed**. Their legs are bound but their hands are free. They can only affect themselves. **The organizers rule that Force can't move them off the track.**
- **Timing:** the conveyor reaches 20 yards (60 ft) every 3 turns, 80 yards at turn 12, and the full 300 ft at turn 15.
- **Scoring:** farthest distance wins, with damage taken as the tiebreaker. The best NPC teams reach 70–80 yards (rivals: the favorites 78, the Fire Walkers 72, the College apprentices 70, the Halflings 65). The party needs **79+ yards** for first.
- **Safety:** the Guard pulls punches, and Farrowin (Royal Guard, rank 3) has revival magic.

| Point | Arrives | Who |
|---|---|---|
| 0–20 yd | — | No enemies |
| 20 yd | Wave 1, turn 3 | Locals from the open casting call (paid) |
| 40 yd | Wave 2, turn 6 | Tournament staff, Common Grade 3 gear |
| 60 yd | Wave 3, turn 9 | King's Guard, Uncommon Grade 6 gear |
| 80 yd | Finale, turn 13 | **Blackwell** (Royal Guard, rank 4): one round of multiple Supernatural attacks. If the protected ally survives: "You're free to go then." |

## Running it in Foundry
Open the **Round 2: Conveyor Panel** macro (GM) on the *Round 2: The Protection Run* scene.

1. **Fasten the ally:** select the protected ally's token and click **Fasten to the conveyor**. It's placed at the 0-yard post. From now on only the conveyor moves it (Force can't; **Unfasten** if you need to move it yourself).
2. **Start combat** on this scene with the party. At the start of every round the conveyor carries the ally to 20 ft × the round, so 20 yards at round 3, 80 at round 12 and the end at round 15.
3. **The waves come out on their own:** Wave 1 on round 3, Wave 2 on round 6, Wave 3 on round 9 and Blackwell on round 13. Each wave's pen doors open, its tokens are added to the combat (roll their initiative), and you're whispered. **Send now** brings a wave out early.
4. **When the run ends** (the end of the track, or the ally drops), click **Record the result**: the yards reached and the damage taken, compared with the rivals.

**Reset the run** removes the wave tokens and closes the pens for another go.

## The waves
- **Wave 1** (3 locals, about 99 HP each): @Actor[Local Brawler] (unarmed 2d12), @Actor[Local Hedge-Mage] (Flame 2d12 plus Ignite), @Actor[Local Devotee] (Death's Wither, 2d12 Supernatural).
- **Wave 2** (3 staff, about 171 HP each): @Actor[Swift Duelist] (Heavy Swift 3d12 with Pierce+ and Fast follow-ups), @Actor[Charm Mage] (Charm for Disadvantage on dodges, plus a Ranged Cut 6d10), @Actor[Pyre Adept] (Destruction's Immolate, 6d10 heat plus Ignite, one main cast per turn).
- **Wave 3** (3 King's Guard, about 234 HP each), fighting as a unit: @Actor[King's Guard Halberdier] (Reach Heavy, 2 attacks), @Actor[King's Guard Ward-Mage] (Protection Shields on the other two, plus one Ranged Flame), @Actor[King's Guard Gravedeacon] (one Wither, 4d12 Supernatural, plus Fester or Ward use).
- **Finale:** @Actor[Blackwell]. Only Supernatural protection stops him: Cold Iron or Silver, Shielding, Wards, Shrouds, temp HP.

Every wave focuses the protected ally. The waves arrive from the pens beside their yard post (marked on the scene).

## What to expect
Simulated with the calibrated rosters (positioning and party specials not modeled):

1. **The waves can't all be cleared** in the 3 turns between arrivals; they're glass cannons, built to pressure the ally, not to be farmed.
2. **Wave 3 can't be killed in its 4 turns.** It's a survival wall, which matches "the best teams reach 70–80 yards."
3. **The Supernatural damage builds in steps:** the Wave 1 devotee, the Wave 3 Gravedeacon, then Blackwell.
4. **The choice of protected ally dominates.** A Mental character stacking self Dream Wards (Shielding blocks every damage category) is the strong pick; Brace is bypassed by Targeted and Supernatural attacks, and a mage's Shield doesn't stack.

Simulated with the final statblocks, as the chance of reaching 80 yards:

| Protected ally | Three attackers | Two attackers and one protector |
|---|---|---|
| Mental | 62% | 76% |
| Brace tank | 25% | 38% |
| Mage | 6% | 19% |

Teams average 65–78 yards.
