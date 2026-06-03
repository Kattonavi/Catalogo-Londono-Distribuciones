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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#070d1c" },
  ],
};

// Aplica el tema guardado (o la preferencia del sistema) ANTES del primer
// paint para evitar el parpadeo claro→oscuro al cargar.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t!=='light'&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
