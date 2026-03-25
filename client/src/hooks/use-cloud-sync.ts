import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { fetchPreferences, savePreferences } from "@/lib/api";

export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

export interface SyncablePreferences {
  zones: string[];
  use24h: boolean;
  sortEastToWest: boolean;
  theme: "light" | "dark" | "system";
}

interface UseCloudSyncOptions {
  preferences: SyncablePreferences;
  setPreferences: (prefs: SyncablePreferences) => void;
}

const DEBOUNCE_MS = 1500;

function mergePreferences(local: SyncablePreferences, cloud: SyncablePreferences): SyncablePreferences {
  // Union zones: cloud order first, then local-only zones appended, deduped, capped at 16
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const z of [...cloud.zones, ...local.zones]) {
    if (!seen.has(z)) {
      seen.add(z);
      merged.push(z);
    }
  }

  return {
    zones: merged.slice(0, 16),
    use24h: cloud.use24h,
    sortEastToWest: cloud.sortEastToWest,
    theme: cloud.theme,
  };
}

// Hook that uses Clerk auth — must be called inside ClerkProvider
function useCloudSyncWithAuth({ preferences, setPreferences }: UseCloudSyncOptions): {
  syncStatus: SyncStatus;
} {
  const { getToken, isSignedIn } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMergingRef = useRef(false);
  const prevSignedInRef = useRef(false);
  const prefsRef = useRef(preferences);
  prefsRef.current = preferences;

  // Initial sync on sign-in
  useEffect(() => {
    if (!isSignedIn || prevSignedInRef.current) {
      prevSignedInRef.current = isSignedIn ?? false;
      if (!isSignedIn) setSyncStatus("idle");
      return;
    }
    prevSignedInRef.current = true;

    let cancelled = false;

    async function initialSync() {
      isMergingRef.current = true;
      setSyncStatus("syncing");

      try {
        const token = await getToken();
        if (!token || cancelled) return;

        const cloud = await fetchPreferences(token);

        if (cancelled) return;

        if (!cloud) {
          await savePreferences(token, prefsRef.current);
        } else {
          const merged = mergePreferences(prefsRef.current, cloud);
          setPreferences(merged);
          await savePreferences(token, merged);
        }

        if (!cancelled) setSyncStatus("synced");
      } catch {
        if (!cancelled) setSyncStatus("error");
      } finally {
        isMergingRef.current = false;
      }
    }

    initialSync();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save on preference changes
  const prefsKey = `${preferences.zones.join(",")}|${preferences.use24h}|${preferences.sortEastToWest}|${preferences.theme}`;

  useEffect(() => {
    if (!isSignedIn || isMergingRef.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setSyncStatus("syncing");
      try {
        const token = await getToken();
        if (!token) return;
        await savePreferences(token, prefsRef.current);
        setSyncStatus("synced");
      } catch {
        setSyncStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [isSignedIn, prefsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { syncStatus };
}

// No-op version when Clerk isn't configured
function useCloudSyncDisabled(): { syncStatus: SyncStatus } {
  return { syncStatus: "idle" };
}

const isClerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Public hook — delegates based on whether Clerk is configured
export function useCloudSync(options: UseCloudSyncOptions): { syncStatus: SyncStatus } {
  // This conditional is safe because isClerkConfigured is a module-level constant —
  // the branch never changes between renders.
  if (isClerkConfigured) {
    return useCloudSyncWithAuth(options); // eslint-disable-line react-hooks/rules-of-hooks
  }
  return useCloudSyncDisabled();
}
