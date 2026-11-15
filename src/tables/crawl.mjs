// The city crawl's tables (project doc edretnor-crawl-tables). Each phase gets its own copy of a table holding only the entries
// that phase allows, which is the same as the doc's "reroll anything the current phase doesn't allow".
import { table, tableLink, actorLink as A, count } from "../common.mjs";
import { F } from "../folders.mjs";
import { item, itemLink } from "./items.mjs";

const PHASES = [1, 2, 3];
const ALL = PHASES;
const CELL = `a cell (1 ${A("cult-cell-leader", "Cell Leader")} and 4 ${A("cult-maw-cultist", "Maw Cultists")})`;
const HALF = `half a cell (1 ${A("cult-cell-leader", "Cell Leader")} and 2 ${A("cult-maw-cultist", "Maw Cultists")})`;
const CELLS = n => `${n} cells (each 1 ${A("cult-cell-leader", "Cell Leader")} and 4 ${A("cult-maw-cultist", "Maw Cultists")})`;
const HOUND = A("omen-gloamhound-riteborn", "rite-born hound");
const HOUNDS = A("omen-gloamhound-riteborn", "rite-born hounds");
const LOOT = key => tableLink(key, "Loot");
const HINT = "<strong>(Hint)</strong>";
const hint = to => `<strong>(Hint, ${to})</strong>`;

/** An entry for a phase-split table: [name, phases, text]. */
const e = (name, phases, text) => ({ name, phases, text });
/** One table per phase from a list of entries, each holding the entries that phase allows. */
function byPhase(key, label, entries, { folder, sort, note = "", transform = null }) {
  const out = {};
  for (const p of PHASES) {
    const rs = entries.filter(x => x.phases.includes(p)).map(x => ({ name: x.name, text: transform ? transform(x, p) : x.text }));
    if (rs.length) out[p] = table(`${key}-p${p}`, `${label} (Phase ${p})`, rs, { folder, sort: sort + p, description: `<p>${label}: the entries Phase ${p} allows. ${note}</p>` });
  }
  return out;
}

