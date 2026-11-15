// The Omens (project docs omen-statblocks, bloomrot; Flow State - Bestiary). The Bestiary Ancestries aren't in the system yet,
// so the ancestry abilities (Wonderborn, the lineage tree, the Wonder tree) are written in the biography. The Wonder itself
// (Mental Theory T5 and the Wonder at T5, free) is a real tree, so its Modes and Tenet are automated.
import { npc, bio, naturalIcon } from "./npc.mjs";
import { F } from "../folders.mjs";

const folder = F.actorsOmens._id;
const OMEN = "Band 2 (about 5:1). Pole-Bound: it Manifests only its own Wonder, its Tenet is always on, and it is its own Icon. Its Patron is its own Wonder, so Enhance and Burst on its Manifests are free. Attacks between it and its opposite pole are Strengthened both ways. When killed it leaves a fragment of its pole.";
const WONDERBORN = ["<strong>Recognition:</strong> knows whether a creature serves its pole, opposes it, or neither.", "<strong>Propagation:</strong> see its trigger below.", "<strong>Follow the Pole:</strong> within 100ft of a Herald of its Wonder or a creature that serves its pole, its Ward's attack rolls have Advantage."];

export const OMENS = [
  npc({ key: "omen-gloamhound-riteborn", name: "Gloamhound (rite-born)", tokenName: "Gloamhound", img: "omen_gloamhound_riteborn", folder, sort: 100, statPoints: 45, sp: 9,
    stats: { snap: 31, will: 16 }, sapience: 2, supernatural: true,
    senses: { sight: "primary", hearing: "primary", smell: "heightened" },
    free: { "mental-theory": 5, "mental-dark-nightmare": 5 }, trees: { "generic-perception": 2, "generic-smell": 3 },
    items: [naturalIcon("riposte", "mental-dark-nightmare:shadowmark")],
    bio: bio("Dark Omen, rite-born: summoned by the Maw's rites and fed by the cult. Size 3. Calf-sized black dog; its eyes are its only light.", {
      Omen: OMEN,
      "Wonderborn (T3)": WONDERBORN,
      "Nightmareborn (T3)": ["<strong>Dread:</strong> creatures that first see it resist Fear, needing 27.", "<strong>Nightmare Depth:</strong> no speed penalty from Alignment.", "<strong>Prey on Fear:</strong> Advantage on attacks and Manifests against afraid creatures."],
      "Dark (T3)": ["<strong>Black Jaws</strong> (2 AP, melee, natural): <strong>3d10 physical</strong>. Roll it by hand.", "<strong>Lightless Sight:</strong> sees normally in darkness, its own obscurement included.", "<strong>Light Eater:</strong> nonmagical light within 10ft goes out; magical light within 10ft reaches half as far."],
      Propagation: "A creature dies in darkness within 100ft of it. The Maw burns its dead in black flame so packs climb out of the pyres.",
      Tactics: [
        "With handlers: Eclipse its handler, load them with Umbral Strike charges, Eclipse the party; the handlers strike from half stealth.",
        "Alone: shadows and tracks. Its Smell cuts through the city smoke; it can't be surprised; it howls for the pack.",
        "Cornered: relies on Riposte."
      ],
      "In a perception contest": "It rolls d9 with Advantage (Heightened Smell). In smoke it has no Advantage."
    }) }),
  npc({ key: "omen-gloamhound-grown", name: "Gloamhound (fully grown)", tokenName: "Gloamhound", img: "omen_gloamhound_grown", folder, sort: 200, statPoints: 90, sp: 18,
    stats: { snap: 63, will: 33 }, sapience: 2, supernatural: true,
    senses: { sight: "primary", hearing: "primary", smell: "heightened" },
    free: { "mental-theory": 5, "mental-dark-nightmare": 5 }, trees: { "generic-perception": 2, "generic-smell": 3 },
    items: [naturalIcon("riposte", "mental-dark-nightmare:shadowmark")],
    bio: bio("Dark Omen, fully grown (wild). Size 3. Every bolded value doubles relative to the rite-born hound.", {
      Omen: OMEN,
      "Wonderborn (T3)": WONDERBORN,
      "Nightmareborn (T3)": ["<strong>Dread:</strong> resisting needs 54.", "<strong>Nightmare Depth</strong> and <strong>Prey on Fear</strong> as the rite-born hound."],
      "Dark (T3)": ["<strong>Black Jaws</strong> (2 AP, melee, natural): <strong>6d10 physical</strong>. Roll it by hand.", "<strong>Lightless Sight</strong> and <strong>Light Eater</strong> as the rite-born hound."],
      Notes: "In Phase 3 of the crawl, one hound in a Hound pack is fully grown."
    }) }),
  npc({ key: "omen-burgeon", name: "Burgeon", img: "omen_burgeon", folder, sort: 300, size: 4, statPoints: 75, sp: 15,
    stats: { pon: 53, will: 28 }, sapience: 2, supernatural: true,
    senses: { sight: "none", hearing: "primary", smell: "primary" },
    alignment: { kind: "dream", level: 2 },
    free: { "mental-theory": 5, "mental-growth-dream": 5 }, trees: {},
    items: [naturalIcon("vigil", "mental-growth-dream:sapling")],
    bio: bio("Growth Omen: the Conservatory specimen (variant 1). Size 4. A bulb-bodied plant crowned with one enormous striped bloom. It has no Sight; it hears through its roots.", {
      Omen: OMEN,
      "Wonderborn (T3)": WONDERBORN,
      "Dreamborn (T3)": ["<strong>Allure:</strong> creatures that first see it resist as Fear, needing 60; on a failure their first attack against it each turn has Disadvantage until the end of their next turn. Starting characters can't reach 60.", "<strong>Lucid Depth:</strong> no speed penalty from Alignment.", "<strong>Bounty:</strong> once per round, a Manifest on a creature that serves its pole hits automatically."],
      "Growth (T3)": ["<strong>Root Lash</strong> (2 AP, 10ft, natural): <strong>5d8 physical</strong>, Strengthened at Size 4. Roll it by hand.", "<strong>Ripen:</strong> it blooms at the end of its 4th turn in combat.", "<strong>Seed:</strong> blooming scatters seed within 100ft; each seed that takes root grows a new Burgeon within a day. It then wilts back into its bulb."],
      Turn: ["Enhanced Cultivate on itself (1 AP): 3 stacks on a hit.", "Recover Vigil twice (2 AP), spending a stack on Bark.", "Cultivate on itself again (1 AP).", "Heave the nearest attacker: a Melee Cultivate spending a stack on Uproot (about 270 Force).", "Keep stacks and RP for reaction heaves on anyone working a moon-lamp."],
      "Its weakness": "Every heave also gives the target a Growth stack, which they can spend on Thorn for +10d8. Let players find this out.",
      "In the Conservatory": "If it blooms, the organizers' wardens burn it out: nobody is hurt, the Night wing seals for 10 real minutes, and the Burgeon wilts back to its bulb. Simulated against 5 starting characters: about 71% defeat it before it blooms with everyone attacking, about 20% if three attacks a turn go to the lamps."
    }) }),
  npc({ key: "omen-bloomrot", name: "Bloomrot", img: "omen_bloomrot", folder, sort: 400, statPoints: 75, sp: 15,
    stats: { pon: 39, con: 18, will: 15, str: 15 }, sapience: 2, supernatural: true,
    senses: { sight: "primary", hearing: "none", smell: "heightened" },
    alignment: { kind: "dream", level: 2 },
    free: { "mental-theory": 5, "mental-life-dream": 5 }, trees: {},
    items: [naturalIcon("sanctum", "mental-life-dream:verdant-soul")],
    bio: bio("Life Omen: the Conservatory specimen (variant 2). Size 3. An animal or corpse that won't die, swollen with fungus and buds.", {
      Omen: OMEN,
      "Wonderborn (T3)": WONDERBORN,
      "Dreamborn (T3)": ["<strong>Allure:</strong> resisting needs 45.", "<strong>Lucid Depth</strong> and <strong>Bounty</strong> as the Burgeon."],
      "Life (T3)": [
        "<strong>Budding Gore</strong> (2 AP, melee, natural): <strong>3d10 physical</strong>. Roll it by hand. On a hit the target is Infected for a day (the system's Infected status); any heat damage burns it out.",
        "<strong>Regrowth:</strong> at the start of each of its turns it regains all health lost since the start of its last turn, except health lost to heat damage or to critical hits.",
        "<strong>Sporing:</strong> at the end of its 4th turn in combat it releases its spores: every creature within 100ft that breathes becomes Infected. It then collapses, dormant, until it regrows over the next day."
      ],
      Propagation: "A creature dies while Infected, and its body isn't burned within a day.",
      Tactics: ["Turn 1: Flourish on itself, Bloom on itself, two Gores.", "After that: Perennial keeps Flourish going; two Blooms on itself, two Gores. Cap it at two fresh Blooms a turn."],
      "How it plays": "Whatever the party doesn't burn or crit grows back at the start of its turn: drop it below its Pain Threshold in one round, or stack heat and crits. Ignite deals heat at the end of its turn, after Regrowth.",
      "In the Conservatory": "Sporing works like the Burgeon's bloom: the wardens burn it out, the wing seals for 10 real minutes, nobody is hurt. Optional: a moon-lamp smashed on it deals 2d10 heat plus Ignite, but a smashed lamp can't be relit, so re-containment is lost. Simulated: 61% with everyone attacking, 69% with 3 heat attacks a turn, 32% with three attacks on the lamps."
    }) })
];
