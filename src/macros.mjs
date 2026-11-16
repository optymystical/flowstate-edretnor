// The GM's macros. Each calls the module's API (scripts/edretnor.mjs), so the code stays in the module and updates with it.
import { stableId } from "./common.mjs";
import { F } from "./folders.mjs";

const api = call => `const api = game.modules.get("flowstate-edretnor")?.api;\nif (!api) ui.notifications.error("Enable the Flow State: The Fall of Edretnor module first.");\nelse await api.${call};`;
const macro = (key, name, call, img, sort) => ({ _id: stableId(`macro:${key}`), name, type: "script", scope: "global", img, command: api(call),
  folder: F.macros._id, sort, ownership: { default: 0 }, flags: {} });

export const MACROS = [
  macro("setup", "Edretnor Setup", "prepareRun()", "icons/sundries/documents/document-sealed-red-yellow.webp", 100),
  macro("round1", "Round 1: Launch Panel", "openRound1Panel()", "icons/weapons/thrown/bolas-stone.webp", 150),
  macro("round2", "Round 2: Conveyor Panel", "openRound2Panel()", "icons/environment/settlement/fence-wooden-gate.webp", 160),
  macro("market", "Edretnor: Market Morning", "marketMorning()", "icons/commodities/currency/coins-assorted-mix-copper.webp", 200),
  macro("facet", "Conservatory: Light a Facet", "lightFacetDialog()", "icons/magic/light/explosion-star-glow-yellow.webp", 300),
  macro("crawl", "Edretnor: Crawl Panel", "openCrawlPanel()", "icons/tools/navigation/map-chart-tan.webp", 400)
];
