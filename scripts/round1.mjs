// The Round 1 panel (GM): launch each projectile into the flight lane, record whether the party got it, and keep the score.
const MODULE_ID = "flowstate-edretnor";
const G = 100;                                   // px per square on the Round 1 scene (dev/maps/round1.py)
const LANE_Y = 14;                               // the flight lane's centerline, 20-30 ft out from the contestant line

export const LAUNCHES = [
  { key: "fieldstone", label: "1. Fieldstone" },
  { key: "hailshot", label: "2. Hailshot", count: 10 },
  { key: "ironheart", label: "3. Ironheart" },
  { key: "skyglass", label: "4. Skyglass" },
  { key: "wardwing", label: "5. Wardwing", note: "Flit and Ward 15 automatic, per turn" },
  { key: "snapshot", label: "6. Snapshot", note: "launch it mid-turn; gone when the turn ends; the active character can't hit it" },
  { key: "veiledwisp", label: "7. Veiled Wisp", hidden: true, note: "placed hidden; Reveal once it's spotted" },
  { key: "lantern", label: "8. Festival Lantern", note: "protect it; success = it survives" },
  { key: "geode", label: "9. Geode", note: "the shell soaks automatically" },
  { key: "heartstone", label: "10. Heartstone", note: "rune rerolls each turn; wrong category ×0.25; 3 rounds" }
];
const RIVALS = "Rivals: the favorites 8, the College apprentices 7, the Halflings 6, the Fire Walkers 6. 9 or more takes first place.";

export const registerRound1Settings = () =>
  game.settings.register(MODULE_ID, "round1", { scope: "world", config: false, type: Object, default: {} });
const state = () => foundry.utils.deepClone(game.settings.get(MODULE_ID, "round1") ?? {});
const actorFor = key => game.actors.find(a => a.flags?.[MODULE_ID]?.projectile === key);
const sceneR1 = () => game.scenes.find(s => s.flags?.[MODULE_ID]?.round1);

/** Put a projectile (or all 10 Hailshot pebbles, or one breaker shot) into the flight lane on the Round 1 scene. */
export async function launch(key, { count = 1, hidden = false, at = null } = {}) {
  const scene = sceneR1(), actor = actorFor(key);
  if (!scene || !actor) return ui.notifications.warn("Edretnor: import the Round 1 scene and projectiles first.");
  if (SPECIAL[key]) await actor.update({ "system.hp.value": actor.system.hp.max, [`flags.${MODULE_ID}.r1`]: SPECIAL[key].start() });
  if (canvas.scene?.id !== scene.id) ui.notifications.info("The projectile is on the Round 1 scene; view it to see it.");
  const w = actor.prototypeToken.width * G;
  const spots = count > 1 ? Array.from({ length: count }, (_, i) => [14 + i * 1.0, LANE_Y + (i % 2 ? 0.6 : -0.6)]) : [at ?? [18, LANE_Y]];
  const data = [];
  for (const [x, y] of spots) {
    const t = await actor.getTokenDocument({ x: Math.round(x * G - w / 2), y: Math.round(y * G - w / 2), hidden });
    data.push(foundry.utils.mergeObject(t.toObject(), { flags: { [MODULE_ID]: { round1Launch: key, turn: turnKey() } } }));
  }
  await scene.createEmbeddedDocuments("Token", data);
  if (key === "heartstone") await gmNote(`The Heartstone is up for 3 rounds. Its rune shows <strong>${actor.getFlag(MODULE_ID, "r1")?.rune}</strong> (a Spot, DC 10, reads it). Each new turn rerolls the rune.`);
}
/** Remove every launched projectile from the Round 1 scene. */
export async function clearLaunch() {
  const scene = sceneR1(); if (!scene) return;
  const ids = scene.tokens.filter(t => t.flags?.[MODULE_ID]?.round1Launch).map(t => t.id);
  if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
}

