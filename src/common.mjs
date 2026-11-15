// Shared helpers for the Adventure's sources. Every document gets a stable id from a key (dev/ids.mjs).
import { stableId } from "../dev/ids.mjs";
export { stableId };

export const MODULE_ID = "flowstate-edretnor";
export const ASSETS = `modules/${MODULE_ID}/assets`;
export const token = name => `${ASSETS}/tokens/${name}.png`;

/** A Folder document. `type` is the document type it holds (Actor, JournalEntry, RollTable, Scene, Macro, Item). */
export function folder(key, name, type, { parent = null, sort = 0, color = null } = {}) {
  return { _id: stableId(`folder:${key}`), name, type, folder: parent, sorting: "m", sort, color, description: "", flags: {} };
}

/** A JournalEntry with text pages. `pages`: [{ key, name, html }]. */
export function journal(key, name, pages, { folderId = null, sort = 0 } = {}) {
  return {
    _id: stableId(`journal:${key}`), name, folder: folderId, sort, ownership: { default: 0 }, flags: {}, categories: [],
    pages: pages.map((p, i) => ({
      _id: stableId(`page:${key}:${p.key}`), name: p.name, type: "text", sort: (i + 1) * 100000,
      title: { show: true, level: 1 }, text: { format: 1, content: p.html }, ownership: { default: -1 }, flags: {}
    }))
  };
}

/** UUID of a journal page inside this Adventure once imported (world documents keep their ids). */
export const pageUuid = (journalKey, pageKey) => `JournalEntry.${stableId(`journal:${journalKey}`)}.JournalEntryPage.${stableId(`page:${journalKey}:${pageKey}`)}`;

/** World UUIDs for documents inside this Adventure once imported (world documents keep their ids). */
export const tableId = key => stableId(`table:${key}`);
export const tableUuid = key => `RollTable.${tableId(key)}`;
export const actorLink = (key, label) => `@UUID[Actor.${stableId(`actor:${key}`)}]{${label}}`;
export const tableLink = (key, label) => `@UUID[${tableUuid(key)}]{${label}}`;
/** An inline roll, rolled when the result is drawn, followed by its range: "[[1d7+5]] (6–12)". */
export const count = (lo, hi) => `[[1d${hi - lo + 1}${lo > 1 ? `+${lo - 1}` : ""}]] (${lo}–${hi})`;

/**
 * A RollTable. Each result: { name, text?, weight? | range?, table? (key of another table in this Adventure, drawn automatically),
 * uuid? (any document, e.g. a system compendium item), img? }. Ranges run in order from the weights unless given.
 */
export function table(key, name, results, { folder = null, sort = 0, description = "", replacement = true, formula = null, img = "icons/svg/d20-grey.svg" } = {}) {
  let n = 0;
  const rs = results.map((r, i) => {
    const range = r.range ?? [n + 1, n + (r.weight ?? 1)];
    n = Math.max(n, range[1]);
    const doc = r.table ? tableUuid(r.table) : (r.uuid ?? null);
    return {
      _id: stableId(`result:${key}:${i}`), type: doc ? "document" : "text", name: r.name, description: r.text ?? "",
      img: r.img ?? (r.table ? "icons/svg/d20-grey.svg" : "icons/svg/d20-black.svg"), documentUuid: doc,
      weight: range[1] - range[0] + 1, range, drawn: false, flags: {}
    };
  });
  return { _id: tableId(key), name, img, description, results: rs, formula: formula ?? `1d${n}`, replacement, displayRoll: true,
    folder, sort, ownership: { default: 0 }, flags: { [MODULE_ID]: { key } } };
}
