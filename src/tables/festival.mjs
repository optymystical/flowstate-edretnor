// Festival tables (project doc festival-layer): the market's daily rolls and the Round 1 Scout twists.
import { table, tableLink } from "../common.mjs";
import { F } from "../folders.mjs";
import { item } from "./items.mjs";

const market = F.tablesMarket._id, festival = F.tablesFestival._id;
const NO_REPEATS = "Draws without replacement, so repeats can't come up: reset the table (its sheet's reset button) before the next draw.";

export const FESTIVAL = [
  table("market-uncommon-rack", "Market: the Uncommon rack", [
    { name: "Steel weapon", text: "Light or heavy, any type. Grade 5. 480 / 720 shards." },
    { name: "Bronze weapon", text: "Light or heavy, any type. Grade 5. 480 / 720 shards." },
    { name: "Silver Coating light weapon", text: "Grade 5. 480 shards." },
    { name: "Cold Iron heavy weapon", text: "A Heavy Defender shield counts. Grade 5. 720 shards." },
    { name: "Chitin or Hard Leather armor", text: "Light or Medium. Grade 5. 480 / 960 shards." },
    { name: "Silver armor", text: "Light or Medium. Grade 5. 480 / 960 shards." },
    { name: "Steel or Bronze Heavy armor", text: "Grade 5. 1,440 shards." },
    { name: "Cold Iron Heavy armor", text: "Grade 5. 1,440 shards." },
    { name: "Uncommon Icon", text: "Prism or Vigil (Dream), Bane or Grudge (Nightmare). Grade 5. 480 shards." },
    { name: "Uncommon affix", text: `400 shards. Roll which one: ${tableLink("gem-uncommon", "Uncommon affix gem")}.`, weight: 2 },
    { name: "Amberite or Quartz weapon", text: "Amberite light weapon or Quartz heavy weapon, for breaking magic. Grade 5. 480 / 720 shards." }
  ], { folder: market, sort: 100, replacement: false,
    description: `<p>Each morning, draw 4 times. Everything on the rack is Grade 5. ${NO_REPEATS}</p>` }),

  table("gem-common", "Common affix gem", [
    item("affix.quartz"), item("affix.agate"), item("affix.jasper"), item("affix.obsidian"), item("affix.hematite")
  ], { folder: market, sort: 200,
    description: "<p>The jeweler stocks [[1d3]] Common affixes each day, 200 shards each. Also used by the crawl's Jeweler's case.</p>" }),

  table("gem-uncommon", "Uncommon affix gem", [
    { name: "Garnet" }, { name: "Topaz" }, { name: "Moonstone" }, { name: "Tourmaline" }, { name: "Zircon" }
  ], { folder: market, sort: 300, description: "<p>400 shards at the market. Used by the Uncommon rack, the Jeweler's case and the Rare table.</p>" }),

  table("round1-twists", "Round 1: projectile twists", [
    { name: "Hailshot", text: "\"One launch is a fistful of pebbles fired together. Every last one has to break.\" (Area attacks shine.)" },
    { name: "Ironheart", text: "\"There's a slow iron ball that takes a real beating. Bring your heaviest hitter.\"" },
    { name: "Skyglass", text: "\"A glass bead no bigger than a thumbnail. Hard to hit at all; two clean hits shatter it.\" (Advantage and rerolls shine.)" },
    { name: "Wardwing", text: "\"One of them is alive: a little summoned flier with its own ward, and it dodges the first hit each turn.\" (Bait it with cheap attacks.)" },
    { name: "Snapshot", text: "\"One goes up mid-round, when nobody's ready. Only quick reactions catch it.\"" },
    { name: "Veiled Wisp", text: "\"One is hidden by an illusion. You'll hear it hum before you see it.\"" },
    { name: "Geode", text: "\"A steel shell around a stone core, and only the core counts. Punch through, don't smash.\"" }
  ], { folder: festival, sort: 200, replacement: false,
    description: `<p>Scout results before Round 1: the first success draws one twist, the second draws two more, the third reveals the Heartstone (its rune reads with a Spot, DC 10). The Fieldstone, the Lantern and the Heartstone aren't on the table. ${NO_REPEATS}</p>` })
];
