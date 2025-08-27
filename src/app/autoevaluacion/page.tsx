"use client";

import { EvaluationClient } from "./EvaluationClient";
import { Header } from "@/components/shared/Header";
import { useRemoteConfig } from "@/hooks/useRemoteConfig";

export default function AutoEvaluacionPage() {
  const { contactData } = useRemoteConfig();

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Auto-evaluación" backHref="/" />
      <main className="flex-grow">
        <EvaluationClient contactData={contactData} />
      </main>
    </div>
  );
}
