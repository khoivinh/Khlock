# Happyhour Backlog

## Track 1: Web UI

- [x] **Add Cities menu should overlay content** — Shipped: menu now overlays clock tiles instead of pushing them down.
- [x] **Rename "World Khlock" to "Khlock"** — Update PRD title, any in-code references to "World Khlock", page title, etc.
- [x] **Rename "Khlock" to "Happyhour"** — Full rebrand shipped 2026-04-20: new domain `happyhour.day`, favicon, OpenGraph image, header logo, Happy Mode theme.
- [x] **Add supporting graphics** — OpenGraph thumbnail, favicon, and any other meta images needed for link previews and browser tabs.
- [ ] **Add copyright and footer** — Add a footer section with copyright information at the bottom of the page.
- [ ] **Sync rel-time toggle to cloud** — Half-wired: `showRelativeTime` is on `SyncablePreferences` / `CloudPreferences` types, but (a) `world-clock.tsx` still reads/writes `SHOW_REL_TIME_KEY` to localStorage directly instead of plumbing through the cloud-sync hook, (b) `api/src/routes/preferences.ts` has no `show_rel_time` column handling, (c) no D1 migration exists for the column. Needs: migration → API updates → client plumbing.
