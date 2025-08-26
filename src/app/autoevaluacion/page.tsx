import { EvaluationClient } from "./EvaluationClient";
import { Header } from "@/components/shared/Header";

export default function AutoEvaluacionPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header title="Auto-evaluación" backHref="/" />
      <main className="flex-grow">
        <EvaluationClient />
      </main>
    </div>
  );
}
