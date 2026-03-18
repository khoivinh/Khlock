# World Khlock — Product Requirements Document

## Context

World Khlock is a world clock and timezone converter web app (React/TypeScript/Tailwind, deployed on Cloudflare Pages). Phases 1-2 (codebase cleanup, deployment, mobile UX fixes) are complete. The scroll-driven header animation is confirmed smooth. This PRD covers two tracks:

1. **Phase 3: UI Revisions + Cloud Sync** — revise clock tile interactions, hero clock, city menu, drag-and-drop, and add user accounts with cloud-synced preferences
2. **iOS Native App** — SwiftUI app with feature parity + home/lock screen widgets + cloud sync

---

## Track 1: UI Revisions + Cloud Sync (Web)

### Goal
Revise the current UI — refine clock tile interactions, simplify the layout to grid-only, improve the Add Cities menu, and update the custom time reset flow. Add user accounts and cloud-synced preferences so clock configurations persist across devices.

### Scope: "Reset Time" Button (replaces "Show Live Time")
**Files:** `client/src/pages/world-clock.tsx`, `client/src/components/digital-clock.tsx`
**Figma:** [Hero Clock component (node 70:1954)](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=70-1954)

- [ ] Remove the blue filled "Show Live Time" button from the sticky header
- [ ] Add a "RESET TIME" text link in the hero clock's zone/temp row, right-aligned
  - Style: Inter SemiBold, 14px, uppercase, color `#4e82ee`
  - No icon — text only
  - Padding: 10px horizontal, 7px vertical
  - Visible only when in custom time mode
  - Present in both desktop and mobile hero variants

### Scope: Add Cities Menu Redesign
**Files:** `client/src/components/time-zone-converter.tsx`
**Figma:** [Add Time Zone section (node 36:3207)](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=36-3207)

- [ ] Widen the Add Cities menu to span the full body column width (896px desktop, 327px mobile)
- [ ] Menu overlays clock tiles below (does not push content down)
- [ ] On mobile, position the menu near the top of the viewport so the user can see as much of it as possible
- [ ] Keep existing visual style: white background, `#e5e7eb` border, rounded 8px, shadow, search field with magnifying glass icon
- [ ] When a searched city is already displayed as a clock tile, show "Already displayed" status message instead of hiding it or showing "No cities found"

### Scope: Remove List View Toggle
**Files:** `client/src/components/time-zone-converter.tsx`, `client/src/components/digital-clock.tsx`

- [ ] Remove the grid/list view toggle buttons entirely
- [ ] Remove the `layout` state and all list-view-related code
- [ ] Grid view is now the only layout
- [ ] Remove `verticalListSortingStrategy` import and usage

### Scope: Remove Meeting Planner Feature
**Files:** `client/src/components/digital-clock.tsx`, `client/src/components/meeting-planner-modal.tsx`, `client/src/components/time-zone-converter.tsx`

- [ ] Remove the calendar icon from clock tiles
- [ ] Remove the MeetingPlannerModal component and its import
- [ ] Delete `client/src/components/meeting-planner-modal.tsx`
- [ ] Remove `otherZoneKeys` prop threading from TimeZoneConverter and DigitalClock

### Scope: Next Day / Prev Day Badge
**Files:** `client/src/components/digital-clock.tsx`
**Figma:** [Tile Zone and Temp component (node 27:973)](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=27-973)

- [ ] Add an inline badge next to the GMT offset when the displayed time falls on a different calendar day than the hero clock's time
  - "NEXT DAY" if the tile's date is ahead of the hero's date
  - "PREV DAY" if the tile's date is behind the hero's date
- [ ] Badge specs:
  - Border: 1px solid `#6b7280`
  - Border radius: 3px
  - Padding: 5px horizontal
  - Text: Inter Bold, 7px, uppercase, color `#6b7280`
  - Gap between zone row items: 6px (instead of default 10px) when badge is present

### Scope: Drag-and-Drop Revisions
**Files:** `client/src/components/time-zone-converter.tsx`, `client/src/components/digital-clock.tsx`
**Figma:** [Desktop Drag Tile frame (node 4:2)](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=4-2), [Clock Tile states (node 17:2410)](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=17-2410)

