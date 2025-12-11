import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.susamco.emergenciaya",
  appName: "Emergencia Ya",
  webDir: ".next",
  server: {
    url: "https://emergencia-ya.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
};

export default config;

