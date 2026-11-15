// Builds the module's compendium pack (npm run build, from dev/). The readable JSON source is written to dev/packs-src/edretnor/
// (kept in git), then compiled into packs/edretnor/ (LevelDB, what Foundry loads). Close the world in Foundry before rebuilding.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { buildAdventure } from "../src/adventure.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const STATS = { coreVersion: "14", systemId: "flowstate", systemVersion: "0.93.0", createdTime: null, modifiedTime: null, lastModifiedBy: null };

const adv = buildAdventure();
const doc = { _key: `!adventures!${adv._id}`, ...adv, _stats: STATS };
const src = join(here, "packs-src", "edretnor"), dest = join(root, "packs", "edretnor");
rmSync(src, { recursive: true, force: true });
mkdirSync(src, { recursive: true });
writeFileSync(join(src, `${adv._id}.json`), `${JSON.stringify(doc, null, 2)}\n`);
rmSync(dest, { recursive: true, force: true });
await compilePack(src, dest, { log: false });
const n = k => (adv[k] || []).length;
console.log(`edretnor: 1 Adventure (${n("actors")} actors, ${n("scenes")} scenes, ${n("tables")} tables, ${n("journal")} journals, ${n("macros")} macros, ${n("folders")} folders) → packs/edretnor`);
