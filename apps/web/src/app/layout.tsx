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

export const metadata: Metadata = {
  title: "FPdoc - Gestión Curricular Colaborativa",
  description: "Plataforma de gestión académica avanzada para la Formación Profesional.",
  manifest: "/manifest.json",
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
