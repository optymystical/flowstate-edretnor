/**
 * Flow State: The Fall of Edretnor. The module's runtime code.
 * - The first time a GM opens a world with the module enabled, it offers to import the Adventure (once; the GM can decline).
 * - When the Edretnor Adventure is imported, the world gets the arc's settings (Shards with a 100 starting purse,
 *   Common Grade 3 starting gear).
 * - game.modules.get("flowstate-edretnor").api exposes these steps, plus the run tools the macros call: prepareRun (the Setup
 *   macro), marketMorning, the Crawl Panel (crawl-panel.mjs, rules in crawl-rules.mjs) and the Conservatory's facet lights.
 */
import { registerCrawlSettings, CrawlPanel, newCrawl, getCrawl } from "./crawl-panel.mjs";
import { prepareRun, marketMorning, lightFacet, lightFacetDialog } from "./setup.mjs";

export const MODULE_ID = "flowstate-edretnor";
const ADVENTURE_FLAG = "edretnor";
const PACK_ID = `${MODULE_ID}.edretnor`;

/** The arc's world settings: a level-0 start. */
export const WORLD_SETTINGS = {
  currencies: [{ id: "c0", name: "Shards", img: "icons/commodities/gems/gem-shattered-violet.webp", mergeInto: "", mergeAmount: 0, start: 100 }],
  startingStatPoints: 45,
  startingGrade: 3,
  startingMaxRarity: "common"
};

/** Apply the arc's world settings (GM only). */
export async function applyWorldSettings({ notify = true } = {}) {
  if (!game.user.isGM) return false;
  for (const [key, value] of Object.entries(WORLD_SETTINGS)) {
    try { await game.settings.set("flowstate", key, value); }
    catch (err) { console.warn(`${MODULE_ID} | could not set flowstate.${key}`, err); }
  }
  if (notify) ui.notifications.info("The Fall of Edretnor: world set to Shards (100 starting purse) and Common Grade 3 starting gear.");
  return true;
}

/** Open the Adventure's import window (the GM picks what to import, then clicks Import). */
export async function openImporter() {
  const pack = game.packs.get(PACK_ID);
  if (!pack) { ui.notifications.error("The Fall of Edretnor: the Adventure compendium is missing."); return null; }
  const index = await pack.getIndex();
  const entry = index.contents[0];
  if (!entry) { ui.notifications.error("The Fall of Edretnor: the Adventure compendium is empty."); return null; }
  const adventure = await pack.getDocument(entry._id);
  adventure.sheet.render({ force: true });
  return adventure;
}

Hooks.once("init", () => {
  // "" = never asked, "imported", or "declined".
  game.settings.register(MODULE_ID, "importState", { scope: "world", config: false, type: String, default: "" });
  registerCrawlSettings();
  const mod = game.modules.get(MODULE_ID);
  if (mod) mod.api = { applyWorldSettings, openImporter, WORLD_SETTINGS, prepareRun, marketMorning, lightFacet, lightFacetDialog,
    openCrawlPanel: () => CrawlPanel.open(), newCrawl, getCrawl };
});

// First time a GM opens the world: offer the import.
Hooks.once("ready", async () => {
  if (!game.user.isActiveGM) return;
  if (game.settings.get(MODULE_ID, "importState")) return;
  const { DialogV2 } = foundry.applications.api;
  const yes = await DialogV2.confirm({
    window: { title: "The Fall of Edretnor" },
    content: "<p>Import <strong>The Fall of Edretnor</strong> into this world now?</p><p>You can always import it later from the Compendium Packs tab.</p>",
    rejectClose: false
  });
  if (yes) await openImporter();
  else await game.settings.set(MODULE_ID, "importState", "declined");
});

// Runs after the Adventure's documents are created.
Hooks.on("importAdventure", async (adventure /* , formData, created, updated */) => {
  if (adventure?.flags?.[MODULE_ID]?.adventure !== ADVENTURE_FLAG) return;
  if (!game.user.isGM) return;
  await game.settings.set(MODULE_ID, "importState", "imported");
  await applyWorldSettings();
});
