// The GM's Crawl Panel: the Edretnor crawl's state (a world setting), its scene fog and labels, and the buttons that run it.
import * as R from "./crawl-rules.mjs";

const MODULE_ID = "flowstate-edretnor";
const TILE = 300;                                   // px per crawl tile on the scene (dev/maps/edretnor.py)
const gmIds = () => game.users.filter(u => u.isGM).map(u => u.id);

export const registerCrawlSettings = () =>
  game.settings.register(MODULE_ID, "crawl", { scope: "world", config: false, type: Object, default: {} });

export const getCrawl = () => { const s = game.settings.get(MODULE_ID, "crawl"); return s?.tiles ? foundry.utils.deepClone(s) : null; };
async function save(s) { await game.settings.set(MODULE_ID, "crawl", s); await syncScene(s); CrawlPanel.instance?.render(); }

export const findTable = key => game.tables.find(t => t.flags?.[MODULE_ID]?.key === key);
const crawlScene = () => game.scenes.find(s => s.flags?.[MODULE_ID]?.crawl);
const whisper = content => ChatMessage.create({ content, whisper: gmIds(), speaker: { alias: "Edretnor Crawl" } });

/** Draw a table from this Adventure into the chat (GM roll); returns the result names. */
export async function draw(key) {
  const table = findTable(key);
  if (!table) { ui.notifications.warn(`Edretnor: the table "${key}" isn't in this world (import the Adventure).`); return []; }
  const { results } = await table.draw({ rollMode: "gmroll" });
  return results.map(r => r.name || r.text || "");
}

/** A fresh crawl map (keeps nothing from the old one). */
export async function newCrawl() {
  const s = R.generate();
  await save(s);
  const king = R.CISTERNS.find(k => s.tiles[k].cistern === "king");
  await whisper(`<p><strong>A new Edretnor.</strong> The king is in the cistern at ${king}. The barracks, the Phase 1 zone and the four small circles are placed; see the Crawl Panel.</p>`);
  return s;
}

// ---- the scene: fog over unknown tiles, labels on revealed ones, the party marker ----
const SHORT = { square: "Town Square", hall: "Town Hall", overlook: "The Overlook" };
function label(s, k) {
  const t = s.tiles[k];
  if (t.heavy) return "Heavy blockage";
  if (t.zone === "active" || t.zone === "central") return "Gathering zone";
  if (t.zone === "culled") return "Culled zone";
  if (t.kind === "cistern") return t.cistern === "king" ? "The king's cistern" : "Cistern";
  if (t.barracks) return "Barracks";
  if (t.event) return t.event;
  return SHORT[t.kind] ?? "";
}
async function syncScene(s) {
  const scene = crawlScene(); if (!scene) return;
  const want = new Map();
  for (const [k, t] of Object.entries(s.tiles)) {
    const [x, y] = R.xy(k);
    if (!t.revealed) want.set(`fog:${k}`, { x: x * TILE, y: y * TILE, shape: { type: "r", width: TILE, height: TILE }, fillType: 1, fillColor: "#0b0908", fillAlpha: 0.7, strokeWidth: 0, locked: true });
    else { const text = label(s, k); if (text) want.set(`label:${k}:${text}`, { x: x * TILE, y: y * TILE + TILE - 70, shape: { type: "r", width: TILE, height: 64 }, fillType: 1, fillColor: "#000000", fillAlpha: 0.45, strokeWidth: 0, text, fontSize: 30, textColor: "#f4ead2", locked: true }); }
  }
  if (s.party) { const [x, y] = R.xy(s.party); want.set(`party:${s.party}`, { x: x * TILE + 20, y: y * TILE + 20, shape: { type: "e", width: TILE - 40, height: TILE - 40 }, fillType: 0, strokeWidth: 10, strokeColor: "#ffd25a", strokeAlpha: 0.9, locked: true }); }
  const have = scene.drawings.filter(d => d.flags?.[MODULE_ID]?.crawl);
  const del = have.filter(d => !want.has(d.flags[MODULE_ID].crawl)).map(d => d.id);
  const haveKeys = new Set(have.map(d => d.flags[MODULE_ID].crawl));
  const add = [...want].filter(([id]) => !haveKeys.has(id)).map(([id, d]) => ({ ...d, flags: { [MODULE_ID]: { crawl: id } } }));
  if (del.length) await scene.deleteEmbeddedDocuments("Drawing", del);
  if (add.length) await scene.createEmbeddedDocuments("Drawing", add);
}