- [ ] Blue drop indicator always appears to the LEFT of the destination spot
  - Width: 4px, color: `#3c83f6`, border radius: 4px, full height of tile
- [ ] Ghost tile (source position while dragging): 50% opacity
- [ ] Drag overlay (tile following cursor): 90% opacity, yellow active background (`#fdf19d`), border 1px solid `#ffedbd`, shadow `0px 1px 2px rgba(0,0,0,0.15)`

### Scope: Ellipsis Menu Replaces X Button
**Files:** `client/src/components/digital-clock.tsx`

- [ ] Replace the X (close) button in each clock tile with an ellipsis icon enclosed in a circle (~17px)
- [ ] Clicking/tapping the ellipsis opens a native browser `confirm()` dialog asking the user to confirm removal
- [ ] If confirmed, remove the clock tile; if cancelled, do nothing

### Scope: Clock Tile Design Refinements
**Files:** `client/src/components/digital-clock.tsx`, `client/src/index.css`
**Figma:** [Clock Tile states (node 17:2410)](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=17-2410)

- [ ] Tile states from Figma:
  - **Default:** white background
  - **Hover:** `#f0f0f0` background (desktop only, `@media(hover:hover)`)
  - **Focus (editing/dropdown open):** `#fdf7ca` background, 1px `#ffedbd` border
  - **Active (being dragged):** `#fdf19d` background, 1px `#ffedbd` border, shadow `0px 1px 2px rgba(0,0,0,0.15)`
- [ ] Desktop tile layout: city name and time stacked vertically, 15px gap between city+time block and zone+temp row
- [ ] Mobile tile layout: city name and time side-by-side (horizontal), 0px gap to zone+temp

### Scope: Cloud Sync & User Accounts (Planning Phase)
**Auth:** Clerk (Google + Apple social login, passkeys)
**Backend:** Cloudflare Workers + D1

This section is for **planning only** — implementation deferred to a later phase.

- [ ] Design decisions needed before implementation:
  - Header UI: "Login or Sign Up" button (logged out) → hamburger icon (logged in)
  - Hamburger menu behavior: slide-out drawer vs. dropdown? What items appear?
  - Login flow: Clerk modal vs. redirect?
  - Mobile behavior for login/hamburger interactions?
- [ ] Planned implementation (not yet):
  - Integrate Clerk for authentication (sign in / sign up / sign out)
  - Create Cloudflare Worker API endpoints (`GET/PUT /api/preferences`)
  - Create D1 schema: `user_preferences` table (user_id, zones JSON, updated_at)
  - Sync logic: on sign-in merge localStorage with cloud; on change debounce-save
  - Graceful fallback: unauthenticated users continue using localStorage only

### Out of Scope (Phase 3)
- Theme/color palette changes (current palette is close to final)
- Clerk implementation (design decisions only in this phase)

---

## Track 2: iOS Native App

### Goal
Build a native SwiftUI iOS app with full feature parity to the web app, plus home screen and Lock Screen widgets. Share user accounts and synced preferences with the web app.

### Core Features (Parity with Web)

1. **World Clock Display**
   - Hero clock showing local timezone with large digital time
   - Additional clocks grid (reorderable, grid layout only)
   - Live time with seconds display
   - Custom time mode (tap to edit, "Reset Time" text link to return to live)

2. **City Management**
   - Search and add cities (same 1500-city dataset from city-timezones)
   - Full-width search menu with "Already displayed" status for duplicate cities
   - Remove cities (ellipsis menu → confirmation)
   - Drag-to-reorder with left-side drop indicator
   - Max 12 clocks
   - Cloud sync of city list and order via Clerk account (cross-platform with web)

3. **Weather Integration**
   - Temperature display per city via Open-Meteo API (free, no auth)
   - Color-coded temperature

4. **Day Indicator**
   - "Next Day" / "Prev Day" badge on tiles where displayed time is a different calendar day

