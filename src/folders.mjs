// The Adventure's folder tree. Content files import the ids from here.
import { folder } from "./common.mjs";

const top = (key, name, type, sort) => folder(key, name, type, { sort });
export const F = {
  actors: top("actors", "The Fall of Edretnor", "Actor", 0),
  journal: top("journal", "The Fall of Edretnor", "JournalEntry", 0),
  tables: top("tables", "The Fall of Edretnor", "RollTable", 0),
  scenes: top("scenes", "The Fall of Edretnor", "Scene", 0),
  macros: top("macros", "The Fall of Edretnor", "Macro", 0)
};
const sub = (key, name, parent, sort) => folder(key, name, parent.type, { parent: parent._id, sort });
Object.assign(F, {
  actorsRound2: sub("actors-round2", "Round 2: The Protection Run", F.actors, 100),
  actorsCult: sub("actors-cult", "The Crawl: the Maw", F.actors, 200),
  actorsCity: sub("actors-city", "The Crawl: Edretnor", F.actors, 300),
  actorsOmens: sub("actors-omens", "Omens", F.actors, 400),
  tablesFestival: sub("tables-festival", "Festival", F.tables, 100),
  tablesConservatory: sub("tables-conservatory", "Round 3: The Conservatory", F.tables, 200),
  tablesCrawl: sub("tables-crawl", "The Crawl", F.tables, 300)
});
export const FOLDERS = Object.values(F);
