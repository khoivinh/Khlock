# Happyhour implementation plan — 2026-04-23 edits

Source request: `docs/2026-04-23-happyhour-edits-1554.md` + follow-up conversation.

## Context

Five workstreams queued. The universal footer + three new pages (About / Privacy / Support) are the biggest visible change and should ship with Google Analytics + a cookie-consent banner in the same release so new traffic is tracked from day one with proper consent. OG + favicon asset refresh and a drawer-icon color update ship as smaller incremental changes. Mobile drag-and-drop reliability gets an investigation pass before any code lands.

## Decisions captured

| Item | Decision |
|---|---|
| Contact email (Privacy "send an email" + Support link) | `hellodesigndept@gmail.com` |
| GA library | Raw `gtag.js` in `index.html` + thin `lib/analytics.ts` wrapper. No extra dependency. |
| Cookie consent library | Silktide Consent Manager, copied from Getbumpr (`src/js/silktide-consent-manager.js` + `src/css/silktide-consent-manager.css`). Minimal config: Necessary + Analytics only. |
| Consent mode | Default to `denied` for `analytics_storage` + `ad_storage`; Silktide flips to `granted` after user opt-in. |
| Drawer icon | **Color-only change** per updated Figma 95:2574. Alignment concern retracted by user. |
| Shared layout | New `SitePageLayout` component shared by About/Privacy/Support — header + body slot + universal footer. |
| Routes | `wouter`-based (already in use). Add `/about`, `/privacy`, `/support` before the fallback `<Route component={NotFound} />`. |

## Workstream A — Universal footer + 3 new pages

**Figma:** 272-4560 (footer), 272-4605 (About), 250-4243 (Privacy), 272-4634 (Support).

### Files

| Path | Action |
|---|---|
| `client/src/components/site-footer.tsx` | **New.** Two rows: `©2026 Design Dept Partners LLC` (DesignDept.com links as before, bold, no underline) then `About • Privacy • Support` with bullet separators. All three are `wouter` `<Link>`s. |
| `client/src/components/site-page-layout.tsx` | **New.** Shared shell: existing sticky header (reuse logo + wordmark + drawer) + body slot + `<SiteFooter />`. Keeps each new page thin. |
| `client/src/pages/about.tsx` | **New.** H1 "About" + body copy per Figma: *"Happyhour is a world clock designed and developed by Khoi Vinh in Brooklyn, NY. Stay tuned for an iOS version. For more information, visit **[DesignDept.com](https://designdept.com)**."* |
| `client/src/pages/privacy.tsx` | **New.** H1 "Privacy" + body copy per Figma (matches the short privacy statement drafted earlier — Clerk + Cloudflare D1 + no-tracking + email-to-delete). Contact link → `mailto:hellodesigndept@gmail.com`. |
| `client/src/pages/support.tsx` | **New.** H1 "Support" + body: *"For questions, comments and suggestions, **[send an email](mailto:hellodesigndept@gmail.com)**."* |
| `client/src/App.tsx` | **Modify.** Register three new routes. Order: `/`, `/about`, `/privacy`, `/support`, fallback → `NotFound`. |
| `client/src/components/sidebar.tsx` | **Modify.** Remove the copyright block at lines 332-342. The footer now lives site-wide, not in the drawer. |
| `client/src/pages/world-clock.tsx` | **Modify.** Render `<SiteFooter />` below the tile grid. |

### Copy

Every page's body is 1–2 short paragraphs (already verified against Figma screenshots). Use exact strings above.

### Tests

- Routing: visiting each new path renders the expected H1 and footer.
- Sidebar no longer shows copyright (moved to universal footer).
- Mobile 390px: footer rows stack cleanly, no horizontal overflow.
- Dark + Happy modes: footer text color adapts.

---

## Workstream B — Google Analytics + cookie consent

### Order-of-operations (how they interact)

Silktide loads first and defines the consent UI + storage. `gtag.js` loads next with consent mode set to `denied` by default. When the user accepts analytics in the Silktide banner, Silktide fires `gtag('consent', 'update', { analytics_storage: 'granted' })` and the `G-XXXXXXXXXX` tag starts recording page views and events.

### GA setup walk-through (user-side)

1. Open <https://analytics.google.com> and sign in.
2. **Admin → Create property.** Name: "Happyhour". Reporting timezone + currency to your preference.
3. **Business details:** pick "Small" size, "Online services or information" industry (any of these are fine — doesn't affect reporting).
4. **Business objectives:** at minimum select "Generate leads" and "Examine user behavior". These just pre-populate recommended reports; you can change later.
5. **Data collection → Web.** Click **Web**, enter `https://happyhour.day` as the stream URL, name "Happyhour Web", click **Create stream**.
6. Copy the **Measurement ID** (format `G-XXXXXXXXXX`). Paste it back to me — it's not secret (it's visible in the HTML anyway), but I'll need it to wire up.
7. Optionally enable **Enhanced measurement** (already on by default). It auto-tracks outbound clicks, scrolls, file downloads.
8. Done on Google's side. I'll take over from here.

