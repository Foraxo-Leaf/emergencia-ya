
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from "@/components/shared/Header";
import { educationTopics } from "@/lib/data/educationData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { PlayCircle, AlertTriangle, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";

type Topic = typeof educationTopics[0];

export default function EducationDetailPage() {
  const params = useParams();
  const { contactData, loading: configLoading } = useRemoteConfig();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      const foundTopic = educationTopics.find(t => t.slug === slug) || null;
      setTopic(foundTopic);
    }
  }, [params.slug]);

  useEffect(() => {
    if (topic && !configLoading) {
      // Get the video URL from the remote config contactData
      const url = contactData.educationVideos[topic.slug];
      setVideoUrl(url);
      setLoading(false);
    }
  }, [topic, contactData, configLoading]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-dvh bg-background">
        <Header title="Cargando..." backHref="/educacion" />
        <main className="flex-grow p-4 md:p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
        </main>
      </div>
    );
  }

  if (!topic) {
    return (
       <div className="flex flex-col min-h-dvh bg-background">
        <Header title="Error" backHref="/educacion" />
        <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold">Tema no encontrado</h1>
            <p className="text-muted-foreground">No pudimos encontrar el tema que estás buscando.</p>
        </main>
       </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Información" backHref="/educacion" />
      <main className="flex-grow p-4 md:p-6 space-y-6">
        
        <div className="text-left">
            <h1 className="text-2xl font-bold uppercase">{topic.title}</h1>
            <p className="text-muted-foreground">{topic.subtitle}</p>
        </div>

        {videoUrl && (
             <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                    <PlayCircle className="mr-2"/>
                    Ver Video Tutorial
                </Button>
            </a>
        )}

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-accent" />
              Pasos a Seguir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topic.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p 
                    className="flex-1 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
