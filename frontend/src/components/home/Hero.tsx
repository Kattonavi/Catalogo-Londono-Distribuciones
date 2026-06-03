"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { GENERAL_MESSAGE } from "@/lib/whatsapp";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#05070f] text-white grain">
      {/* Rejilla técnica + difuminado */}
      <div className="bg-grid-onlight grid-fade pointer-events-none absolute inset-0" />
      {/* Resplandores de marca */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-[26rem] rounded-full bg-brand-600/40 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10rem] top-1/3 size-[30rem] rounded-full bg-brand-500/30 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-1/3 size-72 rounded-full bg-lime-accent/10 blur-[120px]" />
      {/* Línea superior de acento */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-200 backdrop-blur">
            <Sparkles className="size-3.5 text-lime-accent" /> Catálogo siempre
            actualizado
          </span>

          <h1 className="mt-7 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
            Los productos
            <br />
            que tu negocio
            <br />
            necesita,{" "}
            <span className="relative whitespace-nowrap text-brand-300">
              a un toque
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-lime-accent" />
            </span>
            .
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
            Reunimos las mejores marcas con precios claros y promociones reales.
            Explora el catálogo y pide al instante por WhatsApp.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className={buttonClasses("accent", "lg", "group")}
            >
              Ver catálogo
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <WhatsAppButton
              message={GENERAL_MESSAGE}
              label="Pedir por WhatsApp"
              size="lg"
            />
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-7">
            {[
              { k: "Marcas", v: "+50" },
              { k: "Respuesta", v: "Rápida" },
              { k: "Pedidos", v: "WhatsApp" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-xs uppercase tracking-wider text-slate-400">
                  {s.k}
                </dt>
                <dd className="mt-1 font-display text-xl font-bold text-white">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Tarjeta flotante decorativa (bento) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand-600/30 to-lime-accent/10 blur-2xl" />
          <div className="relative grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-lime-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#06121a]">
                Promo
              </span>
              <p className="mt-4 font-display text-2xl font-bold leading-tight">
                Descuentos reales,
                <br /> sin letra pequeña.
              </p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-brand-300">
                  -25%
                </span>
                <span className="text-sm text-slate-400">en marcas selectas</span>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-500/20 text-brand-300">
                <Sparkles className="size-6" />
              </span>
              <p className="text-sm text-slate-300">
                Catálogo curado y actualizado por nuestro equipo, listo para tu
                negocio.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
