import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const viewport = {
  themeColor: '#0d6e6e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const isProd = process.env.NODE_ENV === "production";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isProd ? "/fpdoc" : "");

export const metadata: Metadata = {
  title: "FPdoc - Gestión Curricular",
  description: "Plataforma avanzada para la gestión de programaciones y transversalidad en FP.",
  manifest: `${basePath}/manifest.json`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
