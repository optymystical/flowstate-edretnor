// Stable document ids: a Foundry id (16 letters and digits) from a key. The same key always gives the same id, so links
// (UUIDs in journals and tables) survive rebuilds and a re-imported Adventure updates its documents instead of duplicating them.
import { createHash } from "node:crypto";
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function stableId(key) {
  const h = createHash("sha256").update(`flowstate-edretnor:${key}`).digest();
  return Array.from(h.subarray(0, 16), b => ALPHA[b % ALPHA.length]).join("");
}