// ---- the gimmicks, automated ----
// The system posts a hit's damage card (flags.flowstate.damage: target, type, attacker) and then lowers the target's HP. preUpdateActor
// catches that HP change on the client making it and adjusts it: Wardwing's Flit and Ward, the Geode's shell, the Heartstone's rune and
// Snapshot taking reactions only. Wardwing, the Geode and the Heartstone have linked tokens so their state lives on the actor.
const gmIds = () => game.users.filter(u => u.isGM).map(u => u.id);
const gmNote = content => ChatMessage.create({ content: `<p>${content}</p>`, whisper: gmIds(), speaker: { alias: "Round 1" } });
const turnKey = () => game.combat?.started ? `${game.combat.id}:${game.combat.round}:${game.combat.turn}` : "none";
const RUNES = ["Physical", "Elemental", "Magical"];
const rollRune = () => RUNES[Math.floor(Math.random() * 3)];
const SPECIAL = {
  wardwing: { start: () => ({ key: null, flit: null, ward: 15 }) },
  geode: { start: () => ({ shell: 100 }) },
  heartstone: { start: () => ({ rune: rollRune(), round: game.combat?.round ?? 0 }) },
  snapshot: { start: () => ({}) }
};
/** The most recent damage card aimed at this actor (posted just before its HP changes). */
function lastDamage(actor) {
  const msgs = game.messages.contents;
  for (let i = msgs.length - 1, n = 0; i >= 0 && n < 25; i--, n++) {
    const d = msgs[i].flags?.flowstate?.damage;
    if (d && (d.target === actor.uuid || d.target?.endsWith?.(`Actor.${actor.id}`))) return { id: msgs[i].id, ...d };
  }
  return null;
}
/** Physical, Elemental or Magical for the Heartstone (all Magic damage counts as Magical). */
function category(dmg) {
  const def = game.messages.get(dmg.defenseMessage)?.flags?.flowstate?.defense;
  const atk = def ? game.messages.get(def.attackMessage)?.flags?.flowstate?.attack : null;
  if (atk?.opts?.spell) return "Magical";
  if (dmg.type === "physical") return "Physical";
  if (["arcane", "supernatural"].includes(dmg.type)) return "Magical";
  return "Elemental";
}
function adjustHit(actor, changes) {
  const key = actor.flags?.[MODULE_ID]?.projectile;
  if (!SPECIAL[key]) return;
  const flat = "system.hp.value" in changes;            // the change may arrive flattened or expanded
  const next = flat ? changes["system.hp.value"] : foundry.utils.getProperty(changes, "system.hp.value");
  if (next === undefined) return;
  const old = actor.system.hp.value, dmg = old - next;
  if (!(dmg > 0)) return;
  const hit = lastDamage(actor);
  const st = foundry.utils.deepClone(actor.flags[MODULE_ID].r1 ?? SPECIAL[key].start());
  let take = dmg, note = null;
  if (key === "wardwing") {
    const k = turnKey();
    if (st.key !== k) Object.assign(st, { key: k, flit: null, ward: 15 });
    if (!st.flit || (hit && st.flit === hit.id)) { st.flit = hit?.id ?? "?"; take = 0; note = `Wardwing <strong>Flits</strong>: the first hit this turn misses it (${dmg} cancelled).`; }
    else { const soak = Math.min(st.ward, dmg); st.ward -= soak; take = dmg - soak; if (soak) note = `Wardwing's Ward soaks ${soak} (${st.ward} left this turn); it takes ${take}.`; }
  } else if (key === "geode") {
    const limit = hit?.type === "physical" ? 20 : 7, soak = Math.min(dmg, limit, st.shell);
    st.shell -= soak; take = dmg - soak;
    if (soak) note = `The Geode's shell takes ${soak} (Limit ${limit} vs ${hit?.type ?? "this damage"}; ${st.shell} shell left); ${take} reaches the core.`;
  } else if (key === "heartstone") {
    const cat = hit ? category(hit) : null;
    if (cat && cat !== st.rune) { take = Math.floor(dmg * 0.25); note = `The Heartstone's rune shows ${st.rune}: ${cat} damage is doubly Weakened, ${dmg} → ${take}.`; }
  } else if (key === "snapshot") {
    const current = game.combat?.combatant?.actor?.uuid;
    if (hit && current && hit.attacker === current) { take = 0; note = "Only reactions can hit Snapshot: an attack on your own turn doesn't count."; }
  }
  if (flat) changes["system.hp.value"] = old - take; else foundry.utils.setProperty(changes, "system.hp.value", old - take);
  foundry.utils.setProperty(changes, `flags.${MODULE_ID}.r1`, st);
  if (note) gmNote(note);
}
/** Each new turn: the Heartstone's rune changes and its 3 rounds are counted; Snapshot is gone once the turn it was launched in ends. */
async function onTurn(combat, changed) {
  if (!game.user.isActiveGM || !("turn" in changed || "round" in changed)) return;
  const scene = sceneR1(); if (!scene) return;
  for (const t of scene.tokens.filter(t => t.flags?.[MODULE_ID]?.round1Launch === "snapshot" && t.flags[MODULE_ID].turn !== turnKey())) {
    await t.delete(); await gmNote("Snapshot's turn is over: it falls.");
  }
  const hs = actorFor("heartstone");
  if (hs && scene.tokens.some(t => t.flags?.[MODULE_ID]?.round1Launch === "heartstone")) {
    const st = { ...(hs.getFlag(MODULE_ID, "r1") ?? {}), rune: rollRune() };
    await hs.setFlag(MODULE_ID, "r1", st);
    const up = combat.round - (st.round ?? combat.round);
    await gmNote(up >= 3 ? `The Heartstone has been up 3 rounds: it lands (${hs.system.hp.value} health left).` : `The Heartstone's rune now shows <strong>${st.rune}</strong> (Spot DC 10 to read).`);
  }
}
export function registerRound1Hooks() {
  Hooks.on("preUpdateActor", (actor, changes) => { try { adjustHit(actor, changes); } catch (err) { console.error(`${MODULE_ID} | Round 1`, err); } });
  Hooks.on("updateCombat", (combat, changed) => onTurn(combat, changed).catch(err => console.error(`${MODULE_ID} | Round 1`, err)));
}
/** The breaker shots still in the air hit the Festival Lantern: 3d10 each. */
export async function landShots() {
  const scene = sceneR1(); if (!scene) return;
  const shots = scene.tokens.filter(t => t.flags?.[MODULE_ID]?.round1Launch === "breakershot");
  const lantern = scene.tokens.find(t => t.flags?.[MODULE_ID]?.round1Launch === "lantern");
  const live = shots.filter(t => (t.actor?.system.hp.value ?? 0) > 0);
  let total = 0; const rolls = [];
  for (let i = 0; i < live.length; i++) { const r = await new Roll("3d10").evaluate(); rolls.push(r); total += r.total; }
  if (lantern && total) await lantern.actor.update({ "system.hp.value": lantern.actor.system.hp.value - total });
  if (shots.length) await scene.deleteEmbeddedDocuments("Token", shots.map(t => t.id));
  await ChatMessage.create({ rolls, whisper: gmIds(), speaker: { alias: "Round 1" },
    content: `<p><strong>Breaker shots:</strong> ${shots.length - live.length} shot down, ${live.length} land${live.length === 1 ? "s" : ""} on the Festival Lantern${live.length ? ` for ${rolls.map(r => r.total).join(" + ")} = <strong>${total}</strong>` : ""}. The lantern has ${lantern ? lantern.actor.system.hp.value : "?"} health left.</p>` });
}
/** Reveal the Veiled Wisp (to everyone; it's been spotted). */
export async function revealWisp() {
  const t = sceneR1()?.tokens.find(t => t.flags?.[MODULE_ID]?.round1Launch === "veiledwisp");
  if (t) await t.update({ hidden: false });
}