// ---- Surface events ----------------------------------------------------------------------------------------------------------
const ev = F.tablesCrawlEvents._id;
const EVENTS = {
  cult: ["Cult", [
    e("Herding detail", [1, 2], `Half a cell with ${count(2, 3)} ${HOUNDS}. <strong>Shadow them:</strong> each PC makes a stealth check against the hounds' perception (d9 with Advantage; no Advantage in smoke). Following for 10 minutes reveals the nearest zone. ${HINT}`),
    e("Prisoner march", [1, 2], `${CELL[0].toUpperCase()}${CELL.slice(1)} guarding ${count(6, 12)} roped civilians.`),
    e("Recruiter", [1], `The ${A("cult-preacher", "Preacher")}, ${HALF} and ${count(10, 20)} cornered civilians. <strong>Three exchanges:</strong> each one, a PC rolls Persuade or Deceive against the Preacher's d15. A win draws a third of the crowd to the party; a loss sends 1d4 to the cult. Starting a fight scatters the crowd: half flee, half join the convoy.`),
    e("Disguised refugees", [1], `1 ${A("cult-cell-leader", "Cell Leader")} and 3 ${A("cult-maw-cultist", "Maw Cultists")} in festival clothes. <strong>Expose them</strong> with Insight's Read Intent or a Spot against the Leader's Deception (d15). Unexposed, they get a surprise round on the convoy at the next fixed tile.`),
    e("Ambush point", [1, 2], `${CELL[0].toUpperCase()}${CELL.slice(1)} lying in wait. The party's highest Spot against the Leader's stealth check (d15). The winner gets a surprise round.`),
    e("Looters", [2, 3], `${HALF[0].toUpperCase()}${HALF.slice(1)}, distracted. A stealth check (Moderate 10) for everyone gives a surprise round. Afterward, one free Loot find (this phase's Find: Loot table).`),
    e("Pyre crew", [2], `${CELL[0].toUpperCase()}${CELL.slice(1)} at a black-flame pyre. Each round the pyre stands, 1 ${HOUND} climbs out, up to 3. <strong>The pyre:</strong> 80 Durability, 10 Limit.`),
    e("Hunting party", [2, 3], `${CELL[0].toUpperCase()}${CELL.slice(1)} with 2 ${HOUNDS}. To hide, each PC makes a stealth check against the hounds (d9 with Advantage) and the Leader (d15).`),
    e("Checkpoint", [2], `${CELL[0].toUpperCase()}${CELL.slice(1)} at a barricade. <strong>Getting through:</strong> a password (from a Fallen cultist's kit) passes; a bluff is Deceive against the Leader's d15. Otherwise fight, or detour (the tile counts as failed).`),
    e("Withdrawal column", [3], `${CELLS(2)}, ${count(4, 8)} captives and a cart (2 Loot finds).`),
    e("Last rite", [3], `1 ${A("cult-ritualist", "Ritualist")} and 2 ${A("cult-maw-cultist", "Maw Cultists")} finishing a circle. <strong>In 3 rounds</strong> the circle completes and 1 ${HOUND} forms; stopping them first prevents it.`)
  ]],
  civilians: ["Civilians", [
    e("Cornered", [1, 2], `${HALF[0].toUpperCase()}${HALF.slice(1)} against ${count(3, 8)} civilians.`),
    e("Last stand", [1], `4 ${A("city-guard", "Edretnor Guards")} at half HP against ${CELL}. The surviving guards join the convoy and fight. ${hint("toward the barracks")}`),
    e("Festival troupe", [1], "6 civilians. Their costumes give Advantage on disguise Deceptions for the rest of the crawl."),
    e("Fellow contestants", [1, 2], `2 ${A("city-wounded-contestant", "wounded contestants")}. <strong>[[1d6]]:</strong> 1–3 they join; 4–5 they share one ${HINT}; 6 they're rivals who take this tile's next find and leave.`),
    e("Noble household", [1], "8 civilians who count as one band higher. Delivered safely, they pay 500 shards or one roll on the " + tableLink("loot-rare", "Rare table") + "."),
    e("Mob justice", [1], `${count(6, 10)} ${A("city-townsperson", "Townspeople")} beating 4 old-faith Fire Walker refugees. <strong>De-escalate</strong> with Persuade or Intimidate (Moderate 10, highest roll); otherwise fight the mob. Either way, the refugees join.`),
    e("Field infirmary", ALL, `${count(2, 6)} wounded civilians. <strong>Resting</strong> here for 1 hour counts as a rest. <strong>Each hour, d6:</strong> on a 1–2, half a cell (Phase 1) or a Hunting party (Phases 2–3) arrives.`),
    e("Stampede", [1], `${count(15, 25)} civilians rushing a gate. <strong>Redirect them:</strong> one PC makes a Persuade, Intimidate or Athletics check (Moderate 10), and the crowd joins. <strong>On a failure:</strong> each PC makes an Athletics check (Moderate) or takes 2d10 physical, and only 5 civilians join.`),
    e("Holdouts", [3], `${count(4, 10)} civilians. They come out for a Persuade (Hard 15) or a Ration cache.`),
    e("Scavengers", [3], `3 ${A("city-bandit", "Bandits")}. <strong>[[1d6]]:</strong> 1–2 they trade (one Loot find for shards); 3–4 they ignore the party; 5–6 they turn hostile if the party looks weak.`)
  ]],
  gray: ["Gray area", [
    e("Rogue Omen", [1, 2], `${HALF[0].toUpperCase()}${HALF.slice(1)} at half HP fighting 1 ${HOUND}. Save them and the 3 survivors surrender as civilians.`),
    e("Under the rubble", ALL, `${count(2, 4)} ${A("cult-maw-cultist", "Maw Cultists")} pinned. <strong>Freeing them:</strong> 10 minutes and an Athletics check (Moderate 10). If the party forgives them they become civilians, and on a 5–6 ([[1d6]]) they give a ${HINT}.`),
    e("Coerced", [2], `A ${A("cult-cell-leader", "Cell Leader")} with 4 coerced ${A("cult-maw-cultist", "Maw Cultists")}. <strong>To turn them:</strong> kill the Leader, or Persuade the Cultists (Moderate 10, or Hard 15 while the Leader stands). They defect as civilians. In a fight they flee once any one of them drops.`),
    e("Rite gone wrong", [2], `3 ${A("cult-maw-cultist", "Maw Cultists")} trapped inside a circle, taking 2d12 Supernatural each round. Break the anchor stone (40 Durability) and they become civilians.`),
    e("Abandoned cultists", [3], `4 ${A("cult-maw-cultist", "Maw Cultists")} at half HP and out of energy. Fight them, or take them in as civilians.`)
  ]],
  omens: ["Omens and Heralds", [
    e("Hound pack", [2, 3], `${count(3, 4)} ${HOUNDS}. In Phase 3, one of them is ${A("omen-gloamhound-grown", "fully grown")}. Dread first.`),
    e("Herald ahead", [2], "Turn back (the tile counts as failed), or sneak past using the Herald rules: every PC makes a stealth check against DC 15; smoke, an Abyss pocket or fireworks give Advantage. If anyone fails, everyone resists Fear (needing 60), and at the start of each round in its tile it makes 3 attacks (d40 against dodge) at random party members for 8d12 Supernatural each. Leaving takes the party's whole round."),
    e("Herald's wake", [2, 3], `Nothing left alive. A Spot (Moderate 10) shows where the Herald went, pointing toward an active zone. ${HINT}`),
    e("First Death Omens", [3], "A forming Death Omen (an object: 60 Durability, 0 Limit). Destroy it within 2 rounds or it lopes off into the ruins.")
  ]],
  guard: ["Royal Guard", [
    e("Guard vs. Herald", [2], `Seen from a distance. A Spot (Moderate 10) notes which way the Guard came from. ${hint("toward the king")} Getting closer brings the Herald's attention onto the party.`),
    e("Guard's trail", [3], "Following it reveals the next tile toward the cleanup member (Lancel the Wolf)."),
    e("Guard vs. cell", [3], "The cleanup member against 2 cells. He wins in 3 rounds whatever happens; each round a party member helps meaningfully earns 1 favor (3 favor and he owes the party)."),
    e("Guard with civilians", [3], `The cleanup member escorting ${count(10, 20)} civilians. Taking over the escort adds them to the party's convoy and earns 1 favor.`)
  ]],
  hazards: ["Hazards", [
    e("Spreading fire", [1, 2], "Cross at 3d10 heat each (no Ignite), or detour for 10 minutes."),
    e("Smoke bank", [1, 2], "Stealth checks have Advantage. Smell checks fail, which takes away the hounds' Advantage."),
    e("Collapsing building", ALL, "Each PC makes an Athletics check (Moderate 10) or takes 3d12 physical."),
    e("Abyss pocket", [2], "Heavily obscured. Nonmagical light reaches only half as far."),
    e("Sewer breach", ALL, `Swim it with an Athletics check (Moderate 10; a failure costs 1/5 of max energy), or detour for 10 minutes. Following the flow points toward the nearest cistern. ${HINT}`),
    e("Light blockage", ALL, "10 minutes to clear, or 1 hour clearing it quietly.")
  ]]
};
const EVENT_TABLES = Object.fromEntries(Object.entries(EVENTS).map(([k, [label, list]], i) =>
  [k, byPhase(`crawl-event-${k}`, `Event: ${label}`, list, { folder: ev, sort: (i + 1) * 100 })]));

