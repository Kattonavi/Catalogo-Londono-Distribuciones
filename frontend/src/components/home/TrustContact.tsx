import { ShieldCheck, Zap, Tags, MessageCircle } from "lucide-react";
import { GENERAL_MESSAGE } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const items = [
  {
    icon: ShieldCheck,
    title: "Marcas confiables",
    text: "Trabajamos con marcas reconocidas y productos de calidad.",
  },
  {
    icon: Tags,
    title: "Precios claros",
    text: "Sin sorpresas: ves el precio y el descuento al instante.",
  },
  {
    icon: Zap,
    title: "Atención rápida",
    text: "Te respondemos directo por WhatsApp para tu pedido.",
  },
];

export function TrustContact() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-card border border-border bg-card p-6 shadow-sm"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <item.icon className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-card bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 p-8 text-white shadow-lg shadow-brand-900/20 ring-1 ring-white/10 sm:p-12">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h3 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              <MessageCircle className="size-7 text-wa" />
              ¿Listo para hacer tu pedido?
            </h3>
            <p className="mt-2 text-brand-100">
              Escríbenos por WhatsApp y te atendemos de inmediato. Sin
              complicaciones.
            </p>
          </div>
          <WhatsAppButton
            message={GENERAL_MESSAGE}
            label="Escribir por WhatsApp"
            size="lg"
          />
        </div>
      </div>
    </section>
  );
}
