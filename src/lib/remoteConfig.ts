
import { app } from "./firebase";
import {
  getRemoteConfig,
  fetchAndActivate as firebaseFetchAndActivate,
  getAll as firebaseGetAll,
  activate as firebaseActivate,
  isSupported,
  type RemoteConfig,
} from "firebase/remote-config";
import { REMOTE_CONFIG_TTL_MS, defaultConfig } from "./config";

let remoteConfig: RemoteConfig | null = null;

export async function initialize() {
  if (!app || !(await isSupported())) {
    return;
  }

    remoteConfig = getRemoteConfig(app);
    
  // Keep cache TTL aligned with the app-side cache window.
  remoteConfig.settings.minimumFetchIntervalMillis =
    process.env.NODE_ENV === "development" ? 0 : REMOTE_CONFIG_TTL_MS;
    remoteConfig.settings.fetchTimeoutMillis = 8000; // 8 seconds timeout
    remoteConfig.defaultConfig = defaultConfig;
}

export async function fetchAndActivate() {
  if (remoteConfig) {
    return await firebaseFetchAndActivate(remoteConfig);
  }
  return false;
}

export async function activate() {
  if (remoteConfig) {
    return await firebaseActivate(remoteConfig);
  }
  return false;
}

export function getAll() {
  if (remoteConfig) {
    return firebaseGetAll(remoteConfig);
  }
  // Return the default config structure if remote config is not available
  const defaultConfigForGetAll: { [key: string]: { asString: () => string } } = {};
    for (const key in defaultConfig) {
        defaultConfigForGetAll[key] = { asString: () => defaultConfig[key] };
    }
    return defaultConfigForGetAll;
}