// ---- actions ----
async function tick(s, minutes) {
  const notes = R.advance(s, minutes);
  if (notes.length) await whisper(notes.map(n => `<p>${n}</p>`).join(""));
}
async function enter(s, k) {
  if (!s.started) return ui.notifications.warn("Start the attack clock first.");
  s.party = k;
  await tick(s, R.band(s.convoy).enter);
  const t = s.tiles[k];
  const text = R.describe(s, k);
  if (R.drawsEvent(s, k) && !(t.revealed && t.event)) {
    const p = R.phase(s);
    const names = await draw(t.kind === "wild" ? `crawl-wilderness-p${p}` : `crawl-surface-p${p}`);
    t.event = names.filter(Boolean).pop() ?? null;
  }
  if (text) await whisper(`<p>${k}: ${text}</p>`);
  if ((t.zone === "active") || [...adjacent(k)].some(n => s.tiles[n]?.zone === "active")) await whisper(`<p>Chanting and a column of black flame: a gathering zone is ${t.zone === "active" ? "here" : "next to this tile"}.</p>`);
  t.revealed = true;
}
function* adjacent(k) { const [x, y] = R.xy(k); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) yield R.key(x + dx, y + dy); }
async function revealFind(s, k) {
  const t = s.tiles[k];
  if (t.finds <= 0) return whisper(`<p>${k}: nothing left to find.</p>`);
  if (t.circle === "hidden" && Math.random() < 1 / t.finds) {
    t.finds -= 1; t.circle = "found";
    return whisper("<p><strong>A small circle.</strong> Guarded by 1 Ritualist and half a cell. Destroy it by scrubbing the runes (20 minutes, or 10 with the Rune-cut bodies intel; not while the Ritualist stands in it) or by breaking its anchor stone (60 Durability, 10 Limit). A destroyed circle never becomes a gathering zone.</p>");
  }
  t.finds -= 1;
  await draw(`crawl-find-p${R.phase(s)}`);
}

export class CrawlPanel extends foundry.applications.api.ApplicationV2 {
  static instance = null;
  static DEFAULT_OPTIONS = {
    id: "edretnor-crawl-panel", tag: "section", classes: ["edretnor-crawl"],
    window: { title: "Edretnor Crawl", icon: "fa-solid fa-map", resizable: true },
    position: { width: 760, height: "auto" },
    actions: {
      select: CrawlPanel.#select, enter: CrawlPanel.#enter, quick: CrawlPanel.#quick, found: CrawlPanel.#found, nothing: CrawlPanel.#nothing,
      full: CrawlPanel.#full, time: CrawlPanel.#time, convoy: CrawlPanel.#convoy, deliver: CrawlPanel.#deliver, start: CrawlPanel.#start,
      clearHeavy: CrawlPanel.#clearHeavy, destroyCircle: CrawlPanel.#destroyCircle, head: CrawlPanel.#head, reveal: CrawlPanel.#reveal, regenerate: CrawlPanel.#regenerate
    }
  };
  static open() { if (!game.user.isGM) return ui.notifications.warn("The Crawl Panel is for the GM."); (CrawlPanel.instance ??= new CrawlPanel()).render({ force: true }); return CrawlPanel.instance; }
  selected = null; searching = false;

