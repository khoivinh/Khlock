# 2026-03-24 — User Accounts & Cloud Sync (In Progress)

## What changed

Built the full auth + cloud sync stack (code complete, not yet deployed or tested end-to-end).

### Backend — `api/` directory (all new)
- Cloudflare Worker with D1 database
- JWT auth validation against Clerk JWKS (`jose` library)
- Three endpoints: `GET /api/preferences`, `PUT /api/preferences`, `DELETE /api/account`
- CORS configured for `khlock.pages.dev` and `localhost:5173`
- D1 migration: `user_preferences` table (user_id, zones, use_24h, sort_etw, theme, updated_at)

### Frontend
- **App.tsx**: Wraps in `<ClerkProvider>` when `VITE_CLERK_PUBLISHABLE_KEY` is set; runs without auth otherwise
- **Lifted zones state**: `selectedZones` moved from `TimeZoneConverter` → `WorldClock` so all four preference states (zones, use24h, sortEtw, theme) live together for sync
- **`useCloudSync` hook** (`hooks/use-cloud-sync.ts`): On sign-in, fetches cloud prefs and silently merges (union of zones, cloud wins for settings). On preference change, debounce-saves to cloud (1.5s). Tracks sync status.
- **Sidebar**: Clerk `<SignInButton mode="modal">` replaces the no-op placeholder. When signed in, shows user avatar + name + sign out. Sync status indicator (syncing/synced/error/offline).
- **API client** (`lib/api.ts`): fetchPreferences, savePreferences, deleteAccount
- **tsconfig.json**: Added `"types": ["vite/client"]` for `import.meta.env` support
- **Graceful fallback**: Without Clerk key, app works identically to before (localStorage only, login button disabled)

## Decisions made
- **Clerk modal** login flow (not redirect)
- **Silent merge** on first sign-in (union of local + cloud zones, no prompt)
- **Separate Worker** for API (not Pages Functions) — avoids conflict with SPA `_redirects` catch-all, cleaner for future iOS client
- **JWT-based, client-agnostic API** — designed so the future iOS app (native Sign in with Apple) hits the same endpoints
- **`isClerkConfigured` module-level constant** gates hook behavior — safe conditional hook call since the value never changes between renders

## Configuration done
- Clerk app created ("Khlockl" — has a typo, can rename in dashboard)
- Publishable key: `pk_test_dG9waWNhbC1kcmFnb24tMzcuY2xlcmsuYWNjb3VudHMuZGV2JA`
- JWKS URL: `https://topical-dragon-37.clerk.accounts.dev/.well-known/jwks.json`
- `.env` file created with both values
- `wrangler.toml` has JWKS URL set

## Next steps (to resume)
1. **Log into Wrangler**: `cd api && npx wrangler login`
2. **Create D1 database**: `npx wrangler d1 create khlock-db` → copy database_id into `wrangler.toml` (replace `REPLACE_WITH_D1_DATABASE_ID`)
3. **Run migration**: `npm run db:migrate:local` (local) or `npm run db:migrate` (remote)
4. **Enable social providers in Clerk dashboard**: Google + Apple under User & Authentication > Social Connections
5. **Add allowed origins in Clerk**: `https://khlock.pages.dev` and `http://localhost:5173` under Settings > Domains
6. **Test locally**: `cd api && npm run dev` (Worker on :8787), then `npm run dev` from project root (Vite on :5173)
7. **Deploy Worker**: `cd api && npm run deploy`
8. **Set production env vars** in Cloudflare Pages dashboard: `VITE_CLERK_PUBLISHABLE_KEY` (production key) and `VITE_API_URL` (deployed Worker URL)
9. **Rename Clerk app** from "Khlockl" to "Khlock" in dashboard

## Files changed

| File | Status |
|------|--------|
| `api/` (entire directory) | New |
| `client/src/App.tsx` | Modified |
| `client/src/lib/api.ts` | New |
| `client/src/hooks/use-cloud-sync.ts` | New |
| `client/src/pages/world-clock.tsx` | Modified |
| `client/src/components/time-zone-converter.tsx` | Modified |
| `client/src/components/sidebar.tsx` | Modified |
| `.env` / `.env.example` | New |
| `.gitignore` | Modified |
| `tsconfig.json` | Modified |

## Plan file
Full implementation plan at: `/Users/khoivinh/.claude/plans/velvety-drifting-dongarra.md`
