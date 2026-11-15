/**
 * Flow State: The Fall of Edretnor. The module's runtime code.
 * - When the Edretnor Adventure is imported, the world gets the arc's settings (Shards with a 100 starting purse,
 *   Common Grade 3 starting gear).
 * - game.modules.get("flowstate-edretnor").api exposes the same steps so a GM (or the setup macro) can run them again.
 */
export const MODULE_ID = "flowstate-edretnor";
const ADVENTURE_FLAG = "edretnor";

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

Hooks.once("init", () => {
  const mod = game.modules.get(MODULE_ID);
  if (mod) mod.api = { applyWorldSettings, WORLD_SETTINGS };
});

// Runs after the Adventure's documents are created.
Hooks.on("importAdventure", async (adventure /* , formData, created, updated */) => {
  if (adventure?.flags?.[MODULE_ID]?.adventure !== ADVENTURE_FLAG) return;
  if (!game.user.isGM) return;
  await applyWorldSettings();
});
