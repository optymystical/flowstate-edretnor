// The GM run-book journals, written in Markdown (src/journal/md/) and split into pages at each "## " heading.
// @Actor[Name] and @Table[Name] in the text become content links to this Adventure's documents.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { journal, stableId } from "../common.mjs";
import { F } from "../folders.mjs";
import { START_HERE } from "./start-here.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// marked is a dev dependency (dev/package.json).
const { marked } = await import(pathToFileURL(createRequire(resolve(here, "../../dev/package.json")).resolve("marked")).href);
const md = name => readFileSync(resolve(here, "md", `${name}.md`), "utf8");
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function pages(text, extra = [], link = x => x) {
  const parts = text.split(/^## /m).filter(p => p.trim());
  return [...parts.map(p => {
    const nl = p.indexOf("\n"); const name = p.slice(0, nl).trim();
    return { key: slug(name), name, html: marked.parse(link(p.slice(nl + 1))) };
  }), ...extra];
}

export function buildJournals({ actors, tables }) {
  const actorId = Object.fromEntries(actors.map(a => [a.name, a._id]));
  const tableId = Object.fromEntries(tables.map(t => [t.name, t._id]));
  const link = html => html
    .replace(/@Actor\[([^\]]+)\]/g, (m, n) => { if (!actorId[n]) throw new Error(`No actor "${n}"`); return `@UUID[Actor.${actorId[n]}]{${n}}`; })
    .replace(/@Table\[([^\]]+)\]/g, (m, n) => { if (!tableId[n]) throw new Error(`No table "${n}"`); return `@UUID[RollTable.${tableId[n]}]{${n}}`; });
  const list = (title, items) => ({ key: slug(title), name: title, html: `<ul>${items.map(i => `<li>${link(i)}</li>`).join("")}</ul>` });
  const J = (key, name, text, sort, extra = []) => {
    return journal(key, name, pages(text, extra, link), { folderId: F.journal._id, sort });
  };
  return [
    START_HERE,
    J("festival", "Days 1–3: The Festival", md("festival"), 100, [list("Tables", [
      "@Table[Market: the Uncommon rack]", "@Table[Common affix gem]", "@Table[Uncommon affix gem]", "@Table[Round 1: projectile twists]"])]),
    J("round1", "Round 1: The Projectile Shoot", md("round1"), 200),
    J("round2", "Round 2: The Protection Run", md("round2"), 300),
    J("round3", "Round 3: The Clockwork Conservatory", md("round3"), 400),
    J("crawl", "The Crawl: Escaping Edretnor", md("crawl"), 500, [list("Tables", [
      "@Table[Crawl: surface event (Phase 1)]", "@Table[Crawl: surface event (Phase 2)]", "@Table[Crawl: surface event (Phase 3)]",
      "@Table[Crawl: wilderness tile (Phase 1)]", "@Table[Crawl: wilderness tile (Phase 2)]", "@Table[Crawl: wilderness tile (Phase 3)]",
      "@Table[Crawl: search find (Phase 1)]", "@Table[Crawl: search find (Phase 2)]", "@Table[Crawl: search find (Phase 3)]", "@Table[Loot: Rare table]"]),
      list("Actors", ["@Actor[Maw Cultist]", "@Actor[Cell Leader]", "@Actor[Preacher]", "@Actor[Ritualist]", "@Actor[Cell Master]",
        "@Actor[Gloamhound (rite-born)]", "@Actor[Gloamhound (fully grown)]", "@Actor[Edretnor Guard]", "@Actor[Townsperson]", "@Actor[Bandit]",
        "@Actor[Old Soldier]", "@Actor[Wounded Contestant]"])]),
    J("after", "After the Escape: The Audience and the Hooks", md("after"), 600)
  ];
}
