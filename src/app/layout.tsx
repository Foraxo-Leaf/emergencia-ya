
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { RemoteConfigProvider } from "@/hooks/useRemoteConfig.tsx";
import { SeedDB } from "@/components/SeedDB";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const manifest = {
  name: "Emergencia Ya",
  short_name: "Emergencia Ya",
  description: "Aplicación de emergencias SUSAMCO para acceso rápido a números y guías de primeros auxilios.",
  start_url: "/",
  display: "standalone",
  background_color: "#FFFFFF",
  theme_color: "#DC2626",
  icons: [
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    },
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable"
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable"
    }
  ]
};

const APP_NAME = "Emergencia Ya";
const APP_DEFAULT_TITLE = "Emergencia Ya";
const APP_TITLE_TEMPLATE = "%s - Emergencia Ya";
const APP_DESCRIPTION = "Aplicación de emergencias SUSAMCO para acceso rápido a números y guías de primeros auxilios.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='white' /><path d='M50 10 L50 90 M10 50 L90 50' stroke='%23DC2626' stroke-width='20' stroke-linecap='round' /></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased", inter.variable)}>
        <SeedDB />
        <RemoteConfigProvider>
          {children}
        </RemoteConfigProvider>
        <Toaster />
      </body>
    </html>
  );
}
