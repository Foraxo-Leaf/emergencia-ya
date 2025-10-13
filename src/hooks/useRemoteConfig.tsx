
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

// Synchronously get initial data from localStorage for instant boot-up
const getInitialContactData = (): ContactData => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, string>;
        // Merge with defaults to ensure all keys are present
        const initialConfig = { ...defaultConfig, ...parsed };
        return buildContactData(initialConfig);
      } catch (e) {
        console.warn("[RemoteConfig] Failed to parse stored config. Falling back to defaults.", e);
      }
    }
  }
  // Return default data if nothing is stored or if running on server
  return buildContactData(defaultConfig);
};

export function RemoteConfigProvider({ children }: { children: ReactNode }) {
  // Initialize state directly from localStorage for a fast initial render
  const [contactData, setContactData] = useState<ContactData>(getInitialContactData);
  // Loading is false initially, as we render with stored/default data instantly.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function updateRemoteConfig() {
      try {
        await initialize();
        
        // Fetch new values in the background
        await fetchAndActivate();
        
        if (isMounted) {
          const remoteValues = getAll();
          const newConfig: Record<string, string> = {};
          for (const key in remoteValues) {
            if (Object.prototype.hasOwnProperty.call(remoteValues, key)) {
              newConfig[key] = remoteValues[key].asString();
            }
          }

          // Merge remote with defaults to create the final, complete config
          const finalConfig = { ...defaultConfig, ...newConfig };
          const finalContactData = buildContactData(finalConfig);

          // Update state and localStorage with fresh data
          setContactData(finalContactData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalConfig));
          console.log("[RemoteConfig] Background update successful.");
        }
      } catch (error) {
        console.error("[RemoteConfig] Error during background update:", error);
      }
    }

    // Run the background update after the initial render
    updateRemoteConfig();

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
