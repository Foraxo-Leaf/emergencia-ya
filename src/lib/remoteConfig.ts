
import { app } from "./firebase";
import {
  getRemoteConfig,
  fetchAndActivate as firebaseFetchAndActivate,
  getAll as firebaseGetAll,
  activate as firebaseActivate,
  isSupported,
} from "firebase/remote-config";
import { defaultConfig } from "./config";

let remoteConfig: any;

export async function initialize() {
  if (app && (await isSupported())) {
    remoteConfig = getRemoteConfig(app);
    // Set a longer cache time to ensure data persists, but still allow updates
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
    remoteConfig.defaultConfig = defaultConfig;
  }
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
