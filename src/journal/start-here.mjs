// The first journal a GM opens: what the arc is, what importing did, and how a run is laid out.
import { journal } from "../common.mjs";
import { F } from "../folders.mjs";

const overview = `
<p><strong>The Fall of Edretnor</strong> is the Flow State starter campaign: a level-0 start for 4–5 brand-new characters. It runs about
5 sessions: 2–3 for the tournament and its festival, then 2–3 for the escape through the burning city and the audience with the king.</p>
<p>The characters are nobodies: people from all over the world who happen to be in the same tournament when everything goes wrong.</p>
<h2>What importing did</h2>
<ul>
<li>Created everything in the <em>The Fall of Edretnor</em> folders: actors, scenes, roll tables, journals and macros.</li>
<li>Set the world to a level-0 start: <strong>Shards</strong> as the currency with a <strong>100-shard starting purse</strong>, and
<strong>Common Grade 3</strong> starting gear (45 stat points, plus the Background's 15 free points). Characters made in the New Character
wizard from now on start this way.</li>
</ul>
<h2>The run</h2>
<table>
<thead><tr><th>Day</th><th>Main event</th><th>Rest of the day</th></tr></thead>
<tbody>
<tr><td>1</td><td>Late arrival and registration</td><td>3 festival slots; teams drawn at dusk; the tavern</td></tr>
<tr><td>2</td><td>Round 1: the Projectile Shoot</td><td>3 festival slots</td></tr>
<tr><td>3</td><td>Round 2: the Protection Run</td><td>3 festival slots; the play</td></tr>
<tr><td>4</td><td>Round 3: the Clockwork Conservatory</td><td>The attack begins about 40 minutes in; the escape through Edretnor; the audience with the king</td></tr>
</tbody>
</table>
<h2>Before the first session</h2>
<ol>
<li>Have each player build a character in the New Character wizard, and a backup: the crawl is lethal, and a replacement joins as another contestant.</li>
<li>Run the <strong>Edretnor Setup</strong> macro. It rolls the Conservatory's variants, generates a new Edretnor for the crawl and stocks
the Day 1 market, and writes it all to a new journal, <em>Edretnor: This Run</em>.</li>
</ol>
<h2>The macros</h2>
<table>
<thead><tr><th>Macro</th><th>When</th></tr></thead>
<tbody>
<tr><td><strong>Edretnor Setup</strong></td><td>Once before each run (it replaces the crawl map).</td></tr>
<tr><td><strong>Round 1: Launch Panel</strong></td><td>Round 1: launches each projectile into the flight lane and keeps the score.</td></tr>
<tr><td><strong>Round 2: Conveyor Panel</strong></td><td>Round 2: moves the protected ally 20 ft a round, brings out the waves on schedule, records the yards.</td></tr>
<tr><td><strong>Edretnor: Market Morning</strong></td><td>The mornings of Days 2 and 3: the Uncommon rack, the jeweler and the apothecary's stock.</td></tr>
<tr><td><strong>Conservatory: Light a Facet</strong></td><td>Round 3, each time the party lights a facet of the Lumen Core (and the Moon Lily bloom). The scene starts dark.</td></tr>
<tr><td><strong>Edretnor: Crawl Panel</strong></td><td>The escape: the map, the clock, searches, the convoy. See <em>The Crawl</em> journal, page "Running it in Foundry".</td></tr>
</tbody>
</table>
<h2>The journals</h2>
<p>One per stretch of the arc: <em>Days 1–3: The Festival</em>, one per round, <em>The Crawl</em>, and <em>After the Escape</em> (the audience,
the wishes and the ten hooks). Each scene opens its round's journal from its notes. The Omens' abilities and tactics are in their actor biographies.</p>
`;

export const START_HERE = journal("start-here", "Start Here: The Fall of Edretnor", [
  { key: "overview", name: "Overview", html: overview }
], { folderId: F.journal._id, sort: 0 });
