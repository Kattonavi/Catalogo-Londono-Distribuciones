"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  Tag,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { getAnalyticsSummary } from "@/services/adminAnalytics";
import type { ProductMetricItem } from "@/types/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { LoadingBlock, ErrorBlock } from "@/components/admin/States";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: getAnalyticsSummary,
  });

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen del catálogo de Londoño Distribuciones"
      />

      {isLoading ? (
        <LoadingBlock label="Cargando métricas..." />
      ) : isError || !data ? (
        <ErrorBlock onRetry={() => refetch()} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Productos" value={data.totalProducts} icon={Package} />
            <StatCard
              label="Visibles"
              value={data.visibleProducts}
              icon={Eye}
              accent="slate"
            />
            <StatCard
              label="Activos"
              value={data.activeProducts}
              icon={EyeOff}
              accent="slate"
            />
            <StatCard
              label="Destacados"
              value={data.featuredProducts}
              icon={Star}
              accent="featured"
            />
            <StatCard
              label="Nuevos"
              value={data.newProducts}
              icon={Sparkles}
              accent="new"
            />
            <StatCard
              label="En promoción"
              value={data.promoProducts}
              icon={Tag}
              accent="promo"
            />
            <StatCard
              label="Vistas totales"
              value={data.totalViews}
              icon={BarChart3}
            />
            <StatCard
              label="Clicks WhatsApp"
              value={data.totalWhatsappClicks}
              icon={MessageCircle}
              accent="new"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <MetricList
              title="Más vistos"
              icon={<BarChart3 className="size-5 text-brand-600" />}
              items={data.mostViewedProducts}
              unit="vistas"
            />
            <MetricList
              title="Más clicks a WhatsApp"
              icon={<MessageCircle className="size-5 text-wa" />}
              items={data.mostWhatsappClickedProducts}
              unit="clicks"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricList({
  title,
  icon,
  items,
  unit,
}: {
  title: string;
  icon: React.ReactNode;
  items: ProductMetricItem[];
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
        {icon}
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Aún no hay datos.
        </p>
      ) : (
        <ol className="space-y-2">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                {i + 1}
              </span>
              <span className="flex-1 truncate text-sm font-medium text-slate-700">
                {item.name}
              </span>
              <span className="shrink-0 text-sm font-bold text-slate-900">
                {item.count}{" "}
                <span className="text-xs font-normal text-slate-400">
                  {unit}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