const WILD = byPhase("crawl-event-wilderness", "Event: Wilderness", [
  e("Refugee column", ALL, `${count(10, 20)} civilians.`),
  e("Cult outriders", [1, 2], `${HALF[0].toUpperCase()}${HALF.slice(1)}.`),
  e("Stray hound", [2, 3], `1 ${HOUND}.`),
  e("Opportunists", [2, 3], `3 ${A("city-bandit", "Bandits")}.`),
  e("Empty caravan", [1], `Works like a Fallen cultist's kit (robes, chalk and the day's password). Also a ${hint("toward a zone")}.`)
], { folder: ev, sort: 700 });

// d100 category ranges per phase: [category, lo, hi].
const SURFACE = {
  1: [["cult", 1, 30], ["civilians", 31, 65], ["gray", 66, 75], ["hazards", 76, 100]],
  2: [["cult", 1, 30], ["civilians", 31, 45], ["gray", 46, 57], ["omens", 58, 75], ["guard", 76, 78], ["hazards", 79, 100]],
  3: [["cult", 1, 15], ["civilians", 16, 30], ["gray", 31, 37], ["omens", 38, 50], ["guard", 51, 62], ["hazards", 63, 80], [null, 81, 100]]
};
const crawl = F.tablesCrawl._id;
const surface = PHASES.map(p => table(`crawl-surface-p${p}`, `Crawl: surface event (Phase ${p})`, SURFACE[p].map(([k, lo, hi]) => k
  ? { name: EVENT_TABLES[k][p].name, table: `crawl-event-${k}-p${p}`, range: [lo, hi] }
  : { name: "Empty", text: "Nothing here.", range: [lo, hi] }), { folder: crawl, sort: 100 + p,
  description: `<p>Roll when the party enters a city tile in Phase ${p}. The category's table is drawn automatically. Wilderness tiles use ${tableLink(`crawl-wilderness-p${p}`, `Crawl: wilderness tile (Phase ${p})`)}; the Overlook is fixed (a Spot, Moderate 10, reveals which way one fixed tile lies).</p>` }));
