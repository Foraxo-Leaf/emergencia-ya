import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { usefulCenters } from "@/lib/config";

export default function CentrosPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Centros y Teléfonos Útiles" backHref="/" />
      <main className="flex-grow p-4 md:p-6">
        <div className="space-y-6">
          {usefulCenters.map((center) => (
            <Card key={center.name} className="shadow-md">
              <CardHeader>
                <CardTitle>{center.name}</CardTitle>
                <CardDescription className="flex items-center pt-2">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  {center.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 {center.mapsQuery && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${center.mapsQuery}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      Cómo llegar
                    </Button>
                  </a>
                 )}
                {center.whatsapp && (
                  <a href={`https://wa.me/${center.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Turnos por WhatsApp
                    </Button>
                  </a>
                )}
                 {center.phone && (
                  <a href={`tel:${center.phone}`}>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
