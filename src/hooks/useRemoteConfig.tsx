
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

// This function now runs on the client, avoiding server-side execution of localStorage
const getInitialContactData = (): ContactData => {
  if (typeof window === "undefined") {
    return buildContactData(defaultConfig);
  }
  const storedConfig = localStorage.getItem(STORAGE_KEY);
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      return buildContactData({ ...defaultConfig, ...parsed });
    } catch (e) {
      // If parsing fails, fall back to default
      return buildContactData(defaultConfig);
    }
  }
  return buildContactData(defaultConfig);
};


export function RemoteConfigProvider({ children }: { children: ReactNode }) {
  // Initialize state with data from localStorage or defaults. This is synchronous.
  const [contactData, setContactData] = useState<ContactData>(getInitialContactData);
  // Loading is now primarily for indicating background fetches, not initial load.
  // We'll set it to false initially because we have data to show right away.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function syncRemoteConfig() {
      if (typeof window === "undefined") return;

      try {
        await initialize();
        await fetchAndActivate();
        
        if (isMounted) {
          const remoteValues = getAll();
          const newConfig: Record<string, string> = {};
          Object.keys(remoteValues).forEach(key => {
            newConfig[key] = remoteValues[key].asString();
          });

          const finalConfig = { ...defaultConfig, ...newConfig };
          const finalContactData = buildContactData(finalConfig);

          setContactData(finalContactData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalConfig));
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

  // loading is now false, as we render immediately with cached/default data
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
