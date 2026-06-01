"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Envuelve el contenido con el navbar/footer públicos, EXCEPTO en /admin,
 * que tiene su propio shell. Evita mover las páginas públicas existentes.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
