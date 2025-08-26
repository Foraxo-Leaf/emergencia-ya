import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { educationData } from "@/lib/educationData";
import { ChevronRight } from "lucide-react";

export default function EducacionPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Educación Comunitaria" backHref="/" />
      <main className="flex-grow p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {educationData.map((topic) => (
            <Link href={`/educacion/${topic.slug}`} key={topic.slug} passHref>
              <Card className="hover:bg-accent/10 hover:border-accent transition-all duration-200 flex items-center justify-between p-4">
                  <CardHeader className="p-2">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                  </CardHeader>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
