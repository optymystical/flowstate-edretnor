// The Round 2 panel (GM): the conveyor carries the protected ally 20 ft at the start of every round, the waves come out of their pens
// on schedule (rounds 3, 6 and 9, Blackwell at 13), Force can't move the ally off the track, and the run's distance is recorded.
// Positions come from dev/maps/round2.py: 100 px squares, the track at y = 8 from x = 4 (0 yd) to x = 64 (100 yd).
const MODULE_ID = "flowstate-edretnor";
const G = 100, X0 = 4, X1 = 64, Y = 8, STEP = 4;          // 20 ft = 4 squares a round
const WAVES = [
  { round: 3, name: "Wave 1: locals", pen: 18, keys: ["r2-local-brawler", "r2-local-hedge-mage", "r2-local-devotee"] },
  { round: 6, name: "Wave 2: tournament staff", pen: 30, keys: ["r2-swift-duelist", "r2-charm-mage", "r2-pyre-adept"] },
  { round: 9, name: "Wave 3: the King's Guard", pen: 42, keys: ["r2-kg-halberdier", "r2-kg-ward-mage", "r2-kg-gravedeacon"] },
  { round: 13, name: "The finale: Blackwell", mark: [55, 4], keys: ["r2-blackwell"] }
];
const RIVALS = [["the favorites", 78], ["the Fire Walkers", 72], ["the College apprentices", 70], ["the Halflings", 65]];

export const registerRound2Settings = () =>
  game.settings.register(MODULE_ID, "round2", { scope: "world", config: false, type: Object, default: {} });
const state = () => foundry.utils.deepClone(game.settings.get(MODULE_ID, "round2") ?? {});
const save = async s => { await game.settings.set(MODULE_ID, "round2", s); Round2Panel.instance?.render(); };
const scene = () => game.scenes.find(s => s.flags?.[MODULE_ID]?.round2);
const actorFor = key => game.actors.find(a => a.flags?.[MODULE_ID]?.key === key);
const gmIds = () => game.users.filter(u => u.isGM).map(u => u.id);
const note = content => ChatMessage.create({ content: `<p>${content}</p>`, whisper: gmIds(), speaker: { alias: "Round 2" } });
const allyToken = s => s.ally ? scene()?.tokens.get(s.ally) : null;
const yardsAt = x => Math.max(0, Math.round(((x - X0) * 5) / 3));            // squares past the start → yards
const centerX = t => (t.x + (t.width * G) / 2) / G;

/** Put the ally on the conveyor at the right spot for this round (the conveyor is the only thing that moves them). */
async function placeAlly(s, round) {
  const t = allyToken(s); if (!t) return;
  const sq = Math.min(X1, X0 + STEP * Math.max(0, round));
  await t.update({ x: Math.round(sq * G - (t.width * G) / 2), y: Math.round(Y * G - (t.height * G) / 2) }, { edretnorConveyor: true, animate: true });
}
async function openPen(x) {
  const sc = scene();
  const doors = sc.walls.filter(w => w.door && [5.4, 10.6].some(gy => Math.abs((w.c[1] + w.c[3]) / 2 - gy * G) < 20) && Math.abs((w.c[0] + w.c[2]) / 2 - x * G) < 30);
  if (doors.length) await sc.updateEmbeddedDocuments("Wall", doors.map(w => ({ _id: w.id, ds: 1 })));
}
async function spawn(s, wave) {
  const sc = scene(); if (!sc) return;
  const spots = wave.mark ? [wave.mark] : [[wave.pen - 1, 4.2], [wave.pen + 1, 4.2], [wave.pen, 11.8]];
  const data = [];
  for (const [i, key] of wave.keys.entries()) {
    const a = actorFor(key); if (!a) continue;
    const [x, y] = spots[i]; const w = a.prototypeToken.width * G;
    const td = await a.getTokenDocument({ x: Math.round(x * G - w / 2), y: Math.round(y * G - w / 2) });
    data.push(foundry.utils.mergeObject(td.toObject(), { flags: { [MODULE_ID]: { round2Wave: wave.round } } }));
  }
  const made = await sc.createEmbeddedDocuments("Token", data);
  if (wave.pen) await openPen(wave.pen);
  if (game.combat && game.combat.scene?.id === sc.id) await game.combat.createEmbeddedDocuments("Combatant", made.map(t => ({ tokenId: t.id, sceneId: sc.id, actorId: t.actorId })));
  s.spawned = [...(s.spawned ?? []), wave.round];
  await note(`<strong>${wave.name}</strong> ${wave.mark ? "steps onto the track" : "comes out of the pens"} and focuses the protected ally.${game.combat ? " Added to the combat: roll their initiative." : ""}${wave.round === 13 ? " One round of multiple Supernatural attacks; if the ally survives it: \"You're free to go then.\"" : ""}`);
}
/** Start of each round: move the conveyor, then bring out any wave due. */
async function onRound(combat, changed) {
  if (!game.user.isActiveGM || !("round" in changed)) return;
  const s = state(); if (!s.ally || s.result || combat.scene?.id !== scene()?.id) return;
  await placeAlly(s, combat.round);
  for (const w of WAVES) if (combat.round >= w.round && !(s.spawned ?? []).includes(w.round)) await spawn(s, w);
  await save(s);
  const t = allyToken(s);
  if (t && centerX(t) >= X1) await note("The ally reaches the end of the track: 100 yards.");
}

