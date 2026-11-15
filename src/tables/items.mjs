// System compendium items the tables hand out (UUIDs from the system's docs/PACK_IDS.md; they're stable across system versions).
import { catalog } from "../actors/catalog.mjs";

const UUID = {
  "potion.healthLesser": "Compendium.flowstate.consumables.Item.Swn8RE7lV17Uo7DH",
  "potion.health": "Compendium.flowstate.consumables.Item.wbDU6cAiDVMT8uUc",
  "potion.healthGreater": "Compendium.flowstate.consumables.Item.rxFMJfAarDLGiIeR",
  "potion.energyLesser": "Compendium.flowstate.consumables.Item.Ig9OSD49U25tl2p6",
  "potion.energy": "Compendium.flowstate.consumables.Item.HKqSsQO4phLodGvO",
  "potion.energyGreater": "Compendium.flowstate.consumables.Item.633WWXQwQp1bay21",
  "icon.aegis": "Compendium.flowstate.starting-gear.Item.Y31CaBlWuDGBO09t",
  "icon.sanctum": "Compendium.flowstate.starting-gear.Item.QkAQYHiv9GhEXe4L",
  "icon.veil": "Compendium.flowstate.starting-gear.Item.IM9a0k6QbNdYSHGm",
  "icon.warden": "Compendium.flowstate.starting-gear.Item.y6jVdFNTxgXRs05i",
  "affix.quartz": "Compendium.flowstate.starting-gear.Item.EjcAnYIY2NlrgTbC",
  "affix.agate": "Compendium.flowstate.starting-gear.Item.6QWnYXqOBc40iEJz",
  "affix.jasper": "Compendium.flowstate.starting-gear.Item.az5ruCU6KBYqxrcp",
  "affix.obsidian": "Compendium.flowstate.starting-gear.Item.zzHPpM7pJxljWdZL",
  "affix.hematite": "Compendium.flowstate.starting-gear.Item.fPrnlchrLDKrufHa"
};
const NAME = { "potion.healthLesser": "Lesser Health Potion", "potion.health": "Health Potion", "potion.healthGreater": "Greater Health Potion",
  "potion.energyLesser": "Lesser Energy Potion", "potion.energy": "Energy Potion", "potion.energyGreater": "Greater Energy Potion" };

/** A table result that is the item itself (drag it from the chat card onto a sheet). */
export function item(key, text = "") {
  const c = catalog(key);
  return { name: c?.name ?? NAME[key] ?? key, uuid: UUID[key], img: c?.img, text };
}
/** A content link to the item, for result text. */
export const itemLink = key => `@UUID[${UUID[key]}]{${catalog(key)?.name ?? NAME[key] ?? key}}`;
