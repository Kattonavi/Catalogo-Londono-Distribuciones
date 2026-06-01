import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteChrome } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Londoño Distribuciones — Catálogo de productos",
    template: "%s | Londoño Distribuciones",
  },
  description:
    "Catálogo comercial de Londoño Distribuciones: marcas confiables, promociones y pedidos directos por WhatsApp.",
  keywords: ["distribuidora", "catálogo", "productos", "promociones", "WhatsApp"],
  openGraph: {
    title: "Londoño Distribuciones",
    description:
      "Marcas confiables, promociones reales y pedidos por WhatsApp.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
