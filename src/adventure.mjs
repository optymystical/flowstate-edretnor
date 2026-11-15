// Assembles the Adventure document from the content files.
import { stableId, MODULE_ID } from "./common.mjs";
import { FOLDERS } from "./folders.mjs";
import { buildJournals } from "./journal/journals.mjs";
import { ROUND2 } from "./actors/round2.mjs";
import { CRAWL } from "./actors/crawl.mjs";
import { OMENS } from "./actors/omens.mjs";
import { FESTIVAL } from "./tables/festival.mjs";
import { CONSERVATORY } from "./tables/conservatory.mjs";
import { CRAWL_TABLES } from "./tables/crawl.mjs";
import { SCENES } from "./scenes.mjs";
import { MACROS } from "./macros.mjs";

export function buildAdventure() {
  const actors = [...ROUND2, ...CRAWL, ...OMENS];
  const tables = [...FESTIVAL, ...CONSERVATORY, ...CRAWL_TABLES];
  return {
    _id: stableId("adventure:edretnor"),
    name: "The Fall of Edretnor",
    img: null,
    caption: "The Flow State starter campaign",
    description: "<p>The young king's tournament at Edretnor, the festival around it, the cult attack that ends it, and the escape through the burning city. Importing also sets the world to a level-0 start: Shards with a 100 starting purse, and Common Grade 3 starting gear.</p>",
    sort: 0,
    folders: FOLDERS,
    actors,
    items: [],
    journal: buildJournals({ actors, tables }),
    scenes: SCENES,
    tables,
    macros: MACROS,
    cards: [],
    playlists: [],
    combats: [],
    flags: { [MODULE_ID]: { adventure: "edretnor" } }
  };
}
