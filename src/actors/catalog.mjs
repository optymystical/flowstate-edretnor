// Optional: read item names and icons from a local copy of the Flow State system at build time.
// Set FLOWSTATE_SYSTEM to the system's folder; it defaults to a sibling checkout. Without it, items are written by identity
// alone and still link themselves to the catalog when Foundry loads them.
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const candidates = [process.env.FLOWSTATE_SYSTEM, resolve(here, "../../../optymystical/flowstatefoundryvtt"), resolve(here, "../../../FlowStateFoundryVTT")].filter(Boolean);
let C = null;
for (const dir of candidates) {
  const f = resolve(dir, "module/catalog.mjs");
  if (existsSync(f)) { C = await import(pathToFileURL(f).href); break; }
}
export const hasCatalog = !!C;
export function catalog(key, grade) {
  if (!C || !C.ITEM_CATALOG[key]) return null;
  return C.itemData(key, grade != null ? { grade } : {});
}
