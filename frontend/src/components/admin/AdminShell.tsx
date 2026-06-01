"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Bookmark,
  Tags,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/services/adminApi";
import type { AdminUser } from "@/types/admin";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/marcas", label: "Marcas", icon: Bookmark },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
];

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex">
        <Brand />
        <div className="mt-6 flex-1">{nav}</div>
        <Footer user={user} onLogout={handleLogout} />
      </aside>

      {/* Topbar mobile */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <Menu className="size-6" />
        </button>
      </header>

      {/* Drawer mobile */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 lg:hidden"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="flex h-full w-72 max-w-[80%] flex-col bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar menú"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6 flex-1">{nav}</div>
            <Footer user={user} onLogout={handleLogout} />
          </div>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 font-black text-white">
        L
      </span>
      <span className="text-sm font-extrabold leading-tight text-slate-900">
        Londoño
        <span className="block text-xs font-semibold text-slate-400">
          Admin
        </span>
      </span>
    </Link>
  );
}

function Footer({
  user,
  onLogout,
}: {
  user: AdminUser;
  onLogout: () => void;
}) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <Link
        href="/"
        target="_blank"
        className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
      >
        <ExternalLink className="size-4" /> Ver sitio público
      </Link>
      <div className="px-3 py-2">
        <p className="truncate text-sm font-semibold text-slate-700">
          {user.name}
        </p>
        <p className="truncate text-xs text-slate-400">{user.email}</p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
      >
        <LogOut className="size-4" /> Cerrar sesión
      </button>
    </div>
  );
}
