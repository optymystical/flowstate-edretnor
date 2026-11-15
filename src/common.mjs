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
