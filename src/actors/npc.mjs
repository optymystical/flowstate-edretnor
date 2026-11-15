// Builds an NPC actor in the Flow State data model (system docs/SCHEMA.md).
// Statblocks are written the way the design docs give them (stats WITH the Stat Bonus); this subtracts the bonus, since the
// system stores stats before it. Items are written by identity (type, weight, material, Form...) and link themselves to the
// system catalog as they load; when a local copy of the system is found, its catalog fills in the names and icons at build time.
import { stableId, token } from "../common.mjs";
import { catalog } from "./catalog.mjs";

const STATS = ["str", "dex", "con", "pon", "snap", "will", "reach", "grasp", "build"];
const SQUARES = { 1: 0.25, 2: 0.5, 3: 1, 4: 2, 5: 4 };

/** A weapon, armor, Foci, Shroud or Icon by identity. */
// `extra` holds the item's own fields; `extra.name` renames the copy.
const split = ({ name, ...system }) => ({ name, system });
export const weapon = (weaponType, weight, material, grade, extra = {}) => { const e = split(extra); return { type: "weapon", name: e.name, key: `weapon.${weaponType}.${weight}.${material}`, system: { weaponType, weight, material, grade, equipped: true, ...e.system } }; };
export const improvised = (weight, extra = {}) => { const e = split(extra); return { type: "weapon", name: e.name, key: `weapon.improvised.${weight}`, system: { weaponType: "improvised", weight, equipped: true, ...e.system } }; };
export const armor = (weight, material, grade, extra = {}) => { const e = split(extra); return { type: "armor", name: e.name, key: `armor.${weight}.${material}`, system: { weight, material, grade, equipped: true, ...e.system } }; };
export const foci = (fociType, grade, extra = {}) => ({ type: "foci", key: `foci.${fociType}`, system: { fociType, grade, attuned: true, equipped: true, ...extra } });
export const shroud = (shroudType, grade, extra = {}) => ({ type: "shroud", key: `shroud.${shroudType}`, system: { shroudType, grade, attuned: true, ...extra } });
export const icon = (form, grade, tenet = "", extra = {}) => ({ type: "icon", key: `icon.${form}`, system: { form, grade, attuned: true, tenet, ...extra } });
/** An Omen is its own Icon: a natural Icon (no Grade). */
export const naturalIcon = (form, tenet) => ({ type: "icon", key: `icon.${form}`, system: { form, attuned: true, natural: true, tenet } });

function itemDoc(actorKey, it, i) {
  const base = catalog(it.key, it.system.grade);
  const sys = { ...(base?.system ?? {}), ...it.system };
  if (!base) { sys.base = ""; sys.overrides = []; }
  sys.description ??= "";
  return { _id: stableId(`item:${actorKey}:${i}`), name: it.name ?? base?.name ?? it.key, type: it.type, img: it.img ?? base?.img ?? null,
    system: sys, effects: [], folder: null, sort: i * 100, ownership: { default: 0 }, flags: {} };
}

/**
 * @param {object} o
 * @param {string} o.key        stable key (never change once published)
 * @param {string} o.name
 * @param {string} o.img        token file name (assets/tokens/<img>.png)
 * @param {number} o.statPoints counted stat points (for the Stat Bonus check)
 * @param {number} o.sp         Skill Points
 * @param {object} o.stats      stats WITH the Stat Bonus, as the statblock gives them; unlisted stats default to the bonus
 * @param {object} o.trees      { treeId: tier }, including the Background's
 * @param {object} [o.free]     the Background's free trees { treeId: tier }
 */
export function npc(o) {
  const bonus = Math.floor(o.sp / 5);
  const stats = {};
  for (const s of STATS) stats[s] = Math.max(0, (o.stats[s] ?? bonus) - bonus);
  const sum = Object.values(stats).reduce((a, b) => a + b, 0);
  if (o.statPoints != null && sum !== o.statPoints) throw new Error(`${o.name}: stats add to ${sum}, expected ${o.statPoints}`);
  const size = o.size ?? 3, sq = SQUARES[size];
  const img = token(o.img);
  const system = {
    stats, skillPoints: o.sp, unspentStats: 0, statCarry: 0, creation: false, size,
    trees: { ...(o.free ?? {}), ...o.trees }, freeTrees: o.free ?? {},
    abc: o.ancestry ? { ancestry: o.ancestry } : {},
    details: { sapience: String(o.sapience ?? 3) },
    senses: { sight: "primary", hearing: "primary", smell: "secondary", ...(o.senses ?? {}) },
    supernatural: !!o.supernatural, magical: !!o.magical,
    currency: {},
    biography: o.bio ?? ""
  };
  if (o.hp != null) system.hp = { value: o.hp, lost: 0 };
  const flags = { flowstate: { npcWizard: true, ...(o.alignment ? { alignment: o.alignment } : {}) } };
  return {
    _id: stableId(`actor:${o.key}`), name: o.name, type: "npc", img, folder: o.folder, sort: o.sort ?? 0,
    ownership: { default: 0 }, effects: [], flags, system,
    items: (o.items ?? []).map((it, i) => itemDoc(o.key, it, i)),
    prototypeToken: {
      name: o.tokenName ?? o.name, actorLink: false, disposition: o.disposition ?? -1, displayName: 20, displayBars: 20,
      bar1: { attribute: "hp" }, bar2: { attribute: "energy" },
      width: sq, height: sq, texture: { src: img, scaleX: 1, scaleY: 1 }, sight: { enabled: false }, flags: {}
    }
  };
}

/** A short HTML biography: role, then labelled sections. */
export function bio(role, sections) {
  const out = [`<p><em>${role}</em></p>`];
  for (const [title, body] of Object.entries(sections)) {
    out.push(`<h3>${title}</h3>`);
    out.push(Array.isArray(body) ? `<ul>${body.map(b => `<li>${b}</li>`).join("")}</ul>` : `<p>${body}</p>`);
  }
  return out.join("\n");
}
