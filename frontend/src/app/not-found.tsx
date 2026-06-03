import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-28 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
        <Compass className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-black tracking-tight text-foreground">
        Página no encontrada
      </h1>
      <p className="mt-2 text-muted-foreground">
        El producto o la página que buscas no está disponible.
      </p>
      <Link href="/" className={buttonClasses("primary", "md", "mt-6")}>
        Volver al inicio
      </Link>
    </div>
  );
}
