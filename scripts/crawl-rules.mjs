// The Edretnor crawl's rules as plain functions over a state object (no Foundry calls here, so they can be tested in node).
// Source: the project docs edretnor-crawl-spec and edretnor-crawl-tables.

export const SIZE = 11;
const EXTRA = ["2,1", "9,8", "1,8"];                // must match dev/maps/edretnor.py
export const CITY = new Set([...Array.from({ length: 81 }, (_, i) => [1 + (i % 9), 1 + Math.floor(i / 9)])
  .filter(([x, y]) => (x - 5) ** 2 + (y - 5) ** 2 <= 20).map(([x, y]) => `${x},${y}`), ...EXTRA]);
export const SQUARE = "5,5", HALL = "5,4", OVERLOOK = "9,1";
export const CISTERNS = ["5,1", "9,5", "5,9", "1,5"];
export const key = (x, y) => `${x},${y}`;
export const xy = k => k.split(",").map(Number);
const near = (a, b) => { const [ax, ay] = xy(a), [bx, by] = xy(b); return Math.max(Math.abs(ax - bx), Math.abs(ay - by)) <= 1; };

export const BANDS = [
  { name: "None or Small", max: 10, enter: 10, full: 60 },
  { name: "Medium", max: 30, enter: 20, full: 40 },
  { name: "Large", max: Infinity, enter: 30, full: 20 }
];
export const band = n => BANDS.find(b => n <= b.max);
export const phaseAt = minutes => minutes < 120 ? 1 : minutes < 360 ? 2 : 3;
export const FIND_CAP = { 1: 4, 2: 3, 3: 2 };
export const HEAVY_PER_PHASE = { 2: 2, 3: 3 };
/** Quick-search DC: 10/11/12 by phase, down 2 per attempt on the tile, floor 2. */
export const searchDC = (tile, phase) => Math.max(2, 9 + phase - 2 * (tile.searches ?? 0));

function shuffle(a, rng) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const pick = (a, rng) => a[Math.floor(rng() * a.length)];
const int = (lo, hi, rng) => lo + Math.floor(rng() * (hi - lo + 1));

/** A fresh crawl: fixed tiles, the king's cistern, the barracks, the Phase 1 zone, four small circles and the hidden finds. */
export function generate(rng = Math.random) {
  const tiles = {};
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const k = key(x, y), city = CITY.has(k);
    tiles[k] = { kind: city ? "city" : (k === OVERLOOK ? "overlook" : "wild"), finds: city ? int(1, 4, rng) : 0, searches: 0, revealed: false, event: null, heavy: false };
  }
  tiles[SQUARE].kind = "square"; tiles[HALL].kind = "hall";
  const roles = shuffle(["king", "empty", "other", "other"], rng);
  CISTERNS.forEach((k, i) => { tiles[k].kind = "cistern"; tiles[k].cistern = roles[i]; });
  const open = Object.keys(tiles).filter(k => tiles[k].kind === "city");
  const barracks = pick(open, rng); tiles[barracks].barracks = true;
  const central = pick(open.filter(k => k !== barracks && near(k, SQUARE)), rng); tiles[central].zone = "central";
  const circles = [];
  for (const k of shuffle(open.filter(k => k !== barracks && k !== central && !near(k, SQUARE)), rng)) {
    if (circles.length === 4) break;
    if (circles.some(c => near(c, k))) continue;
    circles.push(k); tiles[k].circle = "hidden"; tiles[k].finds += 1;   // the circle is one of the tile's hidden results
  }
  return { version: 1, tiles, circles, party: null, started: false, minutes: 0, convoy: 0, delivered: 0, headKilled: false, log: [] };
}

export const phase = s => phaseAt(s.minutes);
export const activeZones = s => Object.entries(s.tiles).filter(([, t]) => t.zone === "central" || t.zone === "active").map(([k]) => k);
/** Tiles the hourly refresh may hide again: random tiles, not fixed ones, zones or heavy blockages. */
const refreshable = t => t.kind === "city" || t.kind === "wild" ? !t.barracks && !t.zone && !t.heavy : false;

/**
 * Advances the clock and applies everything that happens on the hour and at phase changes.
 * Returns a list of notes for the GM. `rng` drives the random choices.
 */
export function advance(s, minutes, rng = Math.random) {
  const notes = [];
  const from = s.minutes; s.minutes += minutes;
  if (!s.started) return notes;
  for (let h = Math.floor(from / 60) + 1; h <= Math.floor(s.minutes / 60); h++) {
    const at = `Hour ${h}`;
    // refresh: revealed random tiles away from the party go back to unknown
    const hidden = [];
    for (const [k, t] of Object.entries(s.tiles)) {
      if (t.revealed && refreshable(t) && !(s.party && near(k, s.party))) { t.revealed = false; t.event = null; hidden.push(k); }
    }
    if (hidden.length) notes.push(`${at}: ${hidden.length} revealed tile(s) away from the party go back to unknown.`);
    if (!s.headKilled) {
      // hours 1-4: the next small circle activates into a gathering zone (a destroyed one just doesn't, which lowers every later count)
      const next = h <= 4 ? s.circles[h - 1] : null;
      if (next && ["hidden", "found"].includes(s.tiles[next].circle)) { s.tiles[next].circle = "active"; s.tiles[next].zone = "active"; s.tiles[next].revealed = true; notes.push(`${at}: the small circle at ${next} activates into a gathering zone (telegraphed from adjacent tiles).`); }
      // from hour 5 the Royal Guard culls one zone an hour
      if (h >= 5) {
        const zones = activeZones(s);
        if (zones.length) { const k = pick(zones, rng); s.tiles[k].zone = "culled"; notes.push(`${at}: the Royal Guard culls the gathering zone at ${k}.`); }
      }
    }
    notes.push(`${at}: ${activeZones(s).length} active gathering zone(s).`);
    // phase changes at hours 2 and 6
    const p = phaseAt(h * 60);
    if (p !== phaseAt((h - 1) * 60)) notes.push(...changePhase(s, p, rng));
  }
  return notes;
}

