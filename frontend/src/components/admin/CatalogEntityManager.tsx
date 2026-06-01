"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "./PageHeader";
import { Modal, ConfirmDialog } from "./Dialog";
import { Field, inputClass, textareaClass, CheckboxRow } from "./fields";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "./States";
import { useToast } from "./Toast";
import { cn } from "@/lib/utils";

export interface CatalogEntity {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  sortOrder: number;
}

export interface EntityPayload {
  name: string;
  description?: string | null;
  active?: boolean;
  sortOrder?: number;
}

interface ManagerConfig<T extends CatalogEntity> {
  singular: string; // "marca"
  plural: string; // "Marcas"
  queryKey: string; // "admin-brands"
  list: () => Promise<T[]>;
  create: (payload: EntityPayload) => Promise<T>;
  update: (id: number, payload: EntityPayload) => Promise<T>;
  toggleActive: (id: number) => Promise<T>;
  remove: (id: number) => Promise<null>;
}

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(120, "Máximo 120 caracteres"),
  description: z.string().max(2000),
  sortOrder: z
    .string()
    .refine(
      (v) => v.trim() !== "" && Number.isInteger(Number(v)) && Number(v) >= 0,
      "Debe ser un entero >= 0",
    ),
  active: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export function CatalogEntityManager<T extends CatalogEntity>({
  config,
}: {
  config: ManagerConfig<T>;
}) {
  const toast = useToast();
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const query = useQuery({ queryKey: [config.queryKey], queryFn: config.list });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", sortOrder: "0", active: true },
  });

  useEffect(() => {
    if (modalOpen) {
      reset({
        name: editing?.name ?? "",
        description: editing?.description ?? "",
        sortOrder: String(editing?.sortOrder ?? 0),
        active: editing?.active ?? true,
      });
    }
  }, [modalOpen, editing, reset]);

  function invalidate() {
    qc.invalidateQueries({ queryKey: [config.queryKey] });
  }

  async function onSubmit(values: FormValues) {
    const payload: EntityPayload = {
      name: values.name,
      description: values.description ? values.description : null,
      active: values.active,
      sortOrder: Number(values.sortOrder),
    };
    try {
      if (editing) {
        await config.update(editing.id, payload);
        toast.success(`${cap(config.singular)} actualizada`);
      } else {
        await config.create(payload);
        toast.success(`${cap(config.singular)} creada`);
      }
      invalidate();
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    }
  }

  const toggleMutation = useMutation({
    mutationFn: (id: number) => config.toggleActive(id),
    onSuccess: () => {
      invalidate();
      toast.success("Estado actualizado");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Error al cambiar el estado"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => config.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success(`${cap(config.singular)} eliminada`);
      setDeleteTarget(null);
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      setDeleteTarget(null);
    },
  });

  const items = query.data ?? [];

  return (
    <div>
      <PageHeader
        title={config.plural}
        subtitle={`Gestiona las ${config.plural.toLowerCase()} del catálogo`}
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="size-5" /> Nueva {config.singular}
          </Button>
        }
      />

      {query.isLoading ? (
        <LoadingBlock />
      ) : query.isError ? (
        <ErrorBlock onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyBlock
          title={`Sin ${config.plural.toLowerCase()}`}
          message={`Crea la primera ${config.singular} para empezar.`}
          action={
            <Button
              className="mt-2"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus className="size-5" /> Nueva {config.singular}
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Orden</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.slug}</td>
                    <td className="px-4 py-3 text-slate-500">{item.sortOrder}</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.active ? "featured" : "neutral"}>
                        {item.active ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          title={item.active ? "Desactivar" : "Activar"}
                          onClick={() => toggleMutation.mutate(item.id)}
                          disabled={toggleMutation.isPending}
                        >
                          <Power
                            className={cn(
                              "size-4",
                              item.active ? "text-emerald-500" : "text-slate-400",
                            )}
                          />
                        </IconButton>
                        <IconButton
                          title="Editar"
                          onClick={() => {
                            setEditing(item);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="size-4 text-slate-500" />
                        </IconButton>
                        <IconButton
                          title="Eliminar"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 className="size-4 text-rose-500" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? `Editar ${config.singular}` : `Nueva ${config.singular}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Nombre" htmlFor="name" required error={errors.name?.message}>
            <input id="name" className={inputClass} {...register("name")} />
          </Field>
          <Field label="Descripción" htmlFor="description" error={errors.description?.message}>
            <textarea
              id="description"
              rows={3}
              className={textareaClass}
              {...register("description")}
            />
          </Field>
          <Field
            label="Orden de presentación"
            htmlFor="sortOrder"
            hint="Menor número aparece primero"
            error={errors.sortOrder?.message}
          >
            <input
              id="sortOrder"
              type="number"
              min={0}
              className={inputClass}
              {...register("sortOrder")}
            />
          </Field>
          <CheckboxRow
            label="Activa"
            description="Solo las activas se muestran en el sitio público"
            {...register("active")}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setModalOpen(false);
                setEditing(null);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Eliminar ${config.singular}`}
        message={`¿Seguro que deseas eliminar "${deleteTarget?.name}"? Si tiene productos asociados, el backend lo impedirá.`}
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function IconButton({
  title,
  onClick,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className="grid size-9 place-items-center rounded-lg hover:bg-slate-100 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
