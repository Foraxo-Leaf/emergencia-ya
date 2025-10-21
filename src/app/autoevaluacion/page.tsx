
"use client";

import { EvaluationClient } from "./EvaluationClient";
import { Header } from "@/components/shared/Header";
import { useRemoteConfig } from "@/hooks/useRemoteConfig";
import { Skeleton } from "@/components/ui/skeleton";

export default function AutoEvaluacionPage() {
  const { contactData, loading } = useRemoteConfig();

  // No loading skeleton needed as useRemoteConfig now loads synchronously
  // from cache/defaults, preventing a flicker or loading state on initial render.
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Auto-evaluación" backHref="/" />
      <main className="flex-grow">
         {loading ? (
          <div className="p-4 md:p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <EvaluationClient contactData={contactData} />
        )}
      </main>
    </div>
  );
}
