import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.susamco.emergenciaya",
  appName: "Emergencia Ya",
  // For offline-first, we bundle the static export output (Next.js `output: "export"`).
  webDir: "out",
  // No `server.url`: load the local bundle instead of a remote website.
  server: {
    cleartext: false,
    androidScheme: "https",
  },
};

export default config;

