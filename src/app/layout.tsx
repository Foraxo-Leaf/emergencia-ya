
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { RemoteConfigProvider } from "@/hooks/useRemoteConfig.tsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const manifest = {
  name: "Emergencia Ya",
  short_name: "Emergencia Ya",
  description: "Aplicación de emergencias SUSAMCO",
  start_url: "/",
  display: "standalone",
  background_color: "#FFFFFF",
  theme_color: "#DC2626",
  icons: [
    {
      src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='white' /><path d='M40 20H60V40H80V60H60V80H40V60H20V40H40V20Z' fill='red' /></svg>",
      sizes: "any",
      type: "image/svg+xml"
    }
  ]
};

export const metadata: Metadata = {
  title: "Emergencia Ya",
  description: "Aplicación de emergencias SUSAMCO",
  manifest: `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='white' /><path d='M40 20H60V40H80V60H60V80H40V60H20V40H40V20Z' fill='red' /></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased", inter.variable)}>
        <RemoteConfigProvider>
          {children}
        </RemoteConfigProvider>
        <Toaster />
      </body>
    </html>
  );
}