export function registerRound2Hooks() {
  Hooks.on("updateCombat", (c, ch) => onRound(c, ch).catch(err => console.error(`${MODULE_ID} | Round 2`, err)));
  // The organizers rule that Force can't move the ally off the track: only the conveyor moves them while they're fastened.
  Hooks.on("preUpdateToken", (token, changes, options) => {
    const s = game.settings.get(MODULE_ID, "round2");
    if (!s?.ally || s.result || token.id !== s.ally || options.edretnorConveyor) return;
    if ("x" in changes || "y" in changes) { delete changes.x; delete changes.y; if (game.user.isGM) ui.notifications.info("The conveyor holds the ally: only it moves them (Unfasten in the Round 2 panel to move them yourself)."); }
  });
}

export class Round2Panel extends foundry.applications.api.ApplicationV2 {
  static instance = null;
  static DEFAULT_OPTIONS = {
    id: "edretnor-round2-panel", tag: "section", classes: ["edretnor-round2"],
    window: { title: "Round 2: The Protection Run", icon: "fa-solid fa-route", resizable: true },
    position: { width: 520, height: "auto" },
    actions: { fasten: Round2Panel.#fasten, unfasten: Round2Panel.#unfasten, spawn: Round2Panel.#spawn, record: Round2Panel.#record, reset: Round2Panel.#reset }
  };
  static open() { if (!game.user.isGM) return ui.notifications.warn("The Round 2 panel is for the GM."); (Round2Panel.instance ??= new Round2Panel()).render({ force: true }); return Round2Panel.instance; }

  async _renderHTML() {
    const s = state(), t = allyToken(s), round = game.combat?.started && game.combat.scene?.id === scene()?.id ? game.combat.round : 0;
    const yards = t ? yardsAt(centerX(t)) : 0, hp = t?.actor?.system.hp;
    const lost = t && s.startHp != null ? Math.max(0, s.startHp - hp.value) : 0;
    const rows = WAVES.map(w => `<tr><td>Round ${w.round}</td><td>${w.name}</td><td>${(s.spawned ?? []).includes(w.round) ? "✔ out" : `<button data-action="spawn" data-round="${w.round}">Send now</button>`}</td></tr>`).join("");
    const result = s.result ? `<p class="r2-res">Recorded: <strong>${s.result.yards} yards</strong>, ${s.result.lost} damage taken.</p>` : "";
    return `${t ? `<p>Protected ally: <strong>${t.name}</strong> · <strong>${yards} yd</strong> · round ${round} · damage taken <strong>${lost}</strong>${hp ? ` (${hp.value} HP left)` : ""}</p>
        <p><button data-action="unfasten">Unfasten</button> <button data-action="record">Record the result</button></p>`
      : `<p>Select the protected ally's token on the Round 2 scene, then <button data-action="fasten">Fasten to the conveyor</button></p>`}
      ${result}
      <table class="r2">${rows}</table>
      <p><small>Start combat on this scene with the party. At the start of each round the conveyor moves the ally 20 ft (to 20 ft × the round),
      and each wave comes out of its pens on its round (added to the combat). Force can't move the ally while fastened.
      Rivals: ${RIVALS.map(([n, y]) => `${n} ${y}`).join(", ")} yards; 79+ takes first. Damage taken breaks ties.</small></p>
      <p><button data-action="reset">Reset the run</button></p>
      <style>.edretnor-round2 table.r2 { width: 100%; } .edretnor-round2 td { padding: 2px 4px; } .edretnor-round2 button { width: auto; padding: 1px 8px; }</style>`;
  }
  _replaceHTML(result, content) { content.innerHTML = result; }
  _onClose(options) { super._onClose?.(options); Round2Panel.instance = null; }

  static async #fasten() {
    const t = canvas.tokens.controlled[0]?.document;
    if (!t || t.parent.id !== scene()?.id) return ui.notifications.warn("Select the protected ally's token on the Round 2 scene first.");
    const s = { ally: t.id, startHp: t.actor?.system.hp.value ?? null, spawned: [] };
    await save(s); await placeAlly(s, game.combat?.started ? game.combat.round : 0);
    await note(`<strong>${t.name}</strong> is fastened to the conveyor: legs bound, hands free, and they can only affect themselves.`);
  }
  static async #unfasten() { const s = state(); delete s.ally; await save(s); }
  static async #spawn(event, target) { const s = state(); const w = WAVES.find(x => x.round === Number(target.dataset.round)); await spawn(s, w); await save(s); }
  static async #record() {
    const s = state(), t = allyToken(s); if (!t) return;
    const yards = yardsAt(centerX(t)), lost = s.startHp != null ? Math.max(0, s.startHp - t.actor.system.hp.value) : 0;
    s.result = { yards, lost }; await save(s);
    const beat = RIVALS.filter(([, y]) => yards > y).map(([n]) => n);
    await note(`<strong>Round 2 result:</strong> ${yards} yards, ${lost} damage taken. ${yards >= 79 ? "First place." : beat.length ? `Ahead of ${beat.join(", ")}.` : "Behind every rival team."}`);
  }
  static async #reset() {
    const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Reset the run" }, content: "<p>Remove the wave tokens, close the pens and clear the result?</p>", rejectClose: false });
    if (!ok) return;
    const sc = scene();
    if (sc) {
      const ids = sc.tokens.filter(t => t.flags?.[MODULE_ID]?.round2Wave).map(t => t.id);
      if (ids.length) await sc.deleteEmbeddedDocuments("Token", ids);
      const doors = sc.walls.filter(w => w.door && w.ds === 1);
      if (doors.length) await sc.updateEmbeddedDocuments("Wall", doors.map(w => ({ _id: w.id, ds: 0 })));
    }
    await save({});
  }
}
