import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { educationData } from "@/lib/educationData";
import { ChevronRight, Dot } from "lucide-react";

export default function EducacionPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Educación Comunitaria" backHref="/" />
      <main className="flex-grow p-4 md:p-6">
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col">
                  {educationData.map((topic) => (
                    <Link href={`/educacion/${topic.slug}`} key={topic.slug} passHref>
                      <div className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-accent/10 transition-colors duration-200 -mx-4 px-4">
                        <div className="flex items-center">
                            <Dot className="w-8 h-8 text-muted-foreground" />
                            <span className="text-lg font-medium">{topic.title}</span>
                        </div>
                        <ChevronRight className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
