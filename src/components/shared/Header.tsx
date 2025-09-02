
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  title: string;
  backHref?: string;
};

export function Header({ title, backHref }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    // If a specific back destination is provided, use it.
    if (backHref) {
      router.push(backHref);
    } 
    // Otherwise, if there's history to go back to, go back.
    else if (window.history.length > 1) {
      router.back();
    } 
    // If there's no history, go to the homepage as a fallback.
    else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm dark:bg-background/80">
      <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Volver">
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <h1 className="text-xl font-bold ml-4">{title}</h1>
    </header>
  );
}
