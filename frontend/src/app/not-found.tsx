import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-28 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 ring-1 ring-brand-500/20 dark:text-brand-300">
        <Compass className="size-8" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground">
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
