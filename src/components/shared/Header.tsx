
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

type HeaderProps = {
  title: string;
  backHref?: string;
};

export function Header({ title, backHref }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background/80 backdrop-blur-sm dark:bg-background/80">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Volver">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <Logo size={36} />
    </header>
  );
}
