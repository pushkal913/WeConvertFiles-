# Phase 5 Task 28: Primary Navigation and Tool Filtering Design

Date: 2026-08-28

## Objective

Simplify primary navigation and homepage tool discovery without removing the useful desktop dropdowns. The header, mobile drawer, homepage filters, tool-card accents, and existing category hubs will use one four-category information architecture.

The change must preserve WeConvertFiles' static-first architecture, generated routes, tool functionality, privacy behavior, SEO canonicals, and existing product identity.

## Goals

- Reduce the desktop header from two standalone tool links plus four categories to four consistent category dropdowns.
- Make all dropdowns operable with pointer, keyboard, and touch input.
- Add instant homepage category filters for all 47 tools.
- Replace random per-tool card accents with one accessible color per category.
- Make desktop navigation, mobile navigation, homepage grouping, and canonical category hubs agree.
- Preserve every canonical tool link in rendered HTML and keep filtering client-side.

## Non-goals

- Removing desktop dropdown menus in this iteration.
- Redesigning the footer, tool workspaces, tool-page content hierarchy, or guide-page UX.
- Changing tool routes, category-hub routes, canonicals, sitemap entries, redirects, conversion behavior, or privacy claims.
- Adding URL persistence for the selected homepage filter.
- Migrating the static site to a framework.

## Canonical Category Model

The existing category-hub mapping is authoritative. Task 28 will reuse it rather than create a second filter-only taxonomy.

| UI label | Canonical hub | Count | Accent | Membership source |
| --- | --- | ---: | --- | --- |
| All | Homepage | 47 | WeConvertFiles blue/neutral | Complete catalogue |
| PDF | `/category/pdf-tools` | 13 | Orange | PDF hub mapping |
| Images | `/category/image-tools` | 14 | Emerald | Image hub mapping |
| Data & Office | `/category/convert-office` | 5 | Indigo | Convert & Office hub mapping |
| Developer | `/category/developer-tools` | 15 | Rose | Developer hub mapping |

This mapping intentionally differs from the current six homepage sections. Cross-format tools remain with their established SEO hub: image/PDF crossover tools stay in Images, and Office to PDF stays in Data & Office.

The category relationship must be derived from the existing catalogue, navigation groups, category-page metadata, and `extraToolIds`. It must not be duplicated as another manually maintained list.

## Desktop Header

The primary navigation will present four dropdown triggers in this order:

1. PDF
2. Images
3. Data & Office
4. Developer

The standalone Unlock PDF and Sign PDF links will be removed from the header. Both tools remain available in the PDF dropdown, global search, homepage grid, and PDF category hub.

Search, light/dark theme controls, branding, and About remain unchanged.

Each dropdown will:

- retain the existing canonical tool links for its category;
- include a clearly labelled link to the full category hub;
- expose `aria-expanded` and an explicit controlled-menu relationship;
- open on pointer hover or trigger activation;
- open from the keyboard with Enter, Space, or Arrow Down;
- support normal Tab navigation through its links;
- close on Escape, outside interaction, or opening another category;
- restore focus to its trigger when Escape closes it;
- remain usable at desktop zoom levels without clipping the viewport.

JavaScript will enhance an already-rendered static header. Tool and category links must remain available in the HTML when JavaScript is unavailable.

## Mobile Navigation

The existing mobile drawer remains the mobile primary-navigation pattern. It will use the same category labels, order, membership, and accents as the desktop header and homepage filters.

The drawer will continue to provide its existing modal isolation, focus containment, Escape behavior, close controls, search access, and legal/About link. Category headings will expose all canonical tool links without requiring a hover interaction.

## Homepage Filter and Tool Grid

A filter control will appear immediately before the tool grid:

**All 47 · PDF 13 · Images 14 · Data & Office 5 · Developer 15**

The filters are native buttons in a labelled group, not ARIA tabs, because they change one catalogue view rather than switch between independently meaningful tab panels.

Behavior:

- All is selected by default.
- Selecting a category updates `aria-pressed`, visible active styling, category sections, and the announced result count.
- Filtering is immediate and does not navigate or reload the page.
- All tool links remain represented in the rendered document; filtering changes visibility only.
- All view renders the four canonical category sections in navigation order.
- A category view renders only that category section and its count.
- Filters wrap or scroll safely on narrow screens without causing document-level horizontal overflow.
- The result announcement is concise and uses a polite live region.
- Reduced-motion preferences disable nonessential filter transitions.

The filter state is intentionally session-local and resets to All after reload. URL query or hash persistence is deferred unless real usage shows a need.