  async _renderHTML() {
    const s = getCrawl();
    if (!s) return `<div class="ec-empty"><p>No crawl yet. Run the <strong>Edretnor Setup</strong> macro, or:</p><button data-action="regenerate">Generate a new Edretnor</button></div>${STYLE}`;
    const p = R.phase(s), b = R.band(s.convoy), sel = this.selected ?? s.party, t = sel ? s.tiles[sel] : null;
    const hh = Math.floor(s.minutes / 60), mm = String(s.minutes % 60).padStart(2, "0");
    let grid = "";
    for (let y = 0; y < R.SIZE; y++) for (let x = 0; x < R.SIZE; x++) {
      const k = R.key(x, y), c = s.tiles[k];
      const mark = c.heavy ? "▓" : c.zone === "active" || c.zone === "central" ? "Z" : c.zone === "culled" ? "z" : c.kind === "square" ? "S" : c.kind === "hall" ? "H"
        : c.kind === "cistern" ? (c.cistern === "king" ? "♔" : c.cistern === "empty" ? "○" : "◐") : c.barracks ? "B" : c.kind === "overlook" ? "▲" : "";
      const circle = c.circle && c.circle !== "active" ? { hidden: "◌", found: "◉", destroyed: "✕", fizzled: "✕" }[c.circle] : "";
      const cls = [c.kind === "wild" || c.kind === "overlook" ? "wild" : "city", c.revealed ? "rev" : "", k === s.party ? "party" : "", k === sel ? "sel" : ""].join(" ");
      grid += `<button type="button" class="${cls}" data-action="select" data-tile="${k}" title="${k}${c.event ? `: ${c.event}` : ""}"><b>${mark}</b><i>${circle}</i><small>${c.finds || ""}</small></button>`;
    }
    const info = t ? `<h3>Tile ${sel}${sel === s.party ? " (the party)" : ""}</h3>
      <p>${R.describe(s, sel) ?? (t.kind === "wild" ? "Wilderness." : "A city tile.")}</p>
      <p>${t.revealed ? `Revealed${t.event ? `: <strong>${t.event}</strong>` : ""}.` : "Unknown to the party."} Hidden finds: <strong>${t.finds}</strong>${t.circle ? ` (small circle: ${t.circle})` : ""}. Quick-search DC: <strong>${R.searchDC(t, p)}</strong>.</p>` : "<p>Click a tile.</p>";
    const here = sel && sel === s.party;
    return `<div class="ec">
      <div class="ec-top"><span>${s.started ? `<strong>${hh}:${mm}</strong> since the attack, <strong>Phase ${p}</strong>` : "Clock not started"}</span>
        <span>Zones: <strong>${R.activeZones(s).length}</strong></span>
        <span>Convoy: <strong>${s.convoy}</strong> (${b.name}) · Delivered: <strong>${s.delivered}</strong></span></div>
      <div class="ec-main"><div class="ec-grid">${grid}</div>
      <div class="ec-side">${info}
        <div class="ec-btns">
          ${s.started ? "" : `<button data-action="start">Start the attack clock</button>`}
          <button data-action="enter" ${sel ? "" : "disabled"}>Enter (+${b.enter} min)</button>
          ${here ? (this.searching ? `<span>Best Spot vs DC ${R.searchDC(t, p)}:</span><button data-action="found">Found</button><button data-action="nothing">Nothing</button>`
                                   : `<button data-action="quick">Quick search (+10)</button><button data-action="full">Full search (+${b.full})</button>`) : ""}
          ${t?.heavy && here ? `<button data-action="clearHeavy" data-quiet="0">Clear (1 h + event)</button><button data-action="clearHeavy" data-quiet="1">Clear quietly (4 h)</button>` : ""}
          ${t?.circle === "found" ? `<button data-action="destroyCircle">Destroy circle</button>` : ""}
          ${sel ? `<button data-action="reveal">${t.revealed ? "Hide tile" : "Reveal tile"}</button>` : ""}
        </div>
        <div class="ec-btns"><button data-action="time" data-min="10">+10 min</button><button data-action="time" data-min="60">+1 hour</button></div>
        <div class="ec-btns"><button data-action="convoy" data-n="-5">−5</button><button data-action="convoy" data-n="-1">−1</button><span>civilians</span><button data-action="convoy" data-n="1">+1</button><button data-action="convoy" data-n="5">+5</button><button data-action="deliver">Delivered</button></div>
        <div class="ec-btns">${s.headKilled ? "<em>The Cell Master is dead.</em>" : `<button data-action="head">Cell Master killed</button>`}<button data-action="regenerate">New map</button></div>
        <p class="ec-key">S square · H hall · ♔ king's cistern · ○ empty · ◐ other · B barracks · Z zone · z culled · ▓ heavy blockage · ▲ Overlook · ◌ circle (hidden) · ◉ found · ✕ destroyed · number = hidden finds · gold = party · light = revealed</p>
      </div></div></div>${STYLE}`;
  }
  _replaceHTML(result, content) { content.innerHTML = result; }
  _onClose(options) { super._onClose?.(options); CrawlPanel.instance = null; }

