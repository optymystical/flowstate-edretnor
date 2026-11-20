// The Omens (project docs omen-statblocks, bloomrot; Flow State - Bestiary). Since system 0.102.0 NPCs carry an Ancestry, so each Omen is
// a Bestiary creature: its Wonderborn Ancestry with the Omen Background (system.abc), which gives Tier 3 in Wonderborn, its lineage tree and its
// Wonder's tree, plus its Domain (Mental Theory and its own Wonder at Tier 5), all free. The system automates those trees (natural attacks,
// Allure/Dread, Regrowth, Ripen, Light Eater...), so the biographies keep only tactics and encounter notes.
import { npc, bio, naturalIcon } from "./npc.mjs";
import { F } from "../folders.mjs";

const folder = F.actorsOmens._id;

/** An Omen's Ancestry, Background and free trees (the system's bestiaryBuild for the Omen Background). */
function omen(ancestry, lineage, wonder) {
  return {
    ancestry, background: "omen", patron: wonder, sapience: 2, supernatural: true,
    free: { "ancestry-wonderborn": 3, [`ancestry-${lineage}`]: 3, [`ancestry-${ancestry}`]: 3, "mental-theory": 5, [wonder]: 5 }
  };
}
const DARK = omen("wonderborn-dark", "nightmareborn", "mental-dark-nightmare");
const GROWTH = omen("wonderborn-growth", "dreamborn", "mental-growth-dream");
const LIFE = omen("wonderborn-life", "dreamborn", "mental-life-dream");
const AUTOMATED = "Its Wonderborn, lineage and Wonder trees are automated (Codex: Bestiary); its natural attack is on the Action List.";

export const OMENS = [
  npc({ key: "omen-gloamhound-riteborn", name: "Gloamhound (rite-born)", tokenName: "Gloamhound", img: "omen_gloamhound_riteborn", folder, sort: 100, statPoints: 45, sp: 9,
    stats: { snap: 31, will: 16 }, ...DARK,
    senses: { sight: "primary", hearing: "primary", smell: "heightened" },
    trees: { "generic-perception": 2, "generic-smell": 3 },
    items: [naturalIcon("riposte", "mental-dark-nightmare:shadowmark")],
    bio: bio("Dark Omen, rite-born: summoned by the Maw's rites and fed by the cult. Size 3. Calf-sized black dog; its eyes are its only light.", {
      Ancestry: AUTOMATED + " Black Jaws 3d10; Dread 27.",
      Propagation: "A creature dies in darkness within 100ft of it. The Maw burns its dead in black flame so packs climb out of the pyres.",
      Tactics: [
        "With handlers: Eclipse its handler, load them with Umbral Strike charges, Eclipse the party; the handlers strike from half stealth.",
        "Alone: shadows and tracks. Its Smell cuts through the city smoke; it can't be surprised; it howls for the pack.",
        "Cornered: relies on Riposte."
      ],
      "In a perception contest": "It rolls d9 with Advantage (Heightened Smell). In smoke it has no Advantage."
    }) }),
  npc({ key: "omen-gloamhound-grown", name: "Gloamhound (fully grown)", tokenName: "Gloamhound", img: "omen_gloamhound_grown", folder, sort: 200, statPoints: 90, sp: 18,
    stats: { snap: 63, will: 33 }, ...DARK,
    senses: { sight: "primary", hearing: "primary", smell: "heightened" },
    trees: { "generic-perception": 2, "generic-smell": 3 },
    items: [naturalIcon("riposte", "mental-dark-nightmare:shadowmark")],
    bio: bio("Dark Omen, fully grown (wild). Size 3. Its Snappence doubles the rite-born hound's, so its Wonder Power and bolded values do too.", {
      Ancestry: AUTOMATED + " Black Jaws 6d10; Dread 54.",
      Notes: "In Phase 3 of the crawl, one hound in a Hound pack is fully grown. Tactics as the rite-born hound."
    }) }),
  npc({ key: "omen-burgeon", name: "Burgeon", img: "omen_burgeon", folder, sort: 300, size: 4, statPoints: 75, sp: 15,
    stats: { pon: 53, will: 28 }, ...GROWTH,
    senses: { sight: "none", hearing: "primary", smell: "primary" },
    alignment: { kind: "dream", level: 2 },
    trees: {},
    items: [naturalIcon("vigil", "mental-growth-dream:sapling")],
    bio: bio("Growth Omen: the Conservatory specimen (variant 1). Size 4. A bulb-bodied plant crowned with one enormous striped bloom. It has no Sight; it hears through its roots.", {
      Ancestry: AUTOMATED + " Root Lash 5d8 at 10ft, Strengthened at Size 4; Allure 60 (starting characters can't reach it); Ripen blooms it at the end of its 4th combat turn.",
      Turn: ["Enhanced Cultivate on itself (1 AP): 3 stacks on a hit.", "Recover Vigil twice (2 AP), spending a stack on Bark.", "Cultivate on itself again (1 AP).", "Heave the nearest attacker: a Melee Cultivate spending a stack on Uproot (about 270 Force).", "Keep stacks and RP for reaction heaves on anyone working a moon-lamp."],
      "Its weakness": "Every heave also gives the target a Growth stack, which they can spend on Thorn for +10d8. Let players find this out.",
      "In the Conservatory": "If it blooms, the organizers' wardens burn it out: nobody is hurt, the Night wing seals for 10 real minutes, and the Burgeon wilts back to its bulb. Simulated against 5 starting characters: about 71% defeat it before it blooms with everyone attacking, about 20% if three attacks a turn go to the lamps (with Overgrowth at 20ft; it is now 10ft)."
    }) }),
  npc({ key: "omen-bloomrot", name: "Bloomrot", img: "omen_bloomrot", folder, sort: 400, statPoints: 75, sp: 15,
    stats: { pon: 39, con: 18, will: 15, str: 15 }, ...LIFE,
    senses: { sight: "primary", hearing: "none", smell: "heightened" },
    alignment: { kind: "dream", level: 2 },
    trees: {},
    items: [naturalIcon("sanctum", "mental-life-dream:verdant-soul")],
    bio: bio("Life Omen: the Conservatory specimen (variant 2). Size 3. An animal or corpse that won't die, swollen with fungus and buds.", {
      Ancestry: AUTOMATED + " Budding Gore 3d10 (Infects); Allure 45; Regrowth at the start of its turns except heat and crits; Sporing at the end of its 4th combat turn.",
      Propagation: "A creature dies while Infected, and its body isn't burned within a day.",
      Tactics: ["Turn 1: Flourish on itself, Bloom on itself, two Gores.", "After that: Perennial keeps Flourish going; two Blooms on itself, two Gores. Cap it at two fresh Blooms a turn."],
      "How it plays": "Whatever the party doesn't burn or crit grows back at the start of its turn: drop it below its Pain Threshold in one round, or stack heat and crits. Ignite deals heat at the end of its turn, after Regrowth.",
      "In the Conservatory": "Sporing works like the Burgeon's bloom: the wardens burn it out, the wing seals for 10 real minutes, nobody is hurt. Optional: a moon-lamp smashed on it deals 2d10 heat plus Ignite, but a smashed lamp can't be relit, so re-containment is lost. Simulated: 61% with everyone attacking, 69% with 3 heat attacks a turn, 32% with three attacks on the lamps."
    }) })
];