const wilderness = PHASES.map(p => { const hi = p === 1 ? 15 : 25; return table(`crawl-wilderness-p${p}`, `Crawl: wilderness tile (Phase ${p})`, [
  { name: WILD[p].name, table: `crawl-event-wilderness-p${p}`, range: [1, hi] },
  { name: "No event", text: "The wilderness is quiet.", range: [hi + 1, 100] }
], { folder: crawl, sort: 200 + p, description: `<p>Roll when the party enters a wilderness tile in Phase ${p}: an event on 01–${hi}.</p>` }); });

// ---- Finds -------------------------------------------------------------------------------------------------------------------
const fd = F.tablesCrawlFinds._id, lt = F.tablesCrawlLoot._id;
const P3_ALIVE = "<br><em>Phase 3: they're alive only on a 1 ([[1d3]]).</em>";
const CIV = byPhase("finds-civilians", "Find: Civilians", [
  e("Cellar family", ALL, `${count(2, 6)} civilians.`),
  e("Lost child", [1, 2], "1 civilian. The parents are in an adjacent tile, found with a search there."),
  e("Goblin trader", [1, 2], `Escort him to a cistern or the walls and he gives two items of the party's choice from his stock: 1 ${itemLink("potion.health")}, a Goblin import crate (${tableLink("loot-goblin-crate", "see Loot")}), a tool chest, or lanterns and oil.`),
  e("Dying guard", ALL, `${hint("toward the king")} In Phase 3, toward the cleanup member instead.`),
  e("Hidden survivors", ALL, `${count(3, 8)} civilians.`),
  e("Attic musicians", [1, 2], `${count(2, 4)} civilians. Once, their horn can call a Cellar family or Hidden survivors from an adjacent tile to the party.`),
  e("Glassblower and apprentices", [1, 2], `3 civilians. ${hint("toward a cistern")}`),
  e("Wounded contestant", [1, 2], `A ${A("city-wounded-contestant", "wounded contestant")}. Fights alongside the party once healed.`),
  e("Old-faith shrine", ALL, `A Guiding Flame priest (Brother Septimar) and ${count(4, 10)} civilians, who leave only with the priest.`),
  e("Caravan master", [1, 2], "1 civilian and a cart that carries 6 civilians without them counting toward the band."),
  e("Locked-in clerks", [1, 2], "4 civilians. The next Guild strongbox opens without a check."),
  e("Twins in a well", [2, 3], "2 civilians. Rope gets them out in 10 minutes, or an Athletics check (Moderate 10)."),
  e("Old soldier", ALL, `An ${A("city-old-soldier", "Old Soldier")}. Joins on a Persuade (Hard 15); mentioning the peninsula gives Advantage.`),
  e("Rite survivor", [1, 2], `1 civilian. ${hint("toward the nearest small circle")}`)
], { folder: fd, sort: 100, transform: (x, p) => p === 3 && x.name !== "Dying guard" ? x.text + P3_ALIVE : x.text });
const INTEL = byPhase("finds-intel", "Find: Intel", [
  e("Runner", [1, 2], `A ${A("cult-maw-cultist", "Maw Cultist")} who bolts. <strong>Catching him:</strong> an Athletics check (Moderate 10) or dropping him to his PT of 49. ${hint("toward the nearest zone or circle")}`),
  e("Deserter", [1, 2], `A ${A("cult-maw-cultist", "Maw Cultist")} who knows where the Cell Master is. ${HINT} Becomes a civilian.`),
  e("Body with orders", [1, 2], `Names one zone or circle tile. ${HINT}`),
  e("Notice board", [1], hint("toward the town square and Town Hall")),
  e("Guard post map", ALL, `Marks 2 cisterns, one of them the king's. ${HINT}`),
  e("Waterworks office", ALL, `Shows where all four cisterns are. ${HINT}`),
  e("Cult ledger", [1, 2], `Names the circle that activates next. ${HINT}`),
  e("Guard chalk marks", [1, 2], `Point toward the barracks. ${HINT}`),
  e("Procession poster", [1], "A false lead toward where the king's double was last seen."),
  e("Echoing chant", [2], `A Hearing check (Moderate 10) gives the direction of the nearest zone. ${HINT}`),
  e("Rune-cut bodies", [1, 2], "A Spirit Sense or rune-lore check (Moderate 10) halves the time to scrub a circle, to 10 minutes."),
  e("Teleport scorch", [1, 2], `${hint("toward the king")} Rare.`),
  e("Sympathizer's letter", ALL, "Evidence that an Elven official (Councilor Elarion Vael) helped the Maw. A long-term hook.")
], { folder: fd, sort: 200 });

