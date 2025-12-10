import { CONTACT_DATA } from "@/lib/config";

const FALLBACK_NUMBERS = [
  { label: "Ambulancia", phone: CONTACT_DATA.ambulance.phone },
  { label: "Monitoreo", phone: CONTACT_DATA.monitoringCenter.phone },
  { label: "Policía", phone: CONTACT_DATA.police.phone },
  { label: "Bomberos", phone: CONTACT_DATA.firefighters.phone },
];

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="mb-3 text-2xl font-bold">Estás sin conexión</h1>
      <p className="mb-4 text-muted-foreground">
        No pudimos actualizar la información. Si necesitas ayuda urgente, usa los números directos.
      </p>
      <div className="grid w-full max-w-md gap-2">
        {FALLBACK_NUMBERS.map(({ label, phone }) => (
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
