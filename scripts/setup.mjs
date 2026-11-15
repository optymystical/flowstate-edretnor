// The GM's setup tools: roll a run's variables, the market's morning stock, and the Conservatory's lights.
import { draw, findTable, newCrawl } from "./crawl-panel.mjs";

const MODULE_ID = "flowstate-edretnor";
const { DialogV2 } = foundry.applications.api;
const gmIds = () => game.users.filter(u => u.isGM).map(u => u.id);

/** Draw a table quietly (no chat card); returns the result names. Resets tables that draw without replacement first if asked. */
async function quiet(key, n = 1, { reset = false } = {}) {
  const table = findTable(key); if (!table) return [`(missing table ${key})`];
  if (reset && !table.replacement) await table.resetResults();
  const out = [];
  for (let i = 0; i < n; i++) { const { results } = await table.draw({ displayChat: false }); out.push(...results.map(r => r.name || r.text || "")); }
  return out;
}
const roll = async f => (await new Roll(f).evaluate()).total;

/** The market's stock for one morning: the Uncommon rack, the jeweler and the apothecary. */
export async function marketMorning({ post = true } = {}) {
  const rack = await quiet("market-uncommon-rack", 4, { reset: true });
  const gems = await quiet("gem-common", await roll("1d3"));
  const [lh, le, h, e] = [await roll("1d4"), await roll("1d4"), await roll("1d2"), await roll("1d2")];
  const html = `<h3>The market this morning</h3><p><strong>Uncommon rack (Grade 5):</strong> ${rack.join("; ")}.</p>
    <p><strong>The jeweler (200 each):</strong> ${gems.join(", ")}.</p>
    <p><strong>The apothecary:</strong> ${lh} Lesser Health, ${le} Lesser Energy (200 each); ${h} Health, ${e} Energy (500 each). Greater potions by commission (1,200, ready next morning).</p>`;
  if (post) await ChatMessage.create({ content: html, whisper: gmIds(), speaker: { alias: "Edretnor Market" } });
  return html;
}

/** Roll everything a run needs: the Conservatory's variants, a fresh crawl map and the Day 1 market. Writes it all to a journal. */
export async function prepareRun() {
  if (!game.user.isGM) return;
  const players = await DialogV2.prompt({
    window: { title: "Edretnor Setup" },
    content: `<p>This rolls the Conservatory's variants, generates a new Edretnor for the crawl (replacing any current one) and stocks the Day 1 market.</p>
      <label>Players (one Seed Vault each): <input type="number" name="n" value="4" min="1" max="5"></label>`,
    ok: { label: "Roll the run", callback: (event, button) => button.form.elements.n.valueAsNumber }, rejectClose: false
  });
  if (!players) return;
  const plants = await quiet("r3-seed-vault-plants", Math.min(5, players), { reset: true });
  const [fuses] = await quiet("r3-fuse-spots"), [sockets] = await quiet("r3-socket-mapping"), [valves] = await quiet("r3-valve-order");
  const [jar] = await quiet("r3-seed-jar"), [specimen] = await quiet("r3-omen-specimen"), [bloom] = await quiet("r3-bloom-condition");
  const describe = (key, name) => findTable(key)?.results.find(r => r.name === name)?.description ?? "";
  const crawl = await newCrawl();
  const king = Object.entries(crawl.tiles).find(([, t]) => t.cistern === "king")[0];
  const market = await marketMorning({ post: false });
  const html = `<h2>Round 3: the Conservatory</h2><ul>
    ${plants.map((p, i) => `<li><strong>Seed Vault ${i + 1}:</strong> ${p}. ${describe("r3-seed-vault-plants", p)}</li>`).join("")}
    <li><strong>Fuses:</strong> ${describe("r3-fuse-spots", fuses)}</li>
    <li><strong>Sockets:</strong> ${sockets}: ${describe("r3-socket-mapping", sockets)}</li>
    <li><strong>Valves:</strong> ${describe("r3-valve-order", valves)}</li>
    <li><strong>Living seed:</strong> ${jar}.</li><li><strong>Specimen:</strong> ${specimen}.</li><li><strong>Bloom condition:</strong> ${bloom}.</li></ul>
    <h2>The crawl</h2><p>A new Edretnor: the king is in the cistern at <strong>${king}</strong>. Everything else is on the Crawl Panel (the <em>Edretnor: Crawl Panel</em> macro).</p>
    <h2>Day 1</h2>${market}<p>Run <em>Edretnor: Market Morning</em> again on Days 2 and 3.</p>`;
  await writeRunJournal(html);
  ui.notifications.info("Edretnor: the run is rolled. See the journal \"Edretnor: This Run\".");
}

async function writeRunJournal(html) {
  const name = "Edretnor: This Run";
  let entry = game.journal.find(j => j.flags?.[MODULE_ID]?.thisRun);
  const page = { name: `Rolled ${new Date().toLocaleString()}`, type: "text", text: { format: 1, content: html } };
  if (!entry) entry = await JournalEntry.create({ name, flags: { [MODULE_ID]: { thisRun: true } }, folder: game.folders.find(f => f.type === "JournalEntry" && f.name === "The Fall of Edretnor")?.id ?? null });
  await entry.createEmbeddedDocuments("JournalEntryPage", [page]);
  entry.sheet.render({ force: true });
}

// ---- the Conservatory's lights ----
const FACETS = ["dawn", "noon", "dusk", "night", "bloom"];
const conservatory = () => game.scenes.find(s => s.flags?.[MODULE_ID]?.conservatory);
/** Turn on the lights of a facet ("dawn", "noon", "dusk", "night", "bloom"), or "reset" to turn every facet light off. */
export async function lightFacet(facet) {
  const scene = conservatory(); if (!scene) return ui.notifications.warn("Edretnor: the Conservatory scene isn't in this world.");
  const updates = scene.lights.filter(l => l.flags?.[MODULE_ID]?.state).map(l => {
    const state = l.flags[MODULE_ID].state;
    return { _id: l.id, hidden: facet === "reset" ? true : (state === facet ? false : l.hidden) };
  });
  await scene.updateEmbeddedDocuments("AmbientLight", updates);
  if (facet === "dawn") ui.notifications.info("Dawn lit: the sun-lamps blaze and Locker A opens.");
  if (facet === "dusk") ui.notifications.info("Dusk lit: Locker B opens and the North gate unseals (open its door).");
}
export async function lightFacetDialog() {
  const buttons = [...FACETS, "reset"].map(f => ({ action: f, label: f === "reset" ? "Reset (all dark)" : f === "bloom" ? "Moon Lily bloom" : `${f[0].toUpperCase()}${f.slice(1)}`, callback: () => f }));
  const facet = await DialogV2.wait({ window: { title: "Conservatory: light a facet" }, content: "<p>Which facet just lit?</p>", buttons, rejectClose: false });
  if (facet) await lightFacet(facet);
}