### Files — cookie consent (Silktide)

| Path | Action |
|---|---|
| `client/public/silktide-consent-manager.css` | **Copy** from Getbumpr. |
| `client/public/silktide-consent-manager.js` | **Copy** from Getbumpr. |
| `client/index.html` | **Modify.** Add Silktide `<link>` + `<script>` in `<head>`, then the Silktide init call, then the gtag snippet with consent-mode defaults, then the gtag `config` line. Order matters — same pattern Getbumpr uses (`src/index.html:6-41`). |

### Silktide init (minimal customization)

```html
<script>
  window.silktideConsentManager.init({
    consentTypes: [
      {
        id: 'necessary',
        label: 'Necessary',
        description: 'Required for the site to work correctly.',
        required: true
      },
      {
        id: 'analytics',
        label: 'Analytics',
        description: 'Helps us understand how visitors use the site. We use Google Analytics.',
        gtag: 'analytics_storage'
      }
    ]
  });
</script>
```

Only two consent types — no ads, no preferences-cookie category. As minimal as it gets while still being compliant.

### Files — analytics wrapper

| Path | Action |
|---|---|
| `client/src/lib/analytics.ts` | **New.** Thin wrapper exposing `track(event, params)`. Internally checks `import.meta.env.PROD`, that `navigator.doNotTrack !== '1'`, and that `window.gtag` exists before dispatching. Also exposes `trackPageView(path)` for route-change tracking. |
| `client/src/App.tsx` | **Modify.** Add a `wouter` `useLocation` hook that fires `trackPageView` on every route change. |
| `client/.env.example` | **Modify / New.** Document `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`. |
| `client/.env` (gitignored) | **Modify.** Add the real ID locally for dev testing. |
| `client/index.html` | The `G-XXXXXXXXXX` literal goes here — can read from `import.meta.env.VITE_GA_MEASUREMENT_ID` at build time via Vite's HTML transform, or hard-code (GA IDs aren't secret). Hard-coding is simpler. |

### Events to instrument

| Event | Trigger | Parameters |
|---|---|---|
| `page_view` | wouter route change | `page_path`, `page_title` |
| `city_added` | new tile added | `city_key` |
| `city_removed` | tile removed | `city_key` |
| `appearance_changed` | sidebar theme cycle | `theme` (system / light / dark / happy) |
| `toggle_24h` | sidebar 24-hour switch | `enabled: boolean` |
| `toggle_east_west_sort` | sidebar sort switch | `enabled` |
| `toggle_relative_time` | sidebar relative-time switch | `enabled` |
| `sidebar_opened` | drawer toggle | — |
| `search_used` | first keystroke in Add Cities per session | — (no query string — privacy) |
| `sign_in` / `sign_out` | Clerk auth state change | — |
| `custom_time_set` | hero date/time picker committed | — |
| `custom_time_reset` | "Reset Time" button | — |
| `footer_link_clicked` | About / Privacy / Support footer click | `destination` |

Explicitly **not** tracking: search queries themselves, city timezone / location PII, exact time values, any Clerk user identifier.

### Tests

- First visit: banner appears, GA requests do NOT fire (check Network tab).
- Accept analytics: banner dismisses, GA `collect` request fires, consent-update event is visible in the DataLayer.
- Reject analytics: banner dismisses, no GA requests, `localStorage` holds the rejection.
- Route changes fire `page_view` with correct `page_path`.
- Dev environment (`npm run dev`): analytics are not sent (PROD gate).
- DNT enabled: analytics are not sent even in prod.

---

## Workstream C — OG image + favicon

**Figma:** 185-1716 (OG), 272-4671 (favicon).

### Files

| Path | Action |
|---|---|
| `client/public/og.png` | **Replace.** Export Figma 185:1716 at 2× (2400×1260) PNG. Overwrites the current OG image. |
| `client/public/favicon.svg` | **Replace.** Export Figma 272:4671 as SVG. Filled yellow circle + black checkmark eye + black smile — full brand mark. |
| `client/index.html` | **No change.** Existing meta tags already point at `/og.png` (with `og:image:width=1200`, `og:image:height=630`) and `/favicon.svg`. Browsers respect the `width/height` hints regardless of the actual 2× resolution. |

### Optional enhancement

