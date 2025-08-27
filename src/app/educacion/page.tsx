"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/lib/firebase";
import * as Icons from 'lucide-react';

type EducationTopic = {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  icon: keyof typeof Icons;
  color: string;
  iconColor: string;
  textColor: string;
};

// A mapping from icon names (strings) to the actual Lucide components
const iconComponents = Icons;

const colorVariants: { [key: string]: string } = {
  'bg-red-500': 'bg-red-500',
  'bg-blue-500': 'bg-blue-500',
  'bg-orange-500': 'bg-orange-500',
  'bg-purple-500': 'bg-purple-500',
  'bg-pink-500': 'bg-pink-500'
};

export default function EducacionPage() {
  const [educationData, setEducationData] = useState<EducationTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const db = getFirestore(app);
        const educationCollection = collection(db, 'education');
        const educationSnapshot = await getDocs(educationCollection);
        const educationList = educationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EducationTopic));
        setEducationData(educationList);
      } catch (error) {
        console.error("Error fetching education data from Firestore:", error);
        // Handle error (e.g., show a message to the user)
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Educación Comunitaria" backHref="/" />
      <main className="flex-grow p-4 md:p-6">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold">Educación Comunitaria</h2>
          <p className="text-muted-foreground">Aprende técnicas de primeros auxilios que pueden salvar vidas</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="aspect-square flex flex-col items-center justify-center p-2 text-center rounded-2xl bg-muted animate-pulse">
                <CardContent className="p-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-muted-foreground/20 rounded-lg"></div>
                  <div className="w-20 h-4 bg-muted-foreground/20 rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {educationData.map((topic) => {
              const IconComponent = iconComponents[topic.icon] || Icons.HelpCircle;
              const bgColor = colorVariants[topic.color] || 'bg-gray-500';
              return (
                <Link href={`/educacion/${topic.slug}`} key={topic.slug} passHref>
                  <Card className={cn(
                    "aspect-square flex flex-col items-center justify-center p-2 text-center transition-colors duration-200 shadow-md hover:shadow-lg rounded-2xl",
                    bgColor
                  )}>
                    <CardContent className="p-0 flex flex-col items-center justify-center gap-3">
                      <IconComponent className={cn("w-10 h-10", topic.iconColor)} />
                      <span className={cn("text-sm leading-tight text-center uppercase mt-2", topic.textColor)}>{topic.shortTitle || topic.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
