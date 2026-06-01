"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { GENERAL_MESSAGE } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
      {/* Adornos de fondo */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-brand-400/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
            <Sparkles className="size-4" /> Catálogo siempre actualizado
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Los productos que tu negocio necesita,
            <span className="text-brand-200"> a un toque.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100">
            Londoño Distribuciones reúne las mejores marcas con precios claros y
            promociones reales. Explora el catálogo y pide al instante por
            WhatsApp.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className={buttonClasses("white", "lg", "group")}
            >
              Ver catálogo
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <WhatsAppButton message={GENERAL_MESSAGE} label="Pedir por WhatsApp" size="lg" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
