// Round 3 variant tables (project doc round3-conservatory): roll them before each run.
import { table, stableId } from "../common.mjs";
import { F } from "../folders.mjs";

const folder = F.tablesConservatory._id;
const plant = (name, lacks, tells) => ({ name, text: `<strong>Lacks ${lacks}.</strong> ${tells}` });
const fuses = (trellis, pond, bramble) => ({ name: `Trellis ${trellis}, pond ${pond}, bramble ${bramble}`,
  text: `The <strong>${trellis}</strong> fuse is on the trellis, the <strong>${pond}</strong> fuse is in the pond, and the <strong>${bramble}</strong> fuse is in the bramble.` });
const actor = (key, name, text) => ({ name, uuid: `Actor.${stableId(`actor:${key}`)}`, img: `modules/flowstate-edretnor/assets/tokens/${key.replace(/^omen-/, "omen_")}.png`, text });

export const CONSERVATORY = [
  table("r3-seed-vault-plants", "Seed Vault plants", [
    plant("Sunpetal Creeper", "Sun", "Every leaf turns toward the vault's dead lamp. Faint citrus smell (Smell, Moderate)."),
    plant("Bog Lantern", "Rain", "Cracked dry soil, empty pitcher-cups, curled leaves (Sight, automatic)."),
    plant("Ember Fern", "Ember", "Frond tips blackened by frost. The soil near the dead heating coil is the only warm spot (touch)."),
    plant("Frostbell", "Frost", "Drooping, beaded with sweat. Sweet-rotten smell from overheating (Smell, Moderate)."),
    plant("Glass Orchid", "Sun", "Translucent petals clouded grey. It grows toward a pinhole of light at the tube (Spot, Moderate)."),
    plant("Drowned Reed", "Rain", "The tag reads \"Mire,\" half scratched off. Roots crawl out of the pot toward the floor drain (Spot, Moderate)."),
    plant("Cinder Moss", "Ember", "Grows only on the coil side of the pot. Damp, chilled stone (touch)."),
    plant("Winter Mint", "Frost", "Leaf edges scorched brown. Strong mint (Smell, Easy).")
  ], { folder, sort: 100, replacement: false,
    description: "<p>Draw once per player's vault. Draws without replacement, so no two vaults share a plant; reset the table before the next run.</p>" }),
  table("r3-fuse-spots", "Fuse hiding spots", [
    fuses("Amber", "Rose", "Jade"), fuses("Amber", "Jade", "Rose"), fuses("Rose", "Amber", "Jade"),
    fuses("Rose", "Jade", "Amber"), fuses("Jade", "Amber", "Rose"), fuses("Jade", "Rose", "Amber")
  ], { folder, sort: 200, description: "<p>Dawn wing: which crystal fuse is in which hiding spot.</p>" }),
  table("r3-socket-mapping", "Socket mapping", [
    { name: "Set A", text: "Amber → Root, Rose → Bloom, Jade → Leaf." },
    { name: "Set B", text: "Amber → Seed, Rose → Thorn, Jade → Dew." },
    { name: "Set C", text: "Amber → Leaf, Rose → Root, Jade → Bloom." }
  ], { folder, sort: 300, description: "<p>Dawn wing: which socket each fuse belongs in.</p>" }),
  table("r3-valve-order", "Valve order", [
    { name: "Order A", text: "Owl, Heron, Bee, Wren, Moth (highest pressure first)." },
    { name: "Order B", text: "Bee, Moth, Owl, Heron, Wren (highest pressure first)." },
    { name: "Order C", text: "Heron, Wren, Moth, Owl, Bee (highest pressure first)." }
  ], { folder, sort: 400, description: "<p>Noon wing: the order to open the five valves.</p>" }),
  table("r3-seed-jar", "Living seed jar", Array.from({ length: 12 }, (_, i) => ({ name: `Jar ${i + 1}`, text: `Jar ${i + 1} holds the living Moon Lily seed.` })),
    { folder, sort: 500, description: "<p>Dusk wing: which of the 12 jars holds the living seed. The frosted ledger narrows it to 3 jars, including this one.</p>" }),
  table("r3-omen-specimen", "Omen specimen", [
    actor("omen-burgeon", "Burgeon", "Growth Omen. Blooms at the end of its 4th turn."),
    actor("omen-bloomrot", "Bloomrot", "Life Omen. Spores at the end of its 4th turn.")
  ], { folder, sort: 600, description: "<p>Night wing: the organizers' contained specimen.</p>" }),
  table("r3-bloom-condition", "Bloom condition", [
    { name: "Darkness and silence" },
    { name: "Darkness and the scent of rain", text: "The Noon misters on." },
    { name: "Darkness and warmth", text: "The Ember heaters on." }
  ], { folder, sort: 700, description: "<p>Night Bloom: what the Moon Lily bud needs to open.</p>" })
];
