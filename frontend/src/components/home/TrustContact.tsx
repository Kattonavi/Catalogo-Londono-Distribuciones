import { Truck, Boxes, Store, MessageCircle } from "lucide-react";
import { GENERAL_MESSAGE } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BubbleField } from "@/components/ui/BubbleField";

const items = [
  {
    icon: Truck,
    title: "Entrega local",
    text: "Cobertura cercana y reparto en tu zona, sin complicaciones.",
  },
  {
    icon: Boxes,
    title: "Variedad de bebidas",
    text: "Gaseosas, aguas, jugos, energizantes y más en un solo lugar.",
  },
  {
    icon: Store,
    title: "Pensado para negocios",
    text: "Surtido para tiendas, restaurantes y puntos de venta.",
  },
  {
    icon: WhatsAppIcon,
    title: "Atención por WhatsApp",
    text: "Te respondemos directo y armamos tu pedido al instante.",
  },
];

export function TrustContact() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-card border border-border bg-card p-6 shadow-editorial transition-all hover:-translate-y-1 hover:border-brand-400/60 hover:shadow-cold"
          >
            <span className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground/50">
              0{i + 1}
            </span>
            <span className="mt-4 grid size-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 ring-1 ring-brand-500/20 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-300">
              <item.icon className="size-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="grain relative mt-8 overflow-hidden rounded-card bg-[#05070f] p-8 text-white ring-1 ring-white/10 sm:p-12">
        <div className="bg-grid-onlight pointer-events-none absolute inset-0 opacity-70" />
        <BubbleField count={12} className="opacity-60" />
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-brand-600/40 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 size-72 rounded-full bg-new/15 blur-[110px]" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h3 className="flex items-center gap-2.5 font-display text-3xl font-black tracking-tight sm:text-4xl">
              <MessageCircle className="size-8 text-brand-300" />
              ¿Listo para hacer tu pedido?
            </h3>
            <p className="mt-3 text-slate-300">
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