## Category Color System

Category color is a navigation aid, not the only source of meaning. Every filter and section retains a text label and every card retains its tool title and icon.

The category accent will be applied consistently to:

- the header/dropdown category icon;
- the selected homepage filter;
- the category section marker and count;
- each card's border or restrained surface accent;
- the tool icon treatment;
- the Open action text and arrow.

Descriptions and primary card text remain neutral. Light and dark variants must meet WCAG 2.2 AA contrast for text and focus states. The All filter uses the existing product-blue treatment rather than pretending to be another tool category.

Tool-specific icon shapes remain unchanged. Random per-tool color assignment will no longer determine navigation accents.

## Static-First Data Flow

`data/tools.mjs`, existing navigation groups, and `data/category-pages.mjs` remain the catalogue and category-hub sources of truth. Build scripts will derive the runtime mappings needed by the header, mobile drawer, and homepage.

The generated/static flow is:

1. Catalogue and category-page data define tool membership.
2. Generation scripts derive navigation data and static shell markup.
3. `layout.js` remains the sitewide shell source used by static page generation.
4. `index.html` contains the equivalent static homepage shell and filter container.
5. `app.js` enhances the homepage filter and tool-card interactions.
6. Validators prove generated files remain in sync with the sources.

Task 28 may add a small shared category metadata module if that is the smallest way to prevent duplicated labels, routes, colors, and memberships. It must remain plain JavaScript compatible with the existing build scripts and browser runtime.

## Accessibility Requirements

- Use native links for navigation and native buttons for dropdown/filter actions.
- Provide visible focus indicators in both themes.
- Keep accessible names and `aria-expanded` states accurate.
- Do not rely on hover or color alone.
- Support keyboard opening, traversal, closing, and focus restoration for dropdowns.
- Maintain the existing mobile drawer focus trap and modal semantics.
- Announce filter-result changes without moving focus.
- Preserve a logical heading hierarchy when category sections are hidden.
- Ensure category-colored Open labels and selected filters meet contrast requirements.
- Maintain usable controls at narrow widths and 200% zoom.

## Error and Fallback Behavior

- If JavaScript fails, the static header, category-hub links, tool links, and default All catalogue remain available.
- If catalogue/category data is inconsistent, validation fails rather than silently dropping or duplicating tools.
- A missing tool reference is treated as a build/test failure.
- The filter does not persist state, so stale or invalid filter values cannot strand users in an empty view.

## Testing Strategy

Task 28 will add focused automated coverage before implementation behavior is accepted:

- Category-model tests: exactly 47 unique tools; canonical counts 13/14/5/15; each tool belongs to one hub.
- Static-shell validation: four correctly ordered header categories; no standalone Unlock/Sign primary links; canonical hub links remain present.
- Homepage behavior tests: default All state, each filter count, visible tool membership, active state, and no horizontal overflow.
- Desktop dropdown tests: pointer, click, keyboard open, Escape close, outside close, single-open-menu behavior, and focus restoration.
- Mobile tests: the existing drawer remains keyboard operable and exposes all category groups.
- Accessibility checks: names, landmarks, focus visibility, button state, heading order, and supported contrast checks.
- Existing smoke, jitter, route crawler, validators, and generated-file drift checks.
- Manual browser review in light/dark themes at desktop and mobile widths before the Netlify preview handoff.

## Expected Change Surface

The implementation is expected to touch only the files needed to own and generate navigation/filter behavior, likely including:

- `data/tools.mjs` and/or a small shared category metadata module;
- `scripts/generate-layout-nav.mjs` and relevant validators;
- `layout.js` and generated static shell pages;
- `index.html`;
- `app.js`;
- `assets/tailwind.css` and compiled `assets/styles.css`;
- focused tests and `test/README.md` where commands or coverage change.

Generated HTML changes across many pages are acceptable only when they result from the existing static-shell generator and contain the intended header update. No unrelated page content may change.

## Acceptance Criteria

- The primary desktop header has four consistent category dropdowns and no standalone Unlock/Sign entries.
- Header dropdowns remain present and work with pointer and keyboard input.
- Desktop header, mobile drawer, homepage filters, and category hubs share one canonical taxonomy.
- Homepage filters show the correct 47-tool distribution and operate instantly without navigation.
- Category color replaces random tool-card navigation accents while meeting accessibility requirements.
- All canonical tool links, routes, SEO metadata, generated pages, and privacy behavior remain intact.
- Existing and new validations and browser tests pass.
- Netlify preview is ready for visual review before Task 29 begins.
