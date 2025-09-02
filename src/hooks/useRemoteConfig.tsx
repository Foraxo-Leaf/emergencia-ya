
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { initialize, fetchAndActivate, getAll } from "@/lib/remoteConfig";
import { defaultConfig, buildContactData, ContactData } from "@/lib/config";

type RemoteConfigContextType = {
  contactData: ContactData;
  loading: boolean;
};

const RemoteConfigContext = createContext<RemoteConfigContextType | undefined>(undefined);

// Initial state with default data
const initialContactData = buildContactData(defaultConfig);

export function RemoteConfigProvider({ children }: { children: ReactNode }) {
  const [contactData, setContactData] = useState<ContactData>(initialContactData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRemoteConfig() {
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

          // Merge remote config with defaults, remote wins
          const finalConfig = { ...defaultConfig, ...newConfig };
          
          setContactData(buildContactData(finalConfig));
        }
      } catch (error) {
        console.error("Error loading remote config:", error);
        // In case of error, we'll just use the default config already set
      } finally {
        if (isMounted) {
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