const LOOT_ENTRIES = [
  { name: "Festival stalls", phases: [1, 2], table: "loot-festival-stalls" },
  { name: "Guard post armory", phases: ALL, table: "loot-armory" },
  { name: "Guild strongbox", phases: ALL, text: `Pick (Hard 15) or break it (40 Durability, 8 Limit). Holds [[3d10*10]] shards and one roll on the ${tableLink("loot-rare", "Rare table")}.` },
  { name: "Healer's satchel", phases: ALL, table: "loot-healers-satchel" },
  { name: "Jeweler's case", phases: [1, 2], text: `[[1d2]] affix gems. Roll ${tableLink("loot-jewelers-case", "Jeweler's case")} for each.` },
  { name: "Temple reliquary", phases: ALL, table: "loot-temple-reliquary" },
  { name: "Mage's study", phases: [1, 2], table: "loot-mages-study" },
  { name: "Goblin import crate", phases: [1, 2], table: "loot-goblin-crate" },
  { name: "Fallen cultist's kit", phases: ALL, text: "Robes, chalk and the day's password. Advantage on disguises, and passes a Checkpoint." },
  { name: "Omen remains", phases: [2, 3], text: "A Dark fragment, a rare material." },
  { name: "Festival fireworks", phases: [1, 2], text: "Single use, thrown into an adjacent tile: its hostiles turn toward the noise, and the party enters with a surprise round." },
  { name: "Ration cache", phases: ALL, text: "Rations for 10 people. Opens the Holdouts without a check." },
  { name: "Shard purse", phases: ALL, text: "[[2d10*5]] shards (bread costs 5)." },
  { name: "Tool chest", phases: ALL, text: "Advantage on Athletics checks, and blockages clear 10 minutes faster." },
  { name: "Lanterns and oil", phases: ALL, text: "Pushes back an Abyss pocket." },
  { name: "Apothecary shelf", phases: [1, 2], table: "loot-apothecary" }
];
const LOOTF = Object.fromEntries(PHASES.map(p => [p, table(`finds-loot-p${p}`, `Find: Loot (Phase ${p})`,
  LOOT_ENTRIES.filter(x => x.phases.includes(p)).map(({ name, table: t, text }) => ({ name, table: t, text })),
  { folder: fd, sort: 300 + p, description: `<p>Find: Loot: the entries Phase ${p} allows. Results with their own table are drawn automatically.</p>` })]));

