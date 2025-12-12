"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getDistance } from "@/lib/utils";

const GEOLOCATION_TIMEOUT_MS = 10_000;

const GEOLOCATION_OPTIONS: PositionOptions = {
  timeout: GEOLOCATION_TIMEOUT_MS,
  enableHighAccuracy: true,
};

export type GeofenceStatus =
  | "loading"
  | "inside"
  | "outside"
  | "denied"
  | "unsupported"
  | "error";

export type GeofenceCoords = {
  latitude: number;
  longitude: number;
};

export type GeofenceInput = {
  center: { lat: number; lon: number };
  radiusKm: number;
};

type UseGeofenceStatusResult = {
  status: GeofenceStatus;
  inGeofence: boolean;
  coords: GeofenceCoords | null;
  refresh: () => void;
};

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

export function useGeofenceStatus(geofence: GeofenceInput): UseGeofenceStatusResult {
  const [status, setStatus] = useState<GeofenceStatus>("loading");
  const [coords, setCoords] = useState<GeofenceCoords | null>(null);

  const isGeofenceValid = useMemo(() => {
    return (
      isFiniteNumber(geofence.center.lat) &&
      isFiniteNumber(geofence.center.lon) &&
      isFiniteNumber(geofence.radiusKm) &&
      geofence.radiusKm >= 0
    );
  }, [geofence.center.lat, geofence.center.lon, geofence.radiusKm]);

  const refresh = useCallback(() => {
    if (!isGeofenceValid) {
      setCoords(null);
      setStatus("error");
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCoords(null);
      setStatus("unsupported");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistance(
          { lat: latitude, lon: longitude },
          { lat: geofence.center.lat, lon: geofence.center.lon },
        );

        if (distance <= geofence.radiusKm) {
          setCoords({ latitude, longitude });
          setStatus("inside");
        } else {
          setCoords(null);
          setStatus("outside");
        }
      },
      (error) => {
        setCoords(null);
        if (error.code === error.PERMISSION_DENIED) {
          setStatus("denied");
          return;
        }
        setStatus("error");
      },
      GEOLOCATION_OPTIONS,
    );
  }, [geofence.center.lat, geofence.center.lon, geofence.radiusKm, isGeofenceValid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    status,
    inGeofence: status === "inside",
    coords,
    refresh,
  };
}

