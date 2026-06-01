import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-200 disabled:bg-slate-50";

export const textareaClass =
  "w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-200";

export const selectClass = inputClass;

/** Envoltura de campo: label + control + mensaje de error. */
export function Field({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

/** Switch/checkbox estilizado controlado por register de RHF. */
export function CheckboxRow({
  label,
  description,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50",
        className,
      )}
    >
      <input
        type="checkbox"
        className="mt-0.5 size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
        {...props}
      />
      <span>
        <span className="block text-sm font-semibold text-slate-700">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-slate-400">{description}</span>
        )}
      </span>
    </label>
  );
}
