import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ambulance, Stethoscope, GraduationCap, Shield, Flame, MapPin } from "lucide-react";

const navItems = [
  { href: "/autoevaluacion", label: "AUTOEVALUACION (TRIAGE)", icon: Stethoscope, color: "bg-green-500" },
  { href: "/educacion", label: "EDUCACION COMUNITARIA", icon: GraduationCap, color: "bg-indigo-500" },
  { href: "/policia", label: "POLICIA", icon: Shield, color: "bg-blue-500" },
  { href: "/bomberos", label: "BOMBEROS", icon: Flame, color: "bg-orange-400" },
];

const bottomNavItem = { href: "/centros", label: "CENTROS DE ATENCION Y TELEFONOS UTILES", icon: MapPin, color: "bg-cyan-400" };

export default function Home() {
  return (
    <main className="flex flex-col min-h-dvh bg-background text-foreground">
      
      <header className="p-4 w-full">
        <div className="bg-primary text-primary-foreground font-bold p-3 rounded-lg text-center w-full">
          <p className="text-sm tracking-widest">EMERGENCIAS</p>
          <p className="text-sm tracking-widest">SUSAMCO</p>
        </div>
      </header>
      
      <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-6 text-center">
        <a href="tel:107" className="w-full max-w-sm flex justify-center">
          <div
            className="w-48 h-48 rounded-full bg-primary hover:bg-primary/90 flex flex-col items-center justify-center text-primary-foreground shadow-2xl"
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
              <div className={`${item.color} text-white border rounded-2xl aspect-square flex flex-col items-center justify-center p-2 text-center transition-colors duration-200 shadow-md hover:shadow-lg`}>
                  <div className="w-12 h-12 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-semibold mt-2 leading-tight text-center">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link href={bottomNavItem.href} passHref>
          <div className={`${bottomNavItem.color} text-white flex items-center justify-center p-4 text-center transition-colors duration-200 shadow-md hover:shadow-lg rounded-2xl`}>
              <div className="p-0 flex items-center justify-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                    <bottomNavItem.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-semibold">{bottomNavItem.label}</span>
              </div>
          </div>
        </Link>
      </footer>
    </main>
  );
}
