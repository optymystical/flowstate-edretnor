// Assembles the Adventure document from the content files.
import { stableId, MODULE_ID } from "./common.mjs";
import { FOLDERS } from "./folders.mjs";
import { START_HERE } from "./journal/start-here.mjs";
import { ROUND2 } from "./actors/round2.mjs";
import { CRAWL } from "./actors/crawl.mjs";
import { OMENS } from "./actors/omens.mjs";
import { FESTIVAL } from "./tables/festival.mjs";
import { CONSERVATORY } from "./tables/conservatory.mjs";
import { CRAWL_TABLES } from "./tables/crawl.mjs";

export function buildAdventure() {
  return {
    _id: stableId("adventure:edretnor"),
    name: "The Fall of Edretnor",
    img: null,
    caption: "The Flow State starter campaign",
    description: "<p>The young king's tournament at Edretnor, the festival around it, the cult attack that ends it, and the escape through the burning city. Importing also sets the world to a level-0 start: Shards with a 100 starting purse, and Common Grade 3 starting gear.</p>",
    sort: 0,
    folders: FOLDERS,
    actors: [...ROUND2, ...CRAWL, ...OMENS],
    items: [],
    journal: [START_HERE],
    scenes: [],
    tables: [...FESTIVAL, ...CONSERVATORY, ...CRAWL_TABLES],
    macros: [],
    cards: [],
    playlists: [],
    combats: [],
    flags: { [MODULE_ID]: { adventure: "edretnor" } }
  };
}
