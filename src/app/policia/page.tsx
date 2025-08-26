import { Header } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function PoliciaPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Policía" backHref="/" />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <Shield className="w-24 h-24 md:w-32 md:h-32 text-accent mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Comando Radioeléctrico</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Para emergencias que requieran a la policía, presione el botón para llamar.
        </p>
        <a href="tel:911" className="w-full max-w-xs">
          <Button size="lg" className="w-full h-24 text-2xl font-bold">
            Llamar 911
          </Button>
        </a>
      </main>
    </div>
  );
}
