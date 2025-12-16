import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

/**
 * Solicita permisos de ubicación al usuario.
 * En plataformas nativas (Android/iOS) usa el plugin de Capacitor.
 * En web, retorna true ya que el navegador solicita permisos automáticamente.
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return true;
  }

  try {
    const status = await Geolocation.requestPermissions();
    return status.location === "granted";
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
}

/**
 * Verifica el estado actual de los permisos de ubicación.
 * En plataformas nativas usa el plugin de Capacitor.
 * En web, retorna true ya que se verificará al momento de usar la API.
 */
export async function checkLocationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return true;
  }

  try {
    const status = await Geolocation.checkPermissions();
    return status.location === "granted";
  } catch (error) {
    console.error("Error checking location permission:", error);
    return false;
  }
}

/**
 * Verifica si los permisos de ubicación fueron denegados permanentemente.
 * Útil para mostrar instrucciones al usuario sobre cómo habilitarlos manualmente.
 */
export async function isLocationPermissionDenied(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    const status = await Geolocation.checkPermissions();
    return status.location === "denied";
  } catch (error) {
    console.error("Error checking if location permission denied:", error);
    return false;
  }
}

