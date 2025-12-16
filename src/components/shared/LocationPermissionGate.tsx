"use client";

import { useEffect, useState } from "react";
import { requestLocationPermission } from "@/lib/geolocation";

type LocationPermissionGateProps = {
  children: React.ReactNode;
};

/**
 * Componente que solicita permisos de ubicación al iniciar la app.
 * En plataformas nativas, muestra el diálogo de permisos de Android/iOS.
 * En web, simplemente renderiza los hijos ya que el navegador
 * solicitará permisos cuando se use la API de geolocalización.
 */
export function LocationPermissionGate({ children }: LocationPermissionGateProps) {
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    requestLocationPermission().finally(() => {
      setPermissionRequested(true);
    });
  }, []);

  if (!permissionRequested) {
    return null;
  }

  return <>{children}</>;
}

