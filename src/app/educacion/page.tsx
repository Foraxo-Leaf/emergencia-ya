import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Card, CardContent } from "@/components/ui/card";
import { educationData } from "@/lib/educationData";
import { cn } from "@/lib/utils";


export default function EducacionPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Educación Comunitaria" backHref="/" />
      <main className="flex-grow p-4 md:p-6">
        <div className="text-left mb-6">
            <h2 className="text-2xl font-bold">Educación Comunitaria</h2>
            <p className="text-muted-foreground">Aprende técnicas de primeros auxilios que pueden salvar vidas</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {educationData.slice(0, 6).map((topic) => (
            <Link href={`/educacion/${topic.slug}`} key={topic.slug} passHref>
              <Card className={cn(
                "aspect-square flex flex-col items-center justify-center p-2 text-center transition-colors duration-200 shadow-md hover:shadow-lg",
                topic.color
              )}>
                <CardContent className="p-0 flex flex-col items-center justify-center gap-3">
                    <topic.icon className={cn("w-10 h-10", topic.iconColor)} />
                    <span className={cn("text-sm font-medium leading-tight text-center uppercase mt-2", topic.iconColor)}>{topic.shortTitle || topic.title}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
