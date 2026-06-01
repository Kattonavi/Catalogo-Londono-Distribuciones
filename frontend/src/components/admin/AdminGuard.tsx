"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/adminAuth";
import { me } from "@/services/adminApi";
import type { AdminUser } from "@/types/admin";
import { FullScreenLoader } from "./States";

/**
 * Protege las rutas del panel: exige token y valida la sesión con /api/auth/me.
 * Si no hay sesión válida, redirige a /admin/login.
 */
export function AdminGuard({
  children,
}: {
  children: (user: AdminUser) => ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    if (!getAccessToken()) {
      router.replace("/admin/login");
      return;
    }
    me()
      .then((u) => {
        if (active) {
          setUser(u);
          setChecking(false);
        }
      })
      .catch(() => {
        clearTokens();
        router.replace("/admin/login");
      });
    return () => {
      active = false;
    };
  }, [router]);

  if (checking || !user) {
    return <FullScreenLoader label="Verificando sesión..." />;
  }

  return <>{children(user)}</>;
}
