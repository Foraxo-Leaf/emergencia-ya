
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { RemoteConfigProvider } from "@/hooks/useRemoteConfig";
import { SeedDB } from "@/components/SeedDB";

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
  manifest: "/manifest.json",
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

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="icon" href="/favicon.ico" sizes="any" />
         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
