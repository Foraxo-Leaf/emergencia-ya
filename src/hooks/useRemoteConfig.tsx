
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { initialize, fetchAndActivate, getAll, activate } from "@/lib/remoteConfig";
import { defaultConfig, buildContactData, ContactData } from "@/lib/config";

type RemoteConfigContextType = {
  contactData: ContactData;
  loading: boolean;
};

const RemoteConfigContext = createContext<RemoteConfigContextType | undefined>(undefined);

// Key used to persist the remote config locally
const STORAGE_KEY = "remoteConfig";

// Initial state with data from localStorage if available
const getInitialContactData = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, string>;
        const initialConfig = { ...defaultConfig, ...parsed };
        return buildContactData(initialConfig);
      } catch (e) {
        console.warn("[RemoteConfig] Failed to parse stored config", e);
      }
    }
  }
  return buildContactData(defaultConfig);
};

export function RemoteConfigProvider({ children }: { children: ReactNode }) {
  const [contactData, setContactData] = useState<ContactData>(getInitialContactData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRemoteConfig() {
      try {
        // Use persisted data first if available
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored) as Record<string, string>;
              const merged = { ...defaultConfig, ...parsed };
              if (isMounted) {
                setContactData(buildContactData(merged));
              }
            } catch (e) {
              console.warn("[RemoteConfig] Failed to parse stored config", e);
            }
          }
        }

        console.log("[RemoteConfig] Initializing...");
        await initialize();

        console.log("[RemoteConfig] Fetching latest values...");
        // Fetch new values, but don't worry if it fails (e.g., offline)
        await fetchAndActivate().catch(err => {
          console.warn("[RemoteConfig] Fetch failed, will use cached values if available.", err);
        });

        // Always try to activate the config (it will use fetched or cached)
        await activate();
        console.log("[RemoteConfig] Config activated (fetched or cached).");

        if (isMounted) {
          const remoteValues = getAll();
          console.log("[RemoteConfig] Raw values from config:", remoteValues);

          const newConfig: Record<string, string> = {};
          for (const key in remoteValues) {
            if (Object.prototype.hasOwnProperty.call(remoteValues, key)) {
              newConfig[key] = remoteValues[key].asString();
            }
          }

          // Merge remote config with defaults, remote wins
          const finalConfig = { ...defaultConfig, ...newConfig };
          console.log("[RemoteConfig] Final merged config:", finalConfig);

          const finalContactData = buildContactData(finalConfig);
          setContactData(finalContactData);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalConfig));
          } catch (e) {
            console.warn("[RemoteConfig] Failed to persist config", e);
          }
        }
      } catch (error) {
        console.error("[RemoteConfig] Error loading remote config:", error);
        // In case of error, we'll just use the default config already set
      } finally {
        if (isMounted) {
          console.log("[RemoteConfig] Loading finished.");
          setLoading(false);
        }
      }
    }

    loadRemoteConfig();

    return () => {
      isMounted = false;
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
