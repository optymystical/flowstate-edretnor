// Round 1's projectiles (project doc round1-projectiles). Each has the system's fixed dodge (flags.flowstate.fixedDodge, v0.99.0):
// an attack hits on a total at or above the value and crits at double. Health comes from Con alone (HP = (Con + Will + Build) × Size × 3,
// no skill points so no stat bonus), with Max HP lost trimming it to the exact number. The Round 1 panel launches them.
import { npc, bio } from "./npc.mjs";
import { F } from "../folders.mjs";
import { MODULE_ID } from "../common.mjs";

const folder = F.actorsRound1._id;
const RULE = "Fixed dodge: an attack hits on a total at or above the value and crits at double (a d15 can't crit a value of 8 or more). Nothing modifies the value. One turn in the air unless noted.";

function projectile({ key, name, value, hp, size, disposition = -1, token = 0.5, sort, role, notes }) {
  const mult = size * 3, con = Math.ceil(hp / mult), lost = con * mult - hp;
  const a = npc({ key: `projectile-${key}`, name, img: `projectile_${key}`, folder, sort, size, sp: 0, stats: { con }, sapience: 0,
    disposition, trees: {}, bio: bio(role, { "How it works": `Fixed dodge <strong>${value}</strong>, <strong>${hp}</strong> health. ${RULE}`, ...notes }) });
  a.system.hp = { value: hp, lost };
  a.flags.flowstate.fixedDodge = { on: true, value };
  a.flags[MODULE_ID] = { projectile: key };
  const sq = Math.max(token, a.prototypeToken.width);
  Object.assign(a.prototypeToken, { width: sq, height: sq, displayBars: 30, displayName: 30 });
  return a;
}

export const PROJECTILES = [
  projectile({ key: "fieldstone", name: "Fieldstone", value: 4, hp: 80, size: 2, sort: 100, role: "Launch 1: a clay and stone disc.", notes: { Gimmick: "None: it teaches the baseline." } }),
  projectile({ key: "hailshot", name: "Hailshot pebble", value: 4, hp: 12, size: 1, sort: 200, role: "Launch 2: one of 10 pebbles fired together.",
    notes: { Gimmick: "All 10 must be destroyed. They fly within 20–30 ft of the contestant line, so Mental Area attacks, Magic Area spells and Blast weapons reach them. The panel places all 10." } }),
  projectile({ key: "ironheart", name: "Ironheart", value: 2, hp: 200, size: 2, sort: 300, role: "Launch 3: a slow iron ball.",
    notes: { Gimmick: "The damage showcase: Cleave, Striker's Rend, Heave, Acid's Melt, Destruction's Corrode." } }),
  projectile({ key: "skyglass", name: "Skyglass", value: 12, hp: 25, size: 1, sort: 400, role: "Launch 4: a glass bead no bigger than a thumbnail.",
    notes: { Gimmick: "About two hits, and no crits are possible. Rewards Advantage, Chant rerolls, Exact (which damages on a miss) and attack volume." } }),
  projectile({ key: "wardwing", name: "Wardwing", value: 5, hp: 25, size: 1, sort: 500, role: "Launch 5: a small summoned flier (living, and a Spell).",
    notes: { Gimmick: ["<strong>Ward 15</strong>, reset at the start of each party member's turn: track it by hand (it soaks the first 15 damage that turn).",
      "<strong>Flit</strong> (reaction): cancels the first hit each party member's turn. Bait it with cheap or extra attacks (Fast, Solitary), stack reactions into one turn, Pierce.",
      "It counts as <strong>living</strong> for this round (Death's Wither, Slashing's +4), and as a <strong>Spell</strong>: dispelling it works (Arcanomancy, Light's Dispersion)."] } }),
  projectile({ key: "snapshot", name: "Snapshot", value: 6, hp: 35, size: 2, sort: 600, role: "Launch 6: launched mid-round.",
    notes: { Gimmick: "Only reactions can hit it (React, Burst, Shield Toss with RP, Lie in Wait). Launch it during someone's turn." } }),
  projectile({ key: "veiledwisp", name: "Veiled Wisp", value: 6, hp: 60, size: 1, sort: 700, role: "Launch 7: hidden by an illusion, humming.",
    notes: { Gimmick: "Place it hidden. A Spot (Moderate 10) finds it; once spotted, Hearing gives its location (reveal the token for that player). Unspotted attackers have Disadvantage, or Area-attack a guessed point. The veil is a Spell (Arcanomancy, Light's Dispersion)." } }),
  projectile({ key: "lantern", name: "Festival Lantern", value: 2, hp: 45, size: 2, disposition: 1, sort: 800, role: "Launch 8: protect it.",
    notes: { Gimmick: "It drifts for 2 rounds while the breakers fire <strong>6 shots</strong> at it (the panel places them). Each shot deals 3d10 to the lantern if it isn't stopped; roll it by hand. Protect it with Shield, Accretion, Block, Redirect, Dampen, Mend, or catch it (~135 Force). Its fixed dodge of 2 is for allies targeting it. Success is the lantern surviving." } }),
  projectile({ key: "breakershot", name: "Breaker shot", value: 6, hp: 5, size: 1, sort: 850, role: "Launch 8: one of the 6 shots fired at the Festival Lantern.",
    notes: { Gimmick: "Shoot it down with a reaction before it lands. If it isn't stopped, it deals 3d10 to the lantern (roll by hand)." } }),
  projectile({ key: "geode", name: "Geode (core)", value: 6, hp: 40, size: 2, sort: 900, role: "Launch 9: a stone core inside a steel shell.",
    notes: { Gimmick: "Only the core counts: its 40 health is this token. The <strong>shell</strong> has 100 health and a Limit of 20 against Physical and about 7 against anything else; track it by hand. Non-Physical damage, Pierce or Bash punching through beats breaking the shell first." } }),
  projectile({ key: "heartstone", name: "Heartstone", value: 3, hp: 350, size: 3, token: 1, sort: 1000, role: "Launch 10: stays up 3 turns.",
    notes: { Gimmick: "Each turn a rune shows which damage category works (Physical, Elemental or Magical); a Spot (DC 10) reads it. Matching hits deal full damage; others are doubly Weakened (×0.25, adjust by hand). All Magic damage counts as Magical. 350 health is the baseline; 375 for a stronger table." } })
];
