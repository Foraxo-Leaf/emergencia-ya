"use client";

import { useState, useEffect } from "react";
import { initialize, fetchAndActivate, getAll } from "@/lib/remoteConfig";
import { defaultConfig, buildContactData, ContactData } from "@/lib/config";

export function useRemoteConfig() {
  const [contactData, setContactData] = useState<ContactData>(() =>
    buildContactData(defaultConfig)
  );

  useEffect(() => {
    async function loadRemoteConfig() {
      try {
        await initialize();
        await fetchAndActivate();
        const remoteValues = getAll();
        
        const newConfig: Record<string, string> = {};
        for (const key in remoteValues) {
          newConfig[key] = remoteValues[key].asString();
        }

        // Merge remote config with defaults, remote wins
        const finalConfig = { ...defaultConfig, ...newConfig };

        setContactData(buildContactData(finalConfig));
        
      } catch (error) {
        console.error("Error loading remote config:", error);
        // In case of error, we'll just use the default config already set
      }
    }

    loadRemoteConfig();
  }, []);

  return { contactData };
}
