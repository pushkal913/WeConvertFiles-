---
version: alpha
name: "WeConvertFiles"
description: "A private, static-first browser utility suite with calm product surfaces and category-led discovery."
colors:
  primary: "#1a73e8"
  surface-light: "#ffffff"
  surface-dark: "#0f172a"
  pdf: "#f97316"
  images: "#10b981"
  data-office: "#6366f1"
  developer: "#f43f5e"
typography:
  sans:
    fontFamily: "Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial, sans-serif"
rounded:
  DEFAULT: "0.75rem"
  sm: "0.5rem"
  md: "0.625rem"
  lg: "0.75rem"
spacing:
  section-gap: "2rem"
  page-max: "80rem"
components:
  button:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.surface-light}"
    rounded: "{rounded.DEFAULT}"
  dialog:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.lg}"
  pdf-navigation:
    backgroundColor: "{colors.pdf}"
  images-navigation:
    backgroundColor: "{colors.images}"
  data-office-navigation:
    backgroundColor: "{colors.data-office}"
  developer-navigation:
    backgroundColor: "{colors.developer}"
---

# WeConvertFiles Design System

## Overview

### Creative North Star

A well-labelled desktop tool cabinet: many capable instruments, arranged by a small number of dependable colored drawers, with no visual noise competing with the task.

### Product context and register

- **Audience and primary job:** People who need a quick file or developer utility without uploading private content.
- **Target market(s) and evidence:** General web users; the English product, broad file formats, and existing routes provide no market-specific requirement.
- **Locale(s) and language policy:** English UI and content; use plain, direct labels and retain system fallbacks.
- **Usage scene:** Desktop and mobile, often urgent and single-purpose, with a dense catalogue followed by a focused workspace.
- **Register:** Product/tool. Utility, clarity, and trustworthy local-processing cues lead.
- **Memorable signature:** PDF orange, Images emerald, Data & Office indigo, and Developer rose consistently organize navigation, filters, sections, and cards.
- **Restraint:** Workspaces, forms, legal content, and long-form guides remain neutral and familiar.
- **Anti-references:** Random rainbow accents, glass-heavy decoration, dashboard chrome, or category meaning conveyed by color alone.
- **Token ownership/runtime mapping:** Model B. `assets/tailwind.css` and `tailwind.config.js` are canonical runtime sources; this file mirrors accepted values and interaction rules. CSS build and UI tests are the drift gates.

## Colors

Product blue is reserved for global actions, focus, and the All filter. Category colors organize discovery while every state retains labels, icons, and text. Light surfaces use white and slate text; dark surfaces use `#0f172a` with slate-50/slate-300 text. Category text is mixed toward slate or white to maintain readable contrast; borders and soft fills may use the pure accent.

## Typography

Inter leads when available, followed by the existing system stack. Tool names and controls use compact semibold/bold weights; descriptions use neutral slate text and comfortable line height. Labels use normal title case rather than decorative uppercase except established small metadata.

## Layout

The sticky shell leads to an `80rem` maximum-width product canvas. Catalogue filters stay in one contained horizontal row on narrow screens and never create document overflow. Tool sections use responsive one-to-four-column grids, stable card geometry, and a `2rem` section rhythm.

## Elevation & Depth

Hierarchy comes from tonal surfaces, borders, and the existing material/lift shadow grammar. Category cards use restrained colored border/glow treatment. Overlays and the sticky header may use stronger elevation; ordinary content must not stack decorative shadows.

## Shapes

Cards and standard controls use `0.75rem` radii. Filter chips are deliberately pill-shaped. Icons use rounded containers and consistent SVG strokes; dividers are quiet and category-tinted only in discovery areas.

## Components

### Foundational visual states

Default, hover, pressed, and selected states remain distinct in both themes. Focus-visible always uses a clear two-to-three-pixel outline with offset. Disabled or busy states preserve geometry. Success, warning, and error semantics keep text/icon labels and never depend only on hue.

### Buttons and actions

Primary global actions use product blue. Category filter buttons expose `aria-pressed`; tool cards are native buttons with category borders, labelled Open actions, and stable hit areas. Destructive actions remain visually separated inside tool workspaces.

### Navigation and data display

Primary navigation has four labelled dropdowns matching the four canonical category hubs. Homepage filters and sections use the same order, counts, names, and colors. Breadcrumbs and tool routes remain neutral and canonical.

### Forms and overlays

Existing fields, uploads, search dialog, and mobile drawer retain their familiar semantics, focus containment, Escape behavior, and privacy messaging. Task 28 does not restyle tool forms.

### Iconography

Use the existing compact inline SVG system with rounded strokes/fills. Category color may tint icon containers, but text labels remain mandatory.

### Motion

Feedback transitions are restrained at roughly 160–200 ms and must be interruptible. Hover lift and arrow movement communicate interactivity only. `prefers-reduced-motion` removes nonessential transforms and transitions.

### Content and data visualization

Voice is concise, factual, and action-oriented: Browse, Open, Convert, Download. Counts are explicit Arabic numerals. Any future charts require labels or tabular alternatives; color alone is never sufficient.

## Do's and Don'ts

- **Do:** Derive category membership and counts from the canonical catalogue/hub model.
- **Do:** Preserve the same category label, color, and order across shell, drawer, filters, sections, and cards.
- **Don't:** Reintroduce random per-tool navigation colors or duplicate category lists by hand.
- **Don't:** trade focus visibility, contrast, stable layout, or static canonical links for decorative effects.
