"use client";

import { useRemoteConfig } from "@/hooks/useRemoteConfig";

export default function OfflinePage() {
  const { contactData } = useRemoteConfig();

  const fallbackNumbers = [
    { label: "Ambulancia", phone: contactData.offlinePhones.ambulance },
    { label: "Monitoreo", phone: contactData.offlinePhones.monitoringCenter },
    { label: "Policía", phone: contactData.offlinePhones.police },
    { label: "Bomberos", phone: contactData.offlinePhones.firefighters },
  ].filter(({ phone }) => Boolean(phone));

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="mb-3 text-2xl font-bold">Estás sin conexión</h1>
      <p className="mb-4 text-muted-foreground">
        No pudimos actualizar la información. Si necesitas ayuda urgente, usa los números directos.
      </p>
      <div className="grid w-full max-w-md gap-2">
        {fallbackNumbers.map(({ label, phone }) => (
          <a
            key={label}
            href={`tel:${phone}`}
            className="rounded-lg bg-primary px-4 py-3 text-primary-foreground shadow transition hover:opacity-95"
          >
            Llamar {label} ({phone})
          </a>
        ))}
      </div>
    </div>
  );
}
