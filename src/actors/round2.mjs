// Round 2: the Protection Run. Three waves and Blackwell (Tournament Arc Setup doc; project doc round2-statblocks).
// Every wave focuses the protected ally. The organizers rule that Force can't move a fastened ally off the track.
import { npc, bio, weapon, armor, foci, shroud, icon } from "./npc.mjs";
import { F } from "../folders.mjs";

const folder = F.actorsRound2._id;
const W1 = "Wave 1 (20 yards, turn 3): locals from the open casting call, paid. Common Grade 2 gear.";
const W2 = "Wave 2 (40 yards, turn 6): tournament staff. Common Grade 3 gear.";
const W3 = "Wave 3 (60 yards, turn 9): the King's Guard. Uncommon Grade 6 gear. They fight as a unit: one attacks, one shields, one pressures with Supernatural damage.";

export const ROUND2 = [
  npc({ key: "r2-local-brawler", name: "Local Brawler", img: "local_brawler", folder, sort: 100, statPoints: 30, sp: 10,
    stats: { str: 27, con: 7 }, trees: { "martial-theory": 1, "martial-brawling-methods": 3, "martial-medium-armor": 2 },
    items: [armor("medium", "hide", 2)],
    bio: bio(W1, {
      Tactics: "Two Heavy unarmed swings a turn at the protected ally, each followed by its Solitary extra attack. Opens with Jab.",
      Notes: ["Knockback has no effect on the fastened ally.", "Background: a trade (dockhand, chandler, gravedigger); no combat effect."]
    }) }),
  npc({ key: "r2-local-hedge-mage", name: "Local Hedge-Mage", img: "local_hedge_mage", folder, sort: 200, statPoints: 30, sp: 10,
    stats: { grasp: 27, build: 7 }, trees: { "magic-theory": 2, "magic-heat": 2, "magic-protection-arcana": 1, "magic-slashing": 1 },
    items: [foci("rod", 2)],
    bio: bio(W1, { Tactics: "Three Flames a turn at the protected ally. Ignition on the first if the ally isn't already burning." }) }),
  npc({ key: "r2-local-devotee", name: "Local Devotee", img: "local_devotee", folder, sort: 300, statPoints: 30, sp: 10,
    stats: { snap: 27, will: 7 }, trees: { "mental-theory": 2, "mental-death-nightmare": 3 },
    alignment: { kind: "nightmare", level: 1 },
    bio: bio(W1, { Tactics: "Three Withers a turn at the protected ally; Fester the first one that hits.", Notes: "Carries a carved bone prayer token (no Icon, no effect)." }) }),

  npc({ key: "r2-swift-duelist", name: "Swift Duelist", img: "staff_swift_duelist", folder, sort: 400, statPoints: 45, sp: 15,
    stats: { dex: 38, con: 13 }, trees: { "martial-theory": 3, "martial-swift-weapons": 3 },
    free: { "martial-bladed-weapons": 3, "martial-brawling-methods": 3, "martial-light-armor": 3 },
    items: [weapon("swift", "heavy", "iron", 3), weapon("swift", "light", "hardwood", 3), armor("light", "softLeather", 3)],
    bio: bio(W2, {
      Tactics: "Two Heavy sword attacks a turn at the protected ally, each giving a free Fast knife attack at Disadvantage. Blade Flurry whenever a full set lands.",
      Notes: "Background: arena fighter. Dexterity 38 counts as 30 for Grade 3 gear."
    }) }),
  npc({ key: "r2-charm-mage", name: "Charm Mage", img: "staff_charm_mage", folder, sort: 500, statPoints: 45, sp: 15,
    stats: { reach: 38, build: 13 }, trees: { "magic-theory": 3, "magic-charm": 2, "magic-slashing": 1, "magic-protection-arcana": 2 },
    free: { "magic-reach-arcana": 3, "magic-cold": 3, "magic-crushing": 2 },
    items: [foci("scroll", 3)],
    bio: bio(W2, {
      Tactics: "Charm on the protected ally (a Willpower check of 9+ resists; on a failure the ally dodges at Disadvantage until the mage's next turn, without knowing it), then Cut, every turn. A Willpower-heavy ally (most Mentals) shrugs Charm off.",
      Notes: "Background: College apprentice."
    }) }),
  npc({ key: "r2-pyre-adept", name: "Pyre Adept", img: "staff_pyre_adept", folder, sort: 600, statPoints: 45, sp: 15,
    stats: { snap: 28, will: 13, pon: 13 }, trees: { "mental-theory": 3, "mental-destruction-nightmare": 3, "mental-death-nightmare": 2 },
    alignment: { kind: "nightmare", level: 1 },
    items: [icon("veil", 3, "mental-destruction-nightmare:infuse")],
    bio: bio(W2, { Tactics: "Two Immolates a turn at the protected ally. Keeps its RP for Veil.", Notes: "Background: lamplighter (a trade)." }) }),

  npc({ key: "r2-kg-halberdier", name: "King's Guard Halberdier", img: "kings_guard_halberdier", folder, sort: 700, statPoints: 60, sp: 20,
    stats: { str: 49, con: 19 }, trees: { "martial-theory": 3, "martial-reach-weapons": 3 },
    free: { "martial-medium-armor": 5, "martial-defender-weapons": 2 },
    items: [weapon("reach", "heavy", "steel", 6, { twoHanded: true }), armor("medium", "chitin", 6)],
    bio: bio(W3, {
      Tactics: "Two halberd strikes a turn at the protected ally. Wall stops party members who try to block him off. Brace when struck.",
      Notes: "Background: King's Guard training."
    }) }),
  npc({ key: "r2-kg-ward-mage", name: "King's Guard Ward-Mage", img: "kings_guard_ward_mage", folder, sort: 800, statPoints: 60, sp: 20,
    stats: { grasp: 49, build: 19 }, trees: { "magic-theory": 3, "magic-protection-arcana": 3, "magic-heat": 2, "magic-gravity": 1 },
    free: { "magic-grasp-arcana": 3, "magic-cold": 3, "magic-slashing": 2 },
    items: [foci("shard", 6), shroud("bastion", 6)],
    bio: bio(W3, {
      Tactics: "Shields the Halberdier and the Gravedeacon (Adjust spreads a Shield to anyone within 10ft of the shielded Guard), then one Flame at the protected ally. The party has to break or burst through the Shields; Arcanomancy and Piercing do this well."
    }) }),
  npc({ key: "r2-kg-gravedeacon", name: "King's Guard Gravedeacon", img: "kings_guard_gravedeacon", folder, sort: 900, statPoints: 60, sp: 20,
    stats: { snap: 49, will: 19 }, trees: { "mental-theory": 3, "mental-death-nightmare": 4 },
    free: { "mental-below-nightmare": 3, "mental-dark-nightmare": 3, "mental-psion-arts": 2 },
    alignment: { kind: "nightmare", level: 2 },
    items: [icon("veil", 6)],
    bio: bio(W3, { Tactics: "One Wither with Fester each turn at the protected ally. Saves RP and energy for Veil, and uses Waste on anyone who rushes it." }) }),

  npc({ key: "r2-blackwell", name: "Blackwell", tokenName: "Blackwell", img: "royal_guard_blackwell", folder, sort: 1000, statPoints: 135, sp: 45,
    stats: { snap: 109, will: 39, con: 14, build: 9 },
    trees: { "mental-theory": 5, "mental-death-nightmare": 5, "mental-dark-nightmare": 5, "mental-below-nightmare": 5 },
    alignment: { kind: "nightmare", level: 4 },
    items: [icon("zealot", 11)],
    bio: bio("Royal Guard, rank 4. Stage 2. A peninsula survivor. Arrives the turn after the conveyor crosses 80 yards.", {
      "What he does": [
        "Realm-slips in behind the protected ally for one round, then leaves.",
        "Withers from behind the ally (Melee, 1 AP), Enhanced to also remove Max HP, with Fester so it hits again at the ally's next turn.",
        "Against a 2d7 dodge he hits 85% of the time and crits 67% of the time. Six Withers in one turn come to about 900."
      ],
      "Stage 2 (placeholder)": "His Death Modes are doubly Strengthened. Apply it by hand until Stage 2 exists.",
      "What stops him": [
        "Cold Iron or Silver gear (full Limit against Supernatural). A Grade 5 Cold Iron Heavy Defender shield with Broad+ (about 360 Limit) can Block his whole turn.",
        "Shielding and Wards (Projected or self), Shrouds and temp HP, layered."
      ],
      "If the ally survives": "\"You're free to go then.\""
    }) })
];