const DANGER = byPhase("finds-danger", "Find: Danger", [
  e("Whelping ground", [2, 3], `A half-formed ${HOUND}. Destroy it now, or it's a full hound here next hour.`),
  e("Hidden cell", ALL, `${CELL[0].toUpperCase()}${CELL.slice(1)}. The party's highest Spot against the Leader's stealth (d15); the winner gets a surprise round.`),
  e("Unstable floor", ALL, "The searcher makes an Athletics check (Moderate 10) or falls into a cellar for 2d10 physical, and 10 minutes to climb out."),
  e("Smoke-filled cellar", [1, 2], "Each searcher makes an Athletics check (Moderate 10) or loses 1/5 of max energy."),
  e("Glyphed door", [1, 2], "<strong>Noticing it:</strong> a Spot (Hard 15). <strong>Disarming:</strong> a rune-lore check (Moderate 10). <strong>If it triggers:</strong> 3d10 Supernatural to whoever opened it."),
  e("Lurking hound", [2, 3], `1 ${HOUND}, with Dread.`),
  e("Frightened civilian", [1, 2], `A ${A("city-townsperson", "Townsperson")} with a knife. A Persuade (Moderate 10) calms them, and they're 1 civilian.`),
  e("Collapsing upper floor", [2, 3], "Everyone inside makes an Athletics check (Moderate 10) or takes 3d10 physical."),
  e("Sentry with horn", [2], `A ${A("cult-maw-cultist", "Maw Cultist")}. To silence him: win a Spot against his stealth (d10), then drop him below his PT of 49 that round. Otherwise the next tile's event is a Hunting party.`),
  e("Dormant circle", [2, 3], "Resist Fear (needing 30), or take 2d12 Supernatural."),
  e("Claim-jumpers", [3], `3 hostile ${A("city-bandit", "Bandits")}.`)
], { folder: fd, sort: 400 });

const FINDS = { 1: [[40, "civ"], [65, "intel"], [90, "loot"], [100, "danger"]], 2: [[30, "civ"], [55, "intel"], [80, "loot"], [100, "danger"]], 3: [[20, "civ"], [35, "intel"], [70, "loot"], [100, "danger"]] };
const FIND_TABLE = { civ: CIV, intel: INTEL, loot: LOOTF, danger: DANGER };
const finds = PHASES.map(p => { let lo = 1; return table(`crawl-find-p${p}`, `Crawl: search find (Phase ${p})`, FINDS[p].map(([hi, k]) => {
  const t = FIND_TABLE[k][p]; const r = { name: t.name.replace(/ \(Phase \d\)$/, "").replace(/^Find: /, ""), uuid: `RollTable.${t._id}`, img: "icons/svg/d20-grey.svg", range: [lo, hi] }; lo = hi + 1; return r;
}), { folder: crawl, sort: 300 + p, description: `<p>Roll for each hidden find a search reveals in Phase ${p}. The category's table is drawn automatically.${p === 3 ? " Survivors found in Phase 3 are alive only 1 time in 3." : ""} Small circles aren't rolled: four are placed when the map is generated.</p>` }); });

