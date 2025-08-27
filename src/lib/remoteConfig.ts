
import { app } from "./firebase";
import {
  getRemoteConfig,
  fetchAndActivate as firebaseFetchAndActivate,
  getAll as firebaseGetAll,
  isSupported,
} from "firebase/remote-config";
import { defaultConfig } from "./config";

let remoteConfig: any;

export async function initialize() {
  if (app && (await isSupported())) {
    remoteConfig = getRemoteConfig(app);
    remoteConfig.defaultConfig = defaultConfig;
  }
}

export async function fetchAndActivate() {
  if (remoteConfig) {
    return await firebaseFetchAndActivate(remoteConfig);
  }
  return false;
}

export function getAll() {
  if (remoteConfig) {
    return firebaseGetAll(remoteConfig);
  }
  return {};
}
