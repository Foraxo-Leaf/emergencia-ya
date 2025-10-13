
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { initialize, fetchAndActivate, getAll } from "@/lib/remoteConfig";
import { defaultConfig, buildContactData, ContactData } from "@/lib/config";

type RemoteConfigContextType = {
  contactData: ContactData;
  loading: boolean;
};

const RemoteConfigContext = createContext<RemoteConfigContextType | undefined>(undefined);

const STORAGE_KEY = "remoteConfig";

// Build contact data from default values initially.
// This ensures server and client render the same initial HTML.
const initialDefaultData = buildContactData(defaultConfig);

export function RemoteConfigProvider({ children }: { children: ReactNode }) {
  // Start with default data to prevent hydration mismatch.
  const [contactData, setContactData] = useState<ContactData>(initialDefaultData);
  // Loading is true initially until we can check localStorage.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAndSyncConfig() {
      // Step 1: Immediately try to hydrate from localStorage for a fast UI update.
      const storedConfig = localStorage.getItem(STORAGE_KEY);
      if (storedConfig) {
        try {
          const parsed = JSON.parse(storedConfig) as Record<string, string>;
          const fromStorageData = buildContactData({ ...defaultConfig, ...parsed });
          if (isMounted) {
            setContactData(fromStorageData);
          }
        } catch (e) {
          console.warn("[RemoteConfig] Failed to parse stored config.", e);
        }
      }
      
      if (isMounted) {
        setLoading(false); // We have either storage or default data, so UI is ready.
      }

      // Step 2: Fetch latest from Firebase in the background.
      try {
        await initialize();
        await fetchAndActivate();
        
        if (isMounted) {
          const remoteValues = getAll();
          const newConfig: Record<string, string> = {};
          for (const key in remoteValues) {
            if (Object.prototype.hasOwnProperty.call(remoteValues, key)) {
              newConfig[key] = remoteValues[key].asString();
            }
          }

          const finalConfig = { ...defaultConfig, ...newConfig };
          const finalContactData = buildContactData(finalConfig);

          setContactData(finalContactData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalConfig));
          console.log("[RemoteConfig] Background update successful.");
        }
      } catch (error) {
        console.error("[RemoteConfig] Error during background update:", error);
      }
    }

    loadAndSyncConfig();

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
