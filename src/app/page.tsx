import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ambulance, ClipboardCheck, BookOpen, Shield, Flame, Building, Phone } from "lucide-react";

const navItems = [
  { href: "/autoevaluacion", label: "Auto-evaluación", icon: ClipboardCheck },
  { href: "/educacion", label: "Educación", icon: BookOpen },
  { href: "/policia", label: "Policía", icon: Shield },
  { href: "/bomberos", label: "Bomberos", icon: Flame },
];

const bottomNavItem = { href: "/centros", label: "Centros de Atención y Teléfonos Útiles", icon: Building };


export default function Home() {
  return (
    <main className="flex flex-col min-h-dvh bg-background dark:bg-background">
      <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Emergencia Ya</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Su asistente de emergencias. Presione el botón para ayuda inmediata o explore las opciones a continuación.
        </p>
        
        <a href="tel:107" className="w-full max-w-sm">
          <Button
            variant="default"
            size="lg"
            className="w-full h-32 md:h-40 rounded-full text-2xl md:text-3xl font-bold shadow-2xl animate-pulse bg-primary hover:bg-red-700 dark:bg-primary dark:hover:bg-red-700 flex flex-col gap-2"
          >
            <Ambulance className="w-12 h-12" />
            LLAMAR AMBULANCIA (107)
          </Button>
        </a>
      </div>

      <footer className="p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} passHref>
              <Card className="aspect-square flex flex-col items-center justify-center p-4 text-center hover:bg-accent/10 transition-colors duration-200 shadow-md hover:shadow-lg dark:bg-card">
                <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                  <item.icon className="w-10 h-10 md:w-12 md:h-12 text-accent" />
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Link href={bottomNavItem.href} passHref>
          <Card className="flex items-center justify-center p-4 text-center hover:bg-accent/10 transition-colors duration-200 shadow-md hover:shadow-lg dark:bg-card">
              <CardContent className="p-0 flex items-center justify-center gap-4">
                <bottomNavItem.icon className="w-8 h-8 text-accent" />
                <span className="text-md font-semibold text-foreground">{bottomNavItem.label}</span>
              </CardContent>
          </Card>
        </Link>
      </footer>
    </main>
  );
}
