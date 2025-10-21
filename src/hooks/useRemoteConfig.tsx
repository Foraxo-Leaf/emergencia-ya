
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { initialize, fetchAndActivate, getAll } from "@/lib/remoteConfig";
import { defaultConfig, buildContactData, ContactData } from "@/lib/config";

type RemoteConfigContextType = {
  contactData: ContactData;
};

const RemoteConfigContext = createContext<RemoteConfigContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = "remoteConfigData";
const LAST_FETCH_STORAGE_KEY = "remoteConfigLastFetch";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// This function now runs on the client, avoiding server-side execution of localStorage
const getInitialContactData = (): ContactData => {
  if (typeof window === "undefined") {
    return buildContactData(defaultConfig);
  }
  const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      return buildContactData({ ...defaultConfig, ...parsed });
    } catch (e) {
      console.error("[RemoteConfig] Failed to parse stored config, using defaults.", e);
      return buildContactData(defaultConfig);
    }
  }
  return buildContactData(defaultConfig);
};


export function RemoteConfigProvider({ children }: { children: ReactNode }) {
  // Initialize state with data from localStorage or defaults. This is synchronous.
  const [contactData, setContactData] = useState<ContactData>(getInitialContactData);

  useEffect(() => {
    let isMounted = true;
    
    const shouldFetch = () => {
      if (typeof window === 'undefined') return false;
      const lastFetchString = localStorage.getItem(LAST_FETCH_STORAGE_KEY);
      if (!lastFetchString) return true; // Never fetched before

      const lastFetchTime = parseInt(lastFetchString, 10);
      return (Date.now() - lastFetchTime) > CACHE_DURATION_MS;
    };

    async function syncRemoteConfig() {
      if (!shouldFetch()) {
        console.log("[RemoteConfig] Skipping fetch, cache is fresh.");
        return;
      }
      
      console.log("[RemoteConfig] Cache is stale, fetching new data...");
      try {
        await initialize();
        const activated = await fetchAndActivate();
        
        if (isMounted && activated) {
          console.log("[RemoteConfig] Background update successful.");
          const remoteValues = getAll();
          const newConfig: Record<string, string> = {};
          Object.keys(remoteValues).forEach(key => {
            newConfig[key] = remoteValues[key].asString();
          });

          const finalConfig = { ...defaultConfig, ...newConfig };
          const finalContactData = buildContactData(finalConfig);

          setContactData(finalContactData);
          localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(finalConfig));
          localStorage.setItem(LAST_FETCH_STORAGE_KEY, Date.now().toString());
        } else if (isMounted) {
          console.log("[RemoteConfig] No new data to activate, using cached values.");
          // Update timestamp even if no new data, to avoid refetching for another 24h
          localStorage.setItem(LAST_FETCH_STORAGE_KEY, Date.now().toString());
        }

      } catch (error) {
        console.error("[RemoteConfig] Error during background sync:", error);
      }
    }

    // Run the sync in the background
    syncRemoteConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <RemoteConfigContext.Provider value={{ contactData, loading: false }}>
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
