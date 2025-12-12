
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { initialize, fetchAndActivate, getAll } from "@/lib/remoteConfig";
import {
  REMOTE_CONFIG_SCHEMA_VERSION,
  REMOTE_CONFIG_TTL_MS,
  defaultConfig,
  buildContactData,
  ContactData,
} from "@/lib/config";
import { db } from "@/lib/db";

type RemoteConfigContextType = {
  contactData: ContactData;
  loading: boolean;
};

const RemoteConfigContext = createContext<RemoteConfigContextType | undefined>(undefined);

const LEGACY_CONFIG_KEY = "remoteConfigData";
const LEGACY_LAST_FETCH_KEY = "remoteConfigLastFetch";
const CONFIG_STORAGE_KEY = `remoteConfigData:v${REMOTE_CONFIG_SCHEMA_VERSION}`;
const LAST_FETCH_STORAGE_KEY = `remoteConfigLastFetch:v${REMOTE_CONFIG_SCHEMA_VERSION}`;
const SESSION_FETCH_STORAGE_KEY = `remoteConfigFetchedThisSession:v${REMOTE_CONFIG_SCHEMA_VERSION}`;
const FAILED_FETCH_RETRY_MS = 15 * 60 * 1000; // Retry in 15 minutes after a failure
const REMOTE_CONFIG_SNAPSHOT_ID = "current";

const hasFetchedThisSession = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_FETCH_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const markFetchedThisSession = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_FETCH_STORAGE_KEY, "1");
  } catch {
    // Best-effort only; if sessionStorage is unavailable we just won't persist the flag.
  }
};

const parseStoredConfig = (raw: string | null): ContactData | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const configPayload = parsed?.config ?? parsed;
    return buildContactData({ ...defaultConfig, ...configPayload });
  } catch (error) {
    console.error("[RemoteConfig] Failed to parse stored config, using defaults.", error);
    return null;
  }
};

const cleanupLegacyStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_CONFIG_KEY);
  localStorage.removeItem(LEGACY_LAST_FETCH_KEY);
};

// This function now runs on the client, avoiding server-side execution of localStorage
const getInitialContactData = (): ContactData => {
  if (typeof window === "undefined") {
    return buildContactData(defaultConfig);
  }

  const storedConfig = parseStoredConfig(localStorage.getItem(CONFIG_STORAGE_KEY));
  if (storedConfig) return storedConfig;

  // One-time migration from legacy key if present.
  const legacyConfig = parseStoredConfig(localStorage.getItem(LEGACY_CONFIG_KEY));
  return legacyConfig ?? buildContactData(defaultConfig);
};

const serializeConfig = (config: Record<string, string>) => {
  const sortedEntries = Object.keys(config)
    .sort()
    .map((key) => [key, config[key]]);
  return JSON.stringify(sortedEntries);
};

const saveSnapshotToDexie = async (config: Record<string, string>) => {
  try {
    const hash = serializeConfig(config);
    await db.table("remoteConfigSnapshots").put({
      id: REMOTE_CONFIG_SNAPSHOT_ID,
      config,
      hash,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("[RemoteConfig] Failed to persist snapshot in Dexie", error);
  }
};

const loadSnapshotFromDexie = async (): Promise<Record<string, string> | null> => {
  try {
    const snapshot = await db.table("remoteConfigSnapshots").get(REMOTE_CONFIG_SNAPSHOT_ID);
    return snapshot?.config ?? null;
  } catch (error) {
    console.error("[RemoteConfig] Failed to read snapshot from Dexie", error);
    return null;
  }
};


export function RemoteConfigProvider({ children }: { children: ReactNode }) {
  // Initialize state with data from localStorage or defaults. This is synchronous.
  const [contactData, setContactData] = useState<ContactData>(getInitialContactData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let isSyncInFlight = false;

    const adoptSnapshot = async () => {
      const snapshotConfig = await loadSnapshotFromDexie();
      if (snapshotConfig && isMounted) {
        setContactData(buildContactData({ ...defaultConfig, ...snapshotConfig }));
      }
    };

    const shouldFetch = () => {
      if (typeof window === 'undefined') return false;
      const lastFetchString = localStorage.getItem(LAST_FETCH_STORAGE_KEY);
      if (!lastFetchString) return true; // Never fetched before

      const lastFetchTime = parseInt(lastFetchString, 10);
      return (Date.now() - lastFetchTime) > REMOTE_CONFIG_TTL_MS;
    };

    async function syncRemoteConfig(options?: { force?: boolean; background?: boolean }) {
      if (isSyncInFlight) return;
      const force = options?.force === true;
      const background = options?.background === true;

      // Only one forced refresh per session when connectivity is available.
      if (force && hasFetchedThisSession()) return;

      isSyncInFlight = true;
      cleanupLegacyStorage();

      if (!force && !shouldFetch()) {
        adoptSnapshot();
        if (!background) setLoading(false);
        isSyncInFlight = false;
        return;
      }
      
      console.log("[RemoteConfig] Cache is stale, fetching new data...");
      try {
        await initialize(force ? { minimumFetchIntervalMillis: 0 } : undefined);
        await fetchAndActivate();
        
          const remoteValues = getAll();
          const newConfig: Record<string, string> = {};
          Object.keys(remoteValues).forEach(key => {
            newConfig[key] = remoteValues[key].asString();
          });

          const finalConfig = { ...defaultConfig, ...newConfig };
          const finalContactData = buildContactData(finalConfig);

        if (isMounted) {
          setContactData(finalContactData);
          await saveSnapshotToDexie(finalConfig);
          localStorage.setItem(
            CONFIG_STORAGE_KEY,
            JSON.stringify({ version: REMOTE_CONFIG_SCHEMA_VERSION, config: finalConfig }),
          );
          localStorage.setItem(LAST_FETCH_STORAGE_KEY, Date.now().toString());
          markFetchedThisSession();
        }
      } catch (error) {
        console.error("[RemoteConfig] Error during background sync:", error);
        // Avoid tight retry loops when offline; retry sooner than full TTL.
        const nextRetry = Date.now() - REMOTE_CONFIG_TTL_MS + FAILED_FETCH_RETRY_MS;
        localStorage.setItem(LAST_FETCH_STORAGE_KEY, String(nextRetry));
      } finally {
        if (isMounted && !background) setLoading(false);
        isSyncInFlight = false;
      }
    }

    const handleOnline = () => {
      void syncRemoteConfig({ force: true, background: true });
    };

    // First pass: keep existing behavior (fast) to unblock UI.
    void (async () => {
      await syncRemoteConfig();

      // If we're online when the app starts (or when it first becomes online),
      // do a one-time forced refresh so Remote Config updates apply immediately.
      if (typeof navigator !== "undefined" && navigator.onLine) {
        void syncRemoteConfig({ force: true, background: true });
      }
    })();

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
    }

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
      }
    };
  }, []);

  return (
    <RemoteConfigContext.Provider value={{ contactData, loading }}>
      {children}
    </RemoteConfigContext.Provider>
  );
}

export function useRemoteConfig() {
  const context = useContext(RemoteConfigContext);
  if (context === undefined) {
    throw new Error("useRemoteConfig must be used within a RemoteConfigProvider");
  }
  return context;
}
