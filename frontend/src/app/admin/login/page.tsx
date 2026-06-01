"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, AlertTriangle } from "lucide-react";
import { login } from "@/services/adminApi";
import { hasSession } from "@/lib/adminAuth";
import { hasApi } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/admin/fields";

const schema = z.object({
  email: z.string().min(1, "El email es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (hasSession()) router.replace("/admin");
  }, [router]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.replace("/admin");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "No se pudo iniciar sesión");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-600 text-xl font-black text-white">
            L
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Londoño Distribuciones
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          {!hasApi && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                NEXT_PUBLIC_API_URL no está configurada. Define la URL del
                backend en <code>.env.local</code> para iniciar sesión.
              </span>
            </div>
          )}

          <Field label="Email" htmlFor="email" required error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="admin@londono.local"
              className={inputClass}
              {...register("email")}
            />
          </Field>

          <Field
            label="Contraseña"
            htmlFor="password"
            required
            error={errors.password?.message}
          >
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password")}
            />
          </Field>

          {serverError && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-600">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            <LogIn className="size-5" />
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}
