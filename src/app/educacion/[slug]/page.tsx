import { educationData } from "@/lib/educationData";
import { notFound } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

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

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title={topic.title} backHref="/educacion" />
      <main className="flex-grow p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{topic.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CardDescription className="text-base whitespace-pre-line">
              {topic.description}
            </CardDescription>

            <div>
              <h3 className="text-xl font-semibold mb-4">Video Demostrativo</h3>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                 <Image
                    src="https://picsum.photos/1280/720"
                    alt="Video placeholder"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-50"
                    data-ai-hint="video tutorial"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-foreground/70">Video no disponible.</p>
                  </div>
              </div>
               <p className="text-sm text-muted-foreground mt-2">
                El contenido de video estará disponible próximamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