  static #select(event, target) { this.selected = target.dataset.tile; this.searching = false; this.render(); }
  static async #enter() { const s = getCrawl(); const k = this.selected ?? s.party; if (!k) return; await enter(s, k); this.searching = false; await save(s); }
  static #quick() { this.searching = true; this.render(); }
  static async #found() { const s = getCrawl(); const k = s.party; await tick(s, 10); await revealFind(s, k); s.tiles[k].searches += 1; this.searching = false; await save(s); }
  static async #nothing() { const s = getCrawl(); await tick(s, 10); s.tiles[s.party].searches += 1; this.searching = false; await save(s); }
  static async #full() { const s = getCrawl(); const k = s.party; await tick(s, R.band(s.convoy).full); while (s.tiles[k].finds > 0) await revealFind(s, k); await save(s); }
  static async #time(event, target) { const s = getCrawl(); await tick(s, Number(target.dataset.min)); await save(s); }
  static async #convoy(event, target) { const s = getCrawl(); s.convoy = Math.max(0, s.convoy + Number(target.dataset.n)); await save(s); }
  static async #deliver() { const s = getCrawl(); s.delivered += s.convoy; await whisper(`<p>${s.convoy} civilian(s) delivered to the king (${s.delivered} in all). 30+ before the recall earns a second wish; fewer than 10 counts toward the Elven path.</p>`); s.convoy = 0; await save(s); }
  static async #start() {
    const room = await foundry.applications.api.DialogV2.prompt({
      window: { title: "Start the attack clock" },
      content: `<p>Minutes of escape-room time when the party got out (the attack began at minute 40):</p><input type="number" name="room" value="60" min="40" max="120">`,
      ok: { label: "Start", callback: (event, button) => button.form.elements.room.valueAsNumber }, rejectClose: false
    });
    if (room == null || Number.isNaN(room)) return;
    const s = getCrawl(); s.started = true; s.minutes = 0; await tick(s, Math.max(0, room - 40)); await save(s);
  }
  static async #clearHeavy(event, target) {
    const s = getCrawl(), t = s.tiles[s.party], quiet = target.dataset.quiet === "1";
    await tick(s, quiet ? 240 : 60); t.heavy = false;
    if (!quiet) t.event = (await draw(`crawl-surface-p${R.phase(s)}`)).filter(Boolean).pop() ?? null;
    await save(s);
  }
  static async #destroyCircle() { const s = getCrawl(); const k = this.selected ?? s.party; s.tiles[k].circle = "destroyed"; await whisper(`<p>The small circle at ${k} is destroyed: it will never become a gathering zone.</p>`); await save(s); }
  static async #head() {
    const s = getCrawl(); s.headKilled = true;
    for (const t of Object.values(s.tiles)) { if (["hidden", "found", "active"].includes(t.circle)) t.circle = "fizzled"; if (t.zone === "active" || t.zone === "central") t.zone = "culled"; }
    await whisper("<p><strong>The Cell Master is dead.</strong> The attack ends and every circle fizzles. The party has earned an audience, and the king grants a wish for it.</p>");
    await save(s);
  }
  static async #reveal() { const s = getCrawl(); const t = s.tiles[this.selected ?? s.party]; t.revealed = !t.revealed; await save(s); }
  static async #regenerate() {
    if (getCrawl()) {
      const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "New map" }, content: "<p>Replace the current crawl with a new Edretnor?</p>", rejectClose: false });
      if (!ok) return;
    }
    this.selected = null; await newCrawl();
  }
}

const STYLE = `<style>
.edretnor-crawl .ec-top { display: flex; gap: 1.2em; flex-wrap: wrap; margin-bottom: 6px; }
.edretnor-crawl .ec-main { display: flex; gap: 10px; }
.edretnor-crawl .ec-grid { display: grid; grid-template-columns: repeat(11, 36px); grid-auto-rows: 36px; gap: 2px; flex: none; }
.edretnor-crawl .ec-grid button { position: relative; padding: 0; margin: 0; width: 36px; height: 36px; line-height: 1; border: 1px solid #0006; border-radius: 3px; font-size: 14px; color: #fff; }
.edretnor-crawl .ec-grid button.city { background: #4a3f36; } .edretnor-crawl .ec-grid button.wild { background: #2f4026; }
.edretnor-crawl .ec-grid button.rev.city { background: #8a7660; } .edretnor-crawl .ec-grid button.rev.wild { background: #5c7a48; }
.edretnor-crawl .ec-grid button.party { box-shadow: inset 0 0 0 3px #ffd25a; } .edretnor-crawl .ec-grid button.sel { outline: 2px solid #6cf; }
.edretnor-crawl .ec-grid i { position: absolute; top: 1px; right: 2px; font-style: normal; font-size: 10px; }
.edretnor-crawl .ec-grid small { position: absolute; bottom: 1px; right: 2px; font-size: 9px; opacity: .8; }
.edretnor-crawl .ec-side { flex: 1; min-width: 0; } .edretnor-crawl .ec-side h3 { margin: 0 0 4px; }
.edretnor-crawl .ec-btns { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin: 4px 0; }
.edretnor-crawl .ec-btns button { flex: none; width: auto; padding: 2px 8px; }
.edretnor-crawl .ec-key { font-size: 11px; opacity: .75; }
</style>`;