export class Round1Panel extends foundry.applications.api.ApplicationV2 {
  static instance = null;
  static DEFAULT_OPTIONS = {
    id: "edretnor-round1-panel", tag: "section", classes: ["edretnor-round1"],
    window: { title: "Round 1: The Projectile Shoot", icon: "fa-solid fa-bullseye", resizable: true },
    position: { width: 560, height: "auto" },
    actions: { launch: Round1Panel.#launch, shot: Round1Panel.#shot, land: () => landShots(), reveal: () => revealWisp(), score: Round1Panel.#score, clear: Round1Panel.#clear, reset: Round1Panel.#reset }
  };
  static open() { if (!game.user.isGM) return ui.notifications.warn("The Round 1 panel is for the GM."); (Round1Panel.instance ??= new Round1Panel()).render({ force: true }); return Round1Panel.instance; }

  async _renderHTML() {
    const s = state(), results = s.results ?? {};
    const score = Object.values(results).filter(Boolean).length, done = Object.keys(results).length;
    const rows = LAUNCHES.map(l => {
      const r = results[l.key];
      const mark = r === true ? `<span class="ok">✔ got it</span>` : r === false ? `<span class="no">✘ missed</span>` : "";
      return `<tr><td><strong>${l.label}</strong>${l.note ? `<br><small>${l.note}</small>` : ""}</td>
        <td><button data-action="launch" data-key="${l.key}">Launch</button>${l.key === "lantern" ? ` <button data-action="shot">+ Breaker shot</button> <button data-action="land">Shots land</button>` : ""}${l.key === "veiledwisp" ? ` <button data-action="reveal">Reveal</button>` : ""}</td>
        <td><button data-action="score" data-key="${l.key}" data-ok="1">Got it</button> <button data-action="score" data-key="${l.key}" data-ok="0">Missed</button></td><td>${mark}</td></tr>`;
    }).join("");
    return `<p class="r1-score">Score: <strong>${score}</strong> of ${done} so far (10 launches). <small>${RIVALS}</small></p>
      <table class="r1">${rows}</table>
      <p class="r1-btns"><button data-action="clear">Clear the lane</button> <button data-action="reset">Reset the score</button></p>
      <p><small>Each launch goes up at the top of a round; the next round is the off-turn. Attacks on a projectile resolve against its fixed dodge.
      Recording a result clears the lane.</small></p>
      <style>.edretnor-round1 table.r1 { width: 100%; } .edretnor-round1 td { padding: 3px 4px; vertical-align: middle; }
      .edretnor-round1 button { width: auto; padding: 1px 8px; } .edretnor-round1 .ok { color: #5c5; } .edretnor-round1 .no { color: #d66; }</style>`;
  }
  _replaceHTML(result, content) { content.innerHTML = result; }
  _onClose(options) { super._onClose?.(options); Round1Panel.instance = null; }

  static async #launch(event, target) {
    const l = LAUNCHES.find(x => x.key === target.dataset.key);
    await clearLaunch(); await launch(l.key, { count: l.count ?? 1, hidden: !!l.hidden });
  }
  static async #shot() {
    const n = sceneR1()?.tokens.filter(t => t.flags?.[MODULE_ID]?.round1Launch === "breakershot").length ?? 0;
    await launch("breakershot", { at: [12 + n * 2.4, 9] });
  }
  static async #score(event, target) {
    const s = state(); s.results = { ...(s.results ?? {}), [target.dataset.key]: target.dataset.ok === "1" };
    await game.settings.set(MODULE_ID, "round1", s); await clearLaunch();
    const score = Object.values(s.results).filter(Boolean).length;
    await ChatMessage.create({ content: `<p><strong>Round 1:</strong> ${LAUNCHES.find(x => x.key === target.dataset.key).label} — ${target.dataset.ok === "1" ? "got it" : "missed"}. Score ${score} of ${Object.keys(s.results).length}.</p>`,
      whisper: game.users.filter(u => u.isGM).map(u => u.id), speaker: { alias: "Round 1" } });
    this.render();
  }
  static async #clear() { await clearLaunch(); }
  static async #reset() {
    const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Reset the score" }, content: "<p>Clear every Round 1 result?</p>", rejectClose: false });
    if (!ok) return; await game.settings.set(MODULE_ID, "round1", {}); await clearLaunch(); this.render();
  }
}
