import { Loader2, AlertTriangle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={className ?? "size-5 animate-spin"} />;
}

export function FullScreenLoader({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="size-8 animate-spin text-brand-500" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function LoadingBlock({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white py-16 text-slate-400">
      <Loader2 className="size-5 animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function ErrorBlock({
  message = "Ocurrió un error al cargar los datos.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50/50 py-16 text-center">
      <AlertTriangle className="size-7 text-rose-500" />
      <p className="max-w-sm text-sm font-medium text-slate-600">{message}</p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function EmptyBlock({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">
        <Inbox className="size-6" />
      </span>
      <p className="text-base font-bold text-slate-900">{title}</p>
      {message && <p className="max-w-sm text-sm text-slate-500">{message}</p>}
      {action}
    </div>
  );
}
