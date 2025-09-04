
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from "@/components/shared/Header";
import { educationTopics } from "@/lib/data/educationData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { PlayCircle, AlertTriangle } from 'lucide-react';
import * as Icons from 'lucide-react';

const iconComponents = Icons;

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
      const videoSlug = topic.slug.replace(/-/g, '_');
      const url = contactData.educationVideos[videoSlug];
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
  
  const IconComponent = iconComponents[topic.icon as keyof typeof iconComponents] || Icons.HelpCircle;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title={topic.shortTitle || topic.title} backHref="/educacion" />
      <main className="flex-grow p-4 md:p-6">
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: topic.color }}>
                 <IconComponent className={cn("w-8 h-8", topic.iconColor)} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{topic.title}</CardTitle>
                <CardDescription className="text-base pt-1">{topic.subtitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: topic.description }}
            />
            
            {videoUrl ? (
                 <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block">
                    <Button size="lg" className="w-full">
                        <PlayCircle className="mr-2"/>
                        Ver video explicativo
                    </Button>
                </a>
            ) : (
                <div className="mt-6 p-3 text-center bg-muted rounded-md">
                    <p className="text-muted-foreground text-sm">Video no disponible por el momento.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
