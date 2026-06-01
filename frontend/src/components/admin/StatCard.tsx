import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "brand",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "brand" | "promo" | "new" | "featured" | "slate";
}) {
  const accents: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    promo: "bg-rose-50 text-rose-500",
    new: "bg-cyan-50 text-cyan-600",
    featured: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl",
          accents[accent],
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
        </p>
        <p className="truncate text-xs font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}