function changePhase(s, p, rng) {
  const notes = [`Phase ${p} begins.${p === 2 ? " The Abyss falls and Heralds form; the barracks is looted. The king recalls the party at the end of this phase." : " The city is lost and the cult has pulled out; one Royal Guard member (Lancel the Wolf) is cleaning up. Death Omens may appear."}`];
  let trimmed = 0;
  for (const t of Object.values(s.tiles)) {
    const circle = t.circle === "hidden" ? 1 : 0;      // the circle itself is never trimmed
    if (t.finds > FIND_CAP[p] && t.finds - circle > 0) { t.finds -= 1; trimmed++; }
  }
  if (trimmed) notes.push(`${trimmed} tile(s) lost a hidden find (Phase ${p} allows at most ${FIND_CAP[p]}).`);
  const placed = placeHeavy(s, HEAVY_PER_PHASE[p] ?? 0, rng);
  if (placed.length) notes.push(`Heavy blockages fall at ${placed.join(", ")} (1 hour to clear with an event roll, or 4 hours quietly).`);
  return notes;
}

const KEY_TILES = s => Object.entries(s.tiles).filter(([, t]) => ["square", "hall", "cistern"].includes(t.kind) || t.barracks).map(([k]) => k);
function placeHeavy(s, n, rng) {
  const placed = [];
  const candidates = shuffle(Object.keys(s.tiles).filter(k => { const t = s.tiles[k]; return t.kind === "city" && !t.heavy && !t.barracks && !t.zone && k !== s.party; }), rng);
  for (const k of candidates) {
    if (placed.length === n) break;
    s.tiles[k].heavy = true;
    // never fully cut off a key tile: each keeps at least one open orthogonal neighbour inside the map
    const ok = KEY_TILES(s).every(kt => { const [x, y] = xy(kt); return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const t = s.tiles[key(x + dx, y + dy)]; return t && !t.heavy; }); });
    if (ok) placed.push(k); else s.tiles[k].heavy = false;
  }
  return placed;
}

/** What a fixed tile is, for the GM, given the phase. Null for random tiles. */
export function describe(s, k) {
  const t = s.tiles[k], p = phase(s);
  if (t.heavy) return "<strong>Heavy blockage.</strong> Clearing it takes 1 hour (with a roll on the event table) or 4 hours quietly.";
  if (t.zone === "central") return "<strong>The Phase 1 gathering zone.</strong> The Cell Master, 2 Ritualists, 4 cells (4 Cell Leaders and 16 Cultists) around the tile's edges, and 3 rite-born Gloamhounds. Each edge cell's leader makes perception contests; the hounds' Smell is the real problem (smoke or the wind takes it away). Killing the Cell Master ends the attack, and the king grants a wish for it.";
  if (t.zone === "active") return "<strong>An active gathering zone.</strong> A Herald, 6–10 cells, 1 Ritualist and 5 Gloamhounds. Telegraphed from adjacent tiles by chanting and a column of black flame. Don't fight it.";
  if (t.zone === "culled") return "<strong>A culled gathering zone.</strong> The Royal Guard was here: scorched stone, bodies, a dead circle.";
  if (t.kind === "square") return p === 1
    ? "<strong>The town square.</strong> Mostly intact, with guards and civilians. They don't know where the king is, but guess he's in one of the four cisterns under the city."
    : "<strong>The town square.</strong> Overrun since Phase 1: treat it as a city tile (draw a surface event).";
  if (t.kind === "hall") return p === 1
    ? "<strong>Town Hall.</strong> Officials and guards holding out. Like the square, they guess the king is in one of the four cisterns."
    : "<strong>Town Hall.</strong> Abandoned. Treat it as a city tile (draw a surface event).";
  if (t.kind === "cistern") return {
    king: "<strong>The king's cistern.</strong> The king and the Royal Guard. Civilians delivered here count toward the second wish; the king recalls the party at the end of Phase 2.",
    empty: "<strong>A cistern, empty.</strong> Dry stone and echoes.",
    other: "<strong>A cistern holding something else</strong> (your call: refugees hiding, a flooded trap, a cult cache)."
  }[t.cistern];
  if (t.barracks) return {
    1: "<strong>The barracks.</strong> Guards holding out, and a chance at upgraded gear (a roll on the Guard post armory table). A Large convoy here can form a militia.",
    2: "<strong>The barracks.</strong> Cultists looting it: a fight.",
    3: "<strong>The barracks.</strong> Looted. A small chance of finding something."
  }[p];
  if (t.kind === "overlook") return "<strong>The Overlook.</strong> A Spot (Moderate 10) reveals which way one fixed tile lies.";
  return null;
}
/** True if entering the tile draws a surface event (random tiles, and the square and hall after Phase 1). */
export const drawsEvent = (s, k) => { const t = s.tiles[k]; if (t.heavy || t.zone) return false;
  if (t.kind === "city") return !t.barracks; if (t.kind === "wild") return true; if (t.kind === "square" || t.kind === "hall") return phase(s) > 1; return false; };