// ---- Loot --------------------------------------------------------------------------------------------------------------------
const LOOT_TABLES = [
  table("loot-festival-stalls", "Loot: Festival stalls", [
    { name: "Rations", text: "Enough for the Holdouts." }, { name: "Rope and grapnel" }, { name: "Lantern" },
    { name: "Shards", text: "[[2d10]] shards." }, { name: "Festival mask", text: "Advantage on one disguise." }, item("potion.energyLesser")
  ], { folder: lt, sort: 100 }),
  table("loot-armory", "Loot: Guard post armory", [
    { name: "Common weapon", text: "Grade 5, of a type the party chooses.", weight: 2 }, { name: "Common armor", text: "Grade 5." },
    { name: "Defender shield", text: "Grade 5." }, { name: "Ammunition", text: "20 ammunition." },
    { name: "Roll twice", text: `Draw twice more on ${tableLink("loot-armory", "this table")}.` }
  ], { folder: lt, sort: 200 }),
  table("loot-healers-satchel", "Loot: Healer's satchel", [
    { ...item("potion.healthLesser"), weight: 3 }, item("potion.health"), item("potion.energyLesser"), item("potion.energy")
  ], { folder: lt, sort: 300, description: "<p>1 potion. Drag it from the chat card onto a character sheet.</p>" }),
  table("loot-apothecary", "Loot: Apothecary shelf", [
    { ...item("potion.health"), weight: 2 }, { ...item("potion.energy"), weight: 2 },
    { name: "Two Lesser potions", text: `One ${itemLink("potion.healthLesser")} and one ${itemLink("potion.energyLesser")}.` },
    { name: "A Greater potion", text: `[[1d2]]: 1 a ${itemLink("potion.healthGreater")}, 2 a ${itemLink("potion.energyGreater")}.` }
  ], { folder: lt, sort: 400 }),
  table("loot-jewelers-case", "Loot: Jeweler's case", [
    { name: "Common affix gem", table: "gem-common", weight: 4 }, { name: "Uncommon affix gem", table: "gem-uncommon", weight: 2 }
  ], { folder: lt, sort: 500, description: "<p>Draw once per gem in the case (1–2).</p>" }),
  table("loot-temple-reliquary", "Loot: Temple reliquary", [
    item("icon.aegis"), item("icon.sanctum"), item("icon.veil"), item("icon.warden")
  ], { folder: lt, sort: 600, description: "<p>A Common Icon, Grade 5: set its Grade to 5 once it's on the sheet.</p>" }),
  table("loot-mages-study", "Loot: Mage's study", [
    { name: "A Foci", text: "Any type, Grade 5.", weight: 3 }, { name: "A Shroud", text: "Any type, Grade 5.", weight: 3 }
  ], { folder: lt, sort: 700 }),
  table("loot-goblin-crate", "Loot: Goblin import crate", [
    { name: "Ranged weapon and ammunition", text: "A Common ranged weapon (a Goblin firearm if the weapon list has one) and 20 ammunition." }
  ], { folder: lt, sort: 800 }),
  table("loot-rare", "Loot: Rare table", [
    { name: "Uncommon-material weapon", text: "Grade 5." }, { name: "Uncommon-material armor", text: "Grade 5." },
    { name: "Uncommon Icon", text: "Prism or Vigil." }, { name: "Uncommon affix gem", table: "gem-uncommon" },
    { name: "Foci or Shroud with an Uncommon affix", text: `Any type. The affix: ${tableLink("gem-uncommon", "Uncommon affix gem")}.` },
    { name: "Two Greater potions", text: `One ${itemLink("potion.healthGreater")} and one ${itemLink("potion.energyGreater")}.` },
    { name: "Rare affix gem", text: "Emerald, Ruby or Black Opal." }, { name: "Uncommon gear", text: "Of the party's choice." }
  ], { folder: lt, sort: 900 })
];

const flat = o => Object.values(o).flatMap(v => (v && v._id) ? [v] : Object.values(v));
export const CRAWL_TABLES = [...surface, ...wilderness, ...finds, ...flat(EVENT_TABLES), ...flat(WILD), ...flat(CIV), ...flat(INTEL), ...flat(LOOTF), ...flat(DANGER), ...LOOT_TABLES];