5. **Appearance**
   - Light/dark/system theme support
   - Minimal, clean design matching web app aesthetic
   - Smooth animations and transitions

### iOS-Specific Features

6. **Home Screen Widgets**
   - Small widget: single city clock + weather
   - Medium widget: 2-3 city clocks
   - Large widget: up to 6 city clocks
   - Configurable city selection per widget

7. **Lock Screen Widgets**
   - Inline widget: single city time
   - Circular widget: city abbreviation + time
   - Rectangular widget: city + time + weather

### Technical Architecture

- **Language:** Swift 6
- **UI Framework:** SwiftUI
- **Minimum iOS:** 17.0 (for latest widget APIs)
- **Data Persistence:** SwiftData or UserDefaults + App Groups (for widget data sharing)
- **Networking:** URLSession + async/await for Open-Meteo API and sync API
- **City Database:** Bundle the city-timezones dataset as JSON, load at launch
- **Widget Framework:** WidgetKit with TimelineProvider
- **Cloud Sync:** Clerk iOS SDK for auth + Cloudflare Workers API (shared with web)

### Project Structure (Proposed)
```
Khlock/
├── KhlockApp/
│   ├── App/                    # App entry, navigation
│   ├── Models/                 # City, Clock, Weather models
│   ├── Views/
│   │   ├── WorldClockView      # Main screen
│   │   ├── ClockTileView       # Individual clock tile
│   │   ├── HeroClockView       # Large hero clock
│   │   └── CitySearchView      # City search/add
│   ├── ViewModels/             # ObservableObject view models
│   ├── Services/
│   │   ├── WeatherService      # Open-Meteo API client
│   │   ├── SyncService         # Cloudflare Workers API client for preference sync
│   │   └── CityDatabase        # City lookup & search
│   └── Resources/
│       └── cities.json         # Bundled city database
├── KhlockWidgets/
│   ├── KhlockWidgets.swift     # Widget bundle
│   ├── HomeScreenWidget.swift  # Small/Medium/Large
│   └── LockScreenWidget.swift  # Inline/Circular/Rectangular
└── Shared/
    └── Models/                 # Shared between app & widgets
```

### Phased Delivery (iOS)
1. **MVP:** World clock display, city search, add/remove, drag-to-reorder
2. **V1.0:** Weather integration, day indicator badges, custom time mode, theme support, cloud sync
3. **V1.1:** Home screen & Lock Screen widgets

---

## Verification

### Web (Track 1)
- Visual inspection on Chrome mobile emulator (390x844 iPhone 14)
- Test both light and dark modes
- Verify grid layout at 375px, 768px, 1024px, 1440px
- Confirm drag-to-reorder: drop indicator always on LEFT, correct opacity for ghost (50%) and overlay (90%)
- Verify "Reset Time" text link appears in hero zone/temp row in custom time mode and resets correctly
- Verify Add Cities menu spans full body width, overlays content, positions near top on mobile
- Verify "Already displayed" message appears for cities already shown
- Verify Next Day / Prev Day badges appear for clocks on different calendar days
- Verify ellipsis icon opens native confirm dialog and removes tile on confirmation
- Deploy to https://khlock.pages.dev/ and test on real device

### iOS (Track 2)
- Run in Xcode Simulator (iPhone 15 Pro, iPhone SE)
- Test widget rendering in widget gallery
- Verify Open-Meteo API calls work on device
- Test drag-to-reorder with haptic feedback
- Test light/dark mode transitions
- Sign in with same account as web, verify same cities appear
- Test offline behavior (local changes sync when back online)

---

## Recommended Next Step
Start with **Track 1** UI revisions since they're lower risk and build momentum. Suggested implementation order:
1. Remove list view toggle and meeting planner (cleanup)
2. Replace X button with ellipsis + confirm dialog
3. Add Next Day / Prev Day badge
4. Revise drag-and-drop behavior
5. Redesign Add Cities menu (full-width, overlay, "Already displayed")
6. Move "Reset Time" button to hero zone/temp row
7. Cloud sync design decisions (planning only)

Once the web design is finalized, use it as the definitive reference for the iOS app.
