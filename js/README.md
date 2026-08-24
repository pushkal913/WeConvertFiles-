# JavaScript modules

Incremental code-splitting of the tool app (Phase 2, Task 10).

`app.js` is the shared **core**: the dependency loader, routing, theme, dashboard,
file handling, shared UI helpers, and the tool implementations that have not been
split out yet. Historically it contained every tool's implementation, so a
visitor opening one tool downloaded the code for all 47.

## How the split works

- Core keeps a small **tool-module runtime**: `MODULE_TOOLS` (the set of ids that
  live in their own file), a registry, and `loadToolModule(id)` which injects
  `js/tools/<id>.js` on demand.
- A migrated tool ships as `js/tools/<id>.js` and calls
  `window.WCF.registerTool(id, { render(container, ctx) })`. `render` injects the
  tool's options UI and wires it, using the shared class strings passed in
  `ctx.classes` and core helpers exposed globally by `app.js`.
- `openTool(id)` awaits `loadToolModule(id)` before `renderToolOptions(id)`; for a
  migrated tool, `renderToolOptions` delegates to the registered module and
  returns. Non-migrated tools are untouched.
- The pages don't need per-tool script tags: every page loads the same
  `app.js`, which reads the page's `data-tool-id` and lazily loads only that
  tool's module. So opening one tool never downloads another tool's code.

Third-party library loading is unchanged — `converterLibraries` +
`toolLibraryDependencies` still lazy-load heavy CDN libraries per tool.

## Migrated so far

| Tool | Module |
| --- | --- |
| password-generator | `js/tools/password-generator.js` |
| case-converter | `js/tools/case-converter.js` |

The runtime `MODULE_TOOLS` set, each tool's `module` field in `data/tools.mjs`,
and the file on disk are cross-checked by `scripts/validate-catalogue.mjs`, so
they cannot drift.

## Size comparison (measured)

Splitting these two tools out of `app.js`:

| File | Before | After | gzip after |
| --- | --- | --- | --- |
| `app.js` (core, every page) | 372,913 B | **351,395 B** (−21,518) | 79,294 B (−3,184) |
| `js/tools/password-generator.js` (only its page) | — | 14,625 B | 3,918 B |
| `js/tools/case-converter.js` (only its page) | — | 10,319 B | 2,392 B |

Effect today: the **45 other tool pages no longer download** the password-generator
or case-converter code at all, and those two tools load their own module lazily
only on their own page. The full win arrives as more tools migrate: once most
tools live in `js/tools/`, `app.js` shrinks toward a small shared core and each
page loads only that core plus one tool module.

## Adding another tool

1. Move the tool's options HTML (its `panels[id]` entry) and its wiring branch out
   of `app.js` into `js/tools/<id>.js`, registering a `render(container, ctx)`.
2. Add the id to `MODULE_TOOLS` in `app.js`.
3. Set the tool's `module` to `js/tools/<id>.js` in `data/tools.mjs`.
4. Run `npm run validate` and confirm the tool still works.

Only pure, self-contained tools should move without extra care; tools that share
a conversion function or global state need those dependencies exposed on
`window.WCF` first.
