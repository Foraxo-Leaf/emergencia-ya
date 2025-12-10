"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo.svg";
const LOGO_ALT = "Emergencia Ya";

type LogoProps = {
  size?: number;
  showText?: boolean;
  className?: string;
};

export function Logo({ size = 48, showText = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={LOGO_SRC}
        alt={LOGO_ALT}
        width={size}
        height={size}
        priority
      />
      {showText && (
        <div className="leading-tight">
          <p className="text-xs font-semibold uppercase tracking-tight text-primary">
            Emergencia
          </p>
          <p className="text-sm font-bold uppercase tracking-tight">
            Ya
          </p>
        </div>
      )}
    </div>
  );
}

