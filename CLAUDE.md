# flowstate-edretnor: working notes

The Flow State starter campaign ("The Fall of Edretnor") as a Foundry v14 content module for the `flowstate` system
(github.com/optymystical/FlowStateFoundryVTT). Everything ships in one Adventure (`packs/edretnor`).

- **Sources are code.** `src/` builds the Adventure (`src/adventure.mjs` collects the parts; `src/folders.mjs` the folder tree;
  `src/common.mjs` the helpers). `cd dev && npm run build` writes the readable JSON to `dev/packs-src/edretnor/` and compiles
  `packs/edretnor/` (LevelDB). Commit both. Never hand-edit the packs.
- **Ids are stable.** Every document id comes from a key (`dev/ids.mjs`), so links survive rebuilds and a re-import updates
  documents instead of duplicating them. Never change a key once published.
- **System data.** Follow the system's `docs/SCHEMA.md` (store only base fields; items link to the catalog via `system.base`, or
  copy from `Compendium.flowstate.*` with the UUIDs in its `docs/PACK_IDS.md`). System rules (potions, tokens, statuses) live in the
  system, not here.
- **Runtime code** is `scripts/edretnor.mjs` (world settings on import, `game.modules.get("flowstate-edretnor").api`), `scripts/setup.mjs`
  (the Setup, Market Morning and facet-light macros) and `scripts/crawl-panel.mjs` (the Crawl Panel), with the crawl's rules as plain
  functions in `scripts/crawl-rules.mjs` (testable in node). Macros only call the API.
- **Scenes** are rendered by `dev/maps/*.py` (the project's battlemap renderer, `bm.py`, plus `kit.py`): each writes
  `assets/scenes/<name>.webp`, a thumb, and `dev/maps/out/<name>.json` (walls, lights, regions) that `src/scenes.mjs` reads. Rerun the
  script after a layout change. The crawl map's city outline must match `CITY` in `scripts/crawl-rules.mjs`.
- **Journals** are Markdown in `src/journal/md/`, split into pages at each `## `; write `@Actor[Name]` / `@Table[Name]` for links.
- **Design source of truth:** the claude.ai project docs (festival layer, crawl spec/tables, hooks, Omen statblocks) and the
  Google Docs (Tournament Arc Setup, Edretnor City Crawl, Bestiary). Named characters are Christopher's to decide.
- Bump `module.json` `version` and add a `CHANGELOG.md` entry with each change.
