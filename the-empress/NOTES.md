# The Empress — Build Notes

Resolved open questions from the spec (Section 8), decided during build since this task
runs without an interactive handoff step:

1. **Palette hex values** — locked. Two full theme palettes (In Gold / In Shadow), each with
   its own jewel-tone accent per room, distinct from KiTee's brand gold (#D4AF37):
   - Antique gold accent: `#B07C2C` (In Gold) / `#E3C46B` (In Shadow)
   - The Court (sapphire), The Vault (emerald), The Body (ruby), The Ledger (amethyst),
     The Sanctuary (rose), The Estate (teal) — see `<style>` custom properties in the HTML
     file for exact values per theme.
2. **Product name suffix** — "The Empress: A Full Life Planner" (per spec, already confirmed).
3. **Copy Prompt Guide replacement** — built as a **Planner Prompt Guide** PDF: reflection
   and goal-setting prompts per room, plus a "how to use this guide" page and a weekly
   closing ritual, instead of website-copy prompts (no SiteFill applies to this product).
4. **Micro-Milestones default chunk size** — 5 evenly spaced milestones per goal (20% each),
   auto-generated when a goal is created (if the toolkit feature is on) or on demand via a
   "Break this into 5 milestones" action. Fully editable/removable afterward.
5. **Cycle tracking depth** — basic calendar-style log (period start/end, flow level, free-text
   symptom tags, free-text mood tag) with a simple next-period estimate computed from the
   average gap between logged cycles. No deep symptom/mood correlation analytics — kept
   lightweight per the "general planner," not clinical-tracker, positioning.

## Architecture notes

- Single file, vanilla JS, no build step, no external requests, no frameworks or CDN fonts.
- Primary persistence: `localStorage`. `navigator.storage.persist()` is requested on load.
- Optional upgrade: File System Access API linked-file save (auto-saves a real `.json` file
  on every change), with the file handle persisted in IndexedDB so it can be reconnected
  across reloads (permission is re-requested on click, since browsers require a user gesture).
  Falls back gracefully (feature hidden) in browsers without FSA support — manual
  Export/Import JSON is always available regardless of browser.
- All 7 Court Toolkit features are implemented and independently toggleable in Settings:
  Redirect Method, Micro-Milestones, Visual-First Progress, Body Doubling Mode, Task Fog Log,
  Energy-Based Planning, and Check-In Nudges.
- No red states anywhere in the UI; progress/positive states use gold/amber only.

## Deliverables

`build/` contains the 3 source deliverables; `dist/KiTeeStudio-TheEmpress.zip` is the final
packaged ZIP (exactly 3 files, per the KiTee delivery standard):

- `KiTeeStudio-TheEmpress-EDITABLE.html`
- `KiTeeStudio-TheEmpress-SetupGuide.pdf` (6 pages)
- `KiTeeStudio-TheEmpress-PlannerPromptGuide.pdf` (6 pages)
