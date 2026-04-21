import { getCityByKey, type TimezoneOption } from "./city-lookup";

const TILE_CACHE_KEY = "happyhour:tile-cache";

/** Cache selected-zone metadata to localStorage so clock tiles can render
 *  on page load before the full 2 MB cities.json parses. */
export function cacheTileMetadata(cities: TimezoneOption[]): void {
  if (cities.length === 0) return;
  try {
    const existing = readCache();
    for (const city of cities) {
      existing[city.key] = city;
    }
    localStorage.setItem(TILE_CACHE_KEY, JSON.stringify(existing));
  } catch {
    // Quota exceeded or JSON errors — cache is best-effort; silently ignore.
  }
}

export function getCachedTile(key: string): TimezoneOption | undefined {
  return readCache()[key];
}

/** Lookup city metadata with a tile-cache fallback. Use this wherever a
 *  TimezoneOption is needed during initial render — before loadTopCities /
 *  loadCities resolves, the cache can still populate tiles for returning users. */
export function getCityOrCachedTile(key: string): TimezoneOption | undefined {
  return getCityByKey(key) ?? getCachedTile(key);
}

let memo: Record<string, TimezoneOption> | null = null;

function readCache(): Record<string, TimezoneOption> {
  if (memo) return memo;
  try {
    const raw = localStorage.getItem(TILE_CACHE_KEY);
    memo = raw ? (JSON.parse(raw) as Record<string, TimezoneOption>) : {};
  } catch {
    memo = {};
  }
  return memo;
}
