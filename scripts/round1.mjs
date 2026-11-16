// The Round 1 panel (GM): launch each projectile into the flight lane, record whether the party got it, and keep the score.
const MODULE_ID = "flowstate-edretnor";
const G = 100;                                   // px per square on the Round 1 scene (dev/maps/round1.py)
const LANE_Y = 14;                               // the flight lane's centerline, 20-30 ft out from the contestant line

export const LAUNCHES = [
  { key: "fieldstone", label: "1. Fieldstone" },
  { key: "hailshot", label: "2. Hailshot", count: 10 },
  { key: "ironheart", label: "3. Ironheart" },
  { key: "skyglass", label: "4. Skyglass" },
  { key: "wardwing", label: "5. Wardwing" },
  { key: "snapshot", label: "6. Snapshot", note: "only reactions can hit it" },
  { key: "veiledwisp", label: "7. Veiled Wisp", hidden: true, note: "placed hidden" },
  { key: "lantern", label: "8. Festival Lantern", note: "protect it; success = it survives" },
  { key: "geode", label: "9. Geode" },
  { key: "heartstone", label: "10. Heartstone", note: "up for 3 turns" }
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
  if (canvas.scene?.id !== scene.id) ui.notifications.info("The projectile is on the Round 1 scene; view it to see it.");
  const w = actor.prototypeToken.width * G;
  const spots = count > 1 ? Array.from({ length: count }, (_, i) => [14 + i * 1.0, LANE_Y + (i % 2 ? 0.6 : -0.6)]) : [at ?? [18, LANE_Y]];
  const data = [];
  for (const [x, y] of spots) {
    const t = await actor.getTokenDocument({ x: Math.round(x * G - w / 2), y: Math.round(y * G - w / 2), hidden });
    data.push(foundry.utils.mergeObject(t.toObject(), { flags: { [MODULE_ID]: { round1Launch: key } } }));
  }
  await scene.createEmbeddedDocuments("Token", data);
}
/** Remove every launched projectile from the Round 1 scene. */
export async function clearLaunch() {
  const scene = sceneR1(); if (!scene) return;
  const ids = scene.tokens.filter(t => t.flags?.[MODULE_ID]?.round1Launch).map(t => t.id);
  if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
}

export class Round1Panel extends foundry.applications.api.ApplicationV2 {
  static instance = null;
  static DEFAULT_OPTIONS = {
    id: "edretnor-round1-panel", tag: "section", classes: ["edretnor-round1"],
    window: { title: "Round 1: The Projectile Shoot", icon: "fa-solid fa-bullseye", resizable: true },
    position: { width: 560, height: "auto" },
    actions: { launch: Round1Panel.#launch, shot: Round1Panel.#shot, score: Round1Panel.#score, clear: Round1Panel.#clear, reset: Round1Panel.#reset }
  };
  static open() { if (!game.user.isGM) return ui.notifications.warn("The Round 1 panel is for the GM."); (Round1Panel.instance ??= new Round1Panel()).render({ force: true }); return Round1Panel.instance; }

  async _renderHTML() {
    const s = state(), results = s.results ?? {};
    const score = Object.values(results).filter(Boolean).length, done = Object.keys(results).length;
    const rows = LAUNCHES.map(l => {
      const r = results[l.key];
      const mark = r === true ? `<span class="ok">✔ got it</span>` : r === false ? `<span class="no">✘ missed</span>` : "";
      return `<tr><td><strong>${l.label}</strong>${l.note ? `<br><small>${l.note}</small>` : ""}</td>
        <td><button data-action="launch" data-key="${l.key}">Launch</button>${l.key === "lantern" ? ` <button data-action="shot">+ Breaker shot</button>` : ""}</td>
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
