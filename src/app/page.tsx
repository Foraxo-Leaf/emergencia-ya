
"use client";

import Link from "next/link";
import Image from "next/image";
import { Ambulance, Stethoscope, GraduationCap, Shield, Flame, MapPin, Loader2 } from "lucide-react";
import { useRemoteConfig } from "@/hooks/useRemoteConfig";
import { useState, useEffect } from "react";
import { getDistance } from "@/lib/utils";

const navItems = [
  { href: "/autoevaluacion", label: "AUTOEVALUACION (TRIAGE)", icon: Stethoscope, color: "bg-green-500" },
  { href: "/educacion", label: "EDUCACION COMUNITARIA", icon: GraduationCap, color: "bg-indigo-500" },
  { href: "/policia", label: "POLICIA", icon: Shield, color: "bg-blue-500" },
  { href: "/bomberos", label: "BOMBEROS", icon: Flame, color: "bg-orange-400" },
];

const bottomNavItem = { href: "/centros", label: "CENTROS DE ATENCION Y TELEFONOS UTILES", icon: MapPin, color: "bg-cyan-400" };
const sponsorLogo = {
  src: "/logo-fundacion-blanca.jpeg",
  alt: "Fundación Nazareno Crucianelli",
};

type GeoStatus = 'pending' | 'loading' | 'success' | 'outside' | 'error';

const GEOLOCATION_TIMEOUT_MS = 10_000;

export default function Home() {
  const { contactData, loading: configLoading } = useRemoteConfig();
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('loading');

  const localAmbulanceNumber = contactData.ambulance.phone;
  const fallbackAmbulanceNumber = contactData.offlinePhones.ambulance;
  const [ambulanceNumber, setAmbulanceNumber] = useState(fallbackAmbulanceNumber);

  useEffect(() => {
    if (configLoading || typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('error');
      setAmbulanceNumber(fallbackAmbulanceNumber);
      return;
    }

    // Immediately set loading status for UI feedback
    setGeoStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistance(
          { lat: latitude, lon: longitude },
          { lat: contactData.geofence.center.lat, lon: contactData.geofence.center.lon }
        );

        if (distance <= contactData.geofence.radiusKm) {
          setGeoStatus('success');
          setAmbulanceNumber(localAmbulanceNumber);
        } else {
          setGeoStatus('outside');
          setAmbulanceNumber(fallbackAmbulanceNumber);
        }
      },
      () => {
        setGeoStatus('error');
        setAmbulanceNumber(fallbackAmbulanceNumber);
      },
      { timeout: GEOLOCATION_TIMEOUT_MS, enableHighAccuracy: true }
    );
  }, [configLoading, contactData, fallbackAmbulanceNumber, localAmbulanceNumber]);

  return (
    <main className="flex flex-col min-h-dvh bg-background text-foreground">
      <div className="px-4 pt-4 md:px-6">
        <div className="mx-auto w-full max-w-sm rounded-2xl bg-black px-4 py-3 flex justify-center">
          <Image
            src={sponsorLogo.src}
            alt={sponsorLogo.alt}
            width={240}
            height={92}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>
      
      <div className="flex flex-1 flex-col items-center px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] md:px-6">
        <div className="w-full max-w-sm flex flex-1 flex-col">
          <div className="flex flex-col items-center text-center">
            <a
              href={geoStatus !== 'loading' ? `tel:${ambulanceNumber}` : '#'}
              className="w-full flex justify-center"
              aria-disabled={geoStatus === 'loading'}
              onClick={(event) => {
                if (geoStatus === 'loading') event.preventDefault();
              }}
            >
              <div
                className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-primary hover:bg-primary/90 flex flex-col items-center justify-center text-primary-foreground shadow-2xl transition-opacity"
                style={{ opacity: geoStatus === 'loading' ? 0.7 : 1 }}
              >
                {geoStatus === 'loading' ? (
                  <Loader2 className="w-14 h-14 sm:w-16 sm:h-16 animate-spin" />
                ) : (
                  <Ambulance className="w-14 h-14 sm:w-16 sm:h-16" />
                )}
                <span className="text-xl font-bold mt-2 text-center">
                  LLAMAR<br />AMBULANCIA
                </span>
              </div>
            </a>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8 w-full">
              {navItems.map((item) => (
                <Link href={item.href} key={item.href} passHref>
                  <div
                    className={`${item.color} text-white border rounded-2xl aspect-square flex flex-col items-center justify-center p-2.5 text-center transition-colors duration-200 shadow-md hover:shadow-lg`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-semibold mt-2 leading-tight text-center">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link href={bottomNavItem.href} passHref className="mt-auto pt-5 sm:pt-6">
            <div
              className={`${bottomNavItem.color} text-white flex items-center justify-center p-3.5 sm:p-4 text-center transition-colors duration-200 shadow-md hover:shadow-lg rounded-2xl`}
            >
              <div className="p-0 flex items-center justify-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                  <bottomNavItem.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <span className="text-sm font-semibold">{bottomNavItem.label}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