- Also export a 180×180 PNG for iOS Home Screen (`apple-touch-icon`). Not strictly needed — modern iOS supports SVG — but a belt-and-suspenders choice. Defer unless asked.

### Tests

- View source on `https://happyhour.day`: favicon renders in tab.
- <https://www.opengraph.xyz/> or similar: OG preview matches Figma.
- Slack / Discord / iMessage link preview: shows new image (may need cache-bust via `?v=2` on URLs, or rename files).

---

## Workstream D — Drawer-closed icon color update

**Figma:** 95-2574.

User clarified: color change only, alignment concern was a mistake.

### Approach

1. Open Figma 95:2574 and pull the updated SVG + intended color / styling.
2. Update `client/src/components/icons/drawer-closed.tsx` to match. If the change is just the fill color, switch `fill="currentColor"` to an explicit hex — OR update the parent's `text-{color}` class if the icon should still inherit.
3. Verify no other side effects in dark / happy modes.

### Tests

- Light mode: icon renders in new color.
- Dark / Happy modes: icon remains legible.
- Sidebar open state (`DrawerOpenIcon`) still renders correctly — only the closed-state icon is changing.

---

## Workstream E — Mobile drag-and-drop reliability

### Reported behavior

Tap-and-hold a tile on mobile → yellow active background appears (so `TileTouchSensor` activation fires at 500 ms / 5 px). But dragging the finger scrolls the page instead of moving the tile. Succeeds ~60% of the time.

### Current config (`time-zone-converter.tsx:31–270`)

- `HandleTouchSensor` (grip icon) — `delay: 150 ms, tolerance: 8 px`.
- `TileTouchSensor` (tile body long-press) — `delay: 500 ms, tolerance: 5 px`.
- `DesktopMouseSensor` — extends `MouseSensor` to filter out synthetic mouse events fired after touch. Important: without this, mobile taps generate a mousedown that activates the mouse sensor first and cancels the touch sensor.
- Custom `TileTouchSensor` class at line 66 — worth re-reading; may already attempt `preventDefault` and need tuning.

### Hypothesis (to confirm during investigation)

Missing `touch-action: none` on the tile's draggable region. iOS Safari claims the touch for scrolling as soon as `touchmove` reports non-vertical movement. Even though dnd-kit's timer has fired, the scroll gesture still wins because the browser was never told to release the touch.

### Investigation steps

1. Read `DesktopMouseSensor` / `HandleTouchSensor` / `TileTouchSensor` (three custom classes, ~30 lines total).
2. Inspect whether the tile wrapper or any ancestor sets `touch-action`.
3. Test on iOS Safari and Android Chrome — matters because behavior differs.
4. Look at dnd-kit docs for recommended mobile patterns; 2024 best practice is `touch-action: manipulation` or `none` on the draggable.

### Possible fixes (cheap → expensive)

1. Add `touch-action: none` on the tile during the activation phase only (toggle via class when the sensor's timer fires). Low risk, minimal CSS.
2. Reduce `TileTouchSensor` tolerance from 5 → 3 px so small drifts count as drag rather than scroll.
3. Switch from `TouchSensor` to `PointerSensor` (dnd-kit recommends PointerSensor as the modern default). Bigger rewrite — re-examines the `DesktopMouseSensor` synthetic-event workaround.

### Deliverable

~20-minute investigation → a specific recommended fix before any code change. Fix itself likely <30 minutes.

### Tests

- iOS Safari: tap-and-hold a tile, drag it to a new position — succeeds at least 95% of the time across 20 attempts.
- iOS Safari: single tap (no hold) → no drag, normal tap behavior preserved.
- iOS Safari: scroll the page without touching any tile — still scrolls normally.
- Android Chrome: same battery of tests.

---

## Sequencing

### Batch 1 — small wins (~45 min)
- **D** (drawer icon color update)
- **C** (OG + favicon asset swap)

### Batch 2 — new surfaces + instrumentation (~3 hours)
- **A** (universal footer + 3 pages)
- **B** (GA + cookie consent) — immediately after A, so page-view tracking is accurate from launch

### Separate short session (~45 min)
- **E** (mobile drag) — investigate first, then propose + apply a specific fix

## Open items blocking start

- GA Measurement ID (`G-XXXXXXXXXX`) — user walks through the setup per instructions above, then shares the ID. Nothing else is blocked.

## Verification (once everything lands)

- `npx tsc --noEmit` clean.
- `npm run build` clean.
- Playwright QA pass (reuse the agent pattern from 2026-04-22): verify all new routes, footer links, cookie banner appearance/dismissal, GA requests gated on consent, drawer icon color, OG + favicon rendering.
- Manual device check for mobile drag before claiming E done.
