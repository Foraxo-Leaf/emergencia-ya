

"use client";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { educationTopics } from "@/lib/data/educationData";
import * as Icons from 'lucide-react';
import { useRemoteConfig } from "@/hooks/useRemoteConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle } from "lucide-react";

const iconComponents = Icons;

export default function EducacionPage() {
  const { contactData, loading } = useRemoteConfig();

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Educación Comunitaria" backHref="/" />
      <main className="flex-grow p-4 md:p-6">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold">Educación Comunitaria</h2>
          <p className="text-muted-foreground">Aprendé técnicas de primeros auxilios que pueden salvar vidas. Tocá para ver el video.</p>
        </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {educationTopics.map((topic) => {
                const IconComponent = iconComponents[topic.icon as keyof typeof iconComponents] || Icons.HelpCircle;
                const videoSlug = topic.slug.replace(/-/g, '_');
                const videoUrl = contactData.educationVideos[videoSlug];

                const content = (
                  <Card 
                    className="aspect-square flex flex-col items-center justify-center p-2 text-center transition-transform duration-200 shadow-md hover:shadow-lg hover:scale-105 rounded-2xl relative group"
                    style={{ backgroundColor: topic.color }}
                  >
                    <CardContent className="p-0 flex flex-col items-center justify-center gap-3">
                      <IconComponent className={cn("w-10 h-10", topic.iconColor)} />
                      <span className={cn("text-sm leading-tight text-center uppercase mt-2", topic.textColor)}>{topic.shortTitle || topic.title}</span>
                    </CardContent>
                     {videoUrl && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                            <PlayCircle className="w-12 h-12 text-white" />
                        </div>
                    )}
                  </Card>
                );

                if (videoUrl) {
                    return (
                        <a href={videoUrl} key={topic.slug} target="_blank" rel="noopener noreferrer">
                           {content}
                        </a>
                    );
                }

                return (
                   <div key={topic.slug} className="cursor-not-allowed opacity-60">
                     {content}
                   </div>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}
