// The crawl's statblocks: the Maw and Edretnor (project doc edretnor-crawl-tables, Statblocks).
// Group sizes: a cell is 1 Cell Leader and 4 Maw Cultists; half a cell is 1 Cell Leader and 2 Maw Cultists.
import { npc, bio, weapon, improvised, armor, icon } from "./npc.mjs";
import { F } from "../folders.mjs";

const cult = F.actorsCult._id, city = F.actorsCity._id;

export const CRAWL = [
  npc({ key: "cult-maw-cultist", name: "Maw Cultist", img: "cult_maw_cultist", folder: cult, sort: 100, statPoints: 30, sp: 10,
    stats: { snap: 27, will: 7 }, trees: { "mental-theory": 2, "mental-death-nightmare": 3, "mental-dark-nightmare": 2 },
    alignment: { kind: "nightmare", level: 1 },
    bio: bio("Commoner. The bulk of every cell.", {
      Tactics: "Three Withers a turn at the nearest enemy, with Fester on the first hit. Flees once its Cell Leader falls."
    }) }),
  npc({ key: "cult-cell-leader", name: "Cell Leader", img: "cult_cell_leader", folder: cult, sort: 200, statPoints: 45, sp: 15,
    stats: { snap: 33, will: 18 }, trees: { "mental-theory": 3, "mental-dark-nightmare": 3, "mental-death-nightmare": 3 },
    free: { "mental-below-nightmare": 3, "mental-psion-arts": 2 },
    alignment: { kind: "nightmare", level: 2 },
    items: [icon("veil", 3, "mental-dark-nightmare:shadowmark")],
    bio: bio("Leads a cell. Background: Maw acolyte.", {
      Tactics: [
        "Eclipse the most dangerous PC.",
        "Eclipse an ally Cultist: Totality then gives every Eclipsed Cultist half stealth against that PC.",
        "Sink anyone rushing in, with Vice on every failed escape.",
        "Wither with any AP left."
      ]
    }) }),
  npc({ key: "cult-preacher", name: "Preacher", img: "cult_preacher", folder: cult, sort: 300, statPoints: 45, sp: 15,
    stats: { snap: 33, will: 18 }, trees: { "mental-theory": 3, "mental-dark-nightmare": 3, "mental-death-nightmare": 3, "mental-below-nightmare": 2 },
    free: { "generic-persuasion": 3, "generic-resolve": 2 },
    alignment: { kind: "nightmare", level: 2 },
    items: [icon("veil", 3, "mental-dark-nightmare:shadowmark")],
    bio: bio("The Recruiter: a Cell Leader who preaches. Background: Maw priest.", {
      Tactics: "Talks first: three exchanges of Persuade or Deceive against his persuasion check, for a crowd of 10–20. Fights only if attacked or losing the crowd, then plays as a Cell Leader."
    }) }),
  npc({ key: "cult-ritualist", name: "Ritualist", img: "cult_ritualist", folder: cult, sort: 400, statPoints: 60, sp: 20,
    stats: { snap: 44, will: 24 }, trees: { "mental-theory": 4, "mental-below-nightmare": 4, "mental-dark-nightmare": 3, "mental-death-nightmare": 3 },
    free: { "mental-psion-arts": 3, "generic-resolve": 3, "generic-discipline": 2 },
    alignment: { kind: "nightmare", level: 2 },
    items: [icon("warden", 5, "mental-below-nightmare:weight")],
    bio: bio("Keeps a rite circle. Background: rite-keeper.", {
      Tactics: "Sink and Burden the closest threat, Vice every failed escape, Quicksand an escape that would succeed, and Wither whatever is left.",
      "The circle": "While a Ritualist stands in its circle, the runes can't be scrubbed. Breaking the anchor stone still works."
    }) }),
  npc({ key: "cult-cell-master", name: "Cell Master", img: "cult_cell_master", folder: cult, sort: 500, statPoints: 75, sp: 25,
    stats: { snap: 55, will: 30 }, trees: { "mental-theory": 5, "mental-dark-nightmare": 5, "mental-below-nightmare": 4, "mental-death-nightmare": 4 },
    free: { "generic-persuasion": 3, "generic-resolve": 3, "mental-psion-arts": 3 },
    alignment: { kind: "nightmare", level: 3 },
    items: [icon("warden", 6, "mental-dark-nightmare:shadowmark")],
    bio: bio("The central head of the attack. Background: Maw clergy. Holds the Phase 1 central zone with 2 Ritualists, 4 cells and 3 rite-born Gloamhounds.", {
      "Win condition": "Drop him below his Pain Threshold, or kill him. The central rite collapses and the attack ends: every small circle fizzles and the Omens bound to the rite scatter. The king grants a wish for it, and the party is guaranteed an audience.",
      Tactics: [
        "Nightfall on his guards so they all attack from half stealth (Totality).",
        "Hand out Umbral Strike charges.",
        "Wither the closest PC.",
        "Once 50 HP above his Pain Threshold, he Sinks his attacker and backs into the circle."
      ]
    }) }),

  npc({ key: "city-guard", name: "Edretnor Guard", img: "edretnor_guard", folder: city, sort: 100, statPoints: 45, sp: 15, disposition: 1,
    stats: { str: 33, con: 18 }, trees: { "martial-theory": 3, "martial-reach-weapons": 3 },
    free: { "martial-medium-armor": 3, "martial-defender-weapons": 2 },
    items: [weapon("reach", "heavy", "iron", 4), armor("medium", "hide", 4)],
    bio: bio("The city watch. Background: city watch.", { Tactics: "Holds a line: two spear strikes a turn, Palisade against anyone moving into his reach, Brace when struck." }) }),
  npc({ key: "city-townsperson", name: "Townsperson", img: "edretnor_townsperson", folder: city, sort: 200, statPoints: 30, sp: 10, disposition: 0,
    stats: { str: 22, con: 7, dex: 7 }, trees: { "martial-theory": 1, "martial-brawling-methods": 1 },
    items: [improvised("light", { name: "Club" })],
    bio: bio("Mobs, crowds, the frightened.", {
      Tactics: "A mob attacks together and scatters once half of it is down.",
      Notes: "A frightened civilian has a knife instead of a club (2d4, 2 AP)."
    }) }),
  npc({ key: "city-bandit", name: "Bandit", img: "edretnor_bandit", folder: city, sort: 300, statPoints: 45, sp: 15,
    stats: { dex: 33, con: 18 }, trees: { "martial-theory": 3, "martial-swift-weapons": 3, "martial-light-armor": 2 },
    items: [weapon("swift", "heavy", "iron", 3), weapon("swift", "light", "hardwood", 3), armor("light", "softLeather", 3)],
    bio: bio("Opportunists, scavengers, claim-jumpers.", { Tactics: "Go after the weakest-looking target. Flee once losing." }) }),
  npc({ key: "city-old-soldier", name: "Old Soldier", img: "edretnor_old_soldier", folder: city, sort: 400, statPoints: 75, sp: 25, disposition: 0,
    stats: { str: 55, con: 30 }, trees: { "martial-theory": 4, "martial-bladed-weapons": 5, "martial-medium-armor": 4, "martial-defender-weapons": 3 },
    items: [weapon("bladed", "heavy", "steel", 5), armor("medium", "chitin", 5, { name: "Old Medium Armor" })],
    bio: bio("A Continental War veteran who refuses to leave the city.", {
      Joining: "He joins the convoy on a Persuade against a static Hard 15. Mentioning the peninsula gives Advantage. He then fights alongside the party.",
      Notes: "Old knees: he moves slowly."
    }) }),
  npc({ key: "city-wounded-contestant", name: "Wounded Contestant", img: "edretnor_guard", folder: city, sort: 500, statPoints: 45, sp: 15, disposition: 1,
    stats: { str: 28, con: 18, dex: 8 }, trees: { "martial-theory": 3, "martial-bladed-weapons": 3, "martial-medium-armor": 3, "generic-endurance": 2 },
    items: [weapon("bladed", "heavy", "iron", 3), armor("medium", "hide", 3)],
    hp: 108,
    bio: bio("A starting character from another team, found in the city at half HP. Use this build, or any starting build.", {
      Notes: "A Health potion or a rest brings them to full. They fight alongside the party. A player whose character died can take one over as their replacement."
    }) })
];
