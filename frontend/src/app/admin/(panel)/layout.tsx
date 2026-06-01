"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/Toast";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminGuard>
        {(user) => <AdminShell user={user}>{children}</AdminShell>}
      </AdminGuard>
    </ToastProvider>
  );
}
