import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ambulance, Heart, GraduationCap, Shield, Flame, MapPin, Settings } from "lucide-react";

const navItems = [
  { href: "/autoevaluacion", label: "AUTOEVALUACION (TRIAGE)", icon: Heart, color: "bg-green-500 hover:bg-green-600" },
  { href: "/educacion", label: "EDUCACION COMUNITARIA", icon: GraduationCap, color: "bg-indigo-500 hover:bg-indigo-600" },
  { href: "/policia", label: "POLICIA", icon: Shield, color: "bg-blue-500 hover:bg-blue-600" },
  { href: "/bomberos", label: "BOMBEROS", icon: Flame, color: "bg-orange-500 hover:bg-orange-600" },
];

const bottomNavItem = { href: "/centros", label: "CENTROS DE ATENCION Y TELEFONOS UTILES", icon: MapPin, color: "bg-cyan-500 hover:bg-cyan-600" };

export default function Home() {
  return (
    <main className="flex flex-col min-h-dvh bg-gray-50 dark:bg-gray-900">
      
      <header className="p-4 flex justify-between items-center">
        <div className="bg-primary text-primary-foreground font-bold p-3 rounded-lg text-center">
          <p className="text-sm">EMERGENCIAS</p>
          <p className="text-sm">SUSAMCO</p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="w-6 h-6" />
        </Button>
      </header>
      
      <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-6 text-center">
        <a href="tel:107" className="w-full max-w-sm flex justify-center">
          <div
            className="w-48 h-48 rounded-full bg-primary hover:bg-red-700 dark:bg-primary dark:hover:bg-red-700 flex flex-col items-center justify-center text-primary-foreground shadow-2xl"
          >
            <Ambulance className="w-16 h-16" />
            <span className="text-xl font-bold mt-2 text-center">LLAMAR<br/>AMBULANCIA</span>
          </div>
        </a>
      </div>

      <footer className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} passHref>
              <div className={`aspect-square flex flex-col items-center justify-center p-4 text-center transition-colors duration-200 shadow-md hover:shadow-lg rounded-2xl ${item.color} text-primary-foreground`}>
                  <item.icon className="w-10 h-10 md:w-12 md:h-12" />
                  <span className="text-xs font-semibold mt-2 leading-tight">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link href={bottomNavItem.href} passHref>
          <div className={`flex items-center justify-center p-4 text-center transition-colors duration-200 shadow-md hover:shadow-lg rounded-2xl ${bottomNavItem.color} text-primary-foreground`}>
              <div className="p-0 flex items-center justify-center gap-4">
                <bottomNavItem.icon className="w-6 h-6" />
                <span className="text-sm font-semibold">{bottomNavItem.label}</span>
              </div>
          </div>
        </Link>
      </footer>
    </main>
  );
}
