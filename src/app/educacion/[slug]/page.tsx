import { educationData } from "@/lib/educationData";
import { notFound } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText } from "lucide-react";

export async function generateStaticParams() {
  return educationData.map((topic) => ({
    slug: topic.slug,
  }));
}

export default function EducacionDetallePage({ params }: { params: { slug: string } }) {
  const topic = educationData.find((t) => t.slug === params.slug);

  if (!topic) {
    notFound();
  }

  const steps = topic.description.trim().split('\n').map(s => s.replace(/^\d+\.\s*/, ''));

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Información" backHref="/educacion" />
      <main className="flex-grow p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          <p className="text-muted-foreground">{topic.subtitle}</p>
        </div>

        <div className="mb-6">
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
            <PlayCircle className="mr-2" /> Ver Video Tutorial
          </Button>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            El contenido de video estará disponible próximamente.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 text-accent" />
              Pasos a Seguir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => {
                const parts = step.split('**');
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-card-foreground/90">
                      {parts.map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                  </div>
                );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
